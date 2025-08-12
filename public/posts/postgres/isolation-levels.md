---
title: "Isolation Levels in PostgreSQL"
description: "Learn about different isolation levels in PostgreSQL and how they effects the transactional behaviour"
author: "Siva"
date: 2025-08-12
tags: ["PostgreSQL"]
canonical_url: "https://bysiva.vercel.app/blog/isolation-levels"
---

# Transaction Isolation Levels

- [Transaction Isolation Levels](#transaction-isolation-levels)
  - [Introduction](#introduction)
    - [In MVCC](#in-mvcc)
  - [Isolation Levels in Detail](#isolation-levels-in-detail)
    - [READ UNCOMMITTED](#read-uncommitted)
    - [READ COMMITTED (Default)](#read-committed-default)
      - [Example](#example)
    - [REPEATABLE READ](#repeatable-read)
      - [Example](#example-1)
      - [Example for Write Skew](#example-for-write-skew)
    - [SERIALIZABLE](#serializable)

## Introduction
PostgreSQL uses `MVCC` **(Multi-Version Concurrency Control)** to allow multiple transactions to operate on the database at the same time without blocking each other unnecessarily.

### In MVCC
- Each transaction sees a snapshot of the data, determined by the moment the transaction (or individual statement) starts.
- When a row is updated, PostgreSQL creates a new version of that row rather than overwriting it by maintaining metadata like **xmin** and **xmax** etc.
- Old versions remain visible to transactions that started before the change, while newer transactions can see the updated version.
- This means readers don’t block writers, and writers don’t block readers in most cases.

However, even with MVCC, concurrency can lead to phenomena like:
- _Dirty reads_ (seeing uncommitted data)
- _Non-repeatable reads_ (seeing changed data between two reads)
- _Phantom reads_ (seeing new rows between two reads)
- _Write skew_ (both transactions modify disjoint rows but together violate an invariant)

**_Isolation levels_** define which of these phenomena are allowed in a given transaction, and therefore how much “concurrent reality” your transaction is protected from.
PostgreSQL supports four SQL-standard isolation levels:
- **READ UNCOMMITTED** – Treated as READ COMMITTED in PostgreSQL.
- **READ COMMITTED** – Default level; snapshot per statement.
- **REPEATABLE READ** – Snapshot per transaction; prevents non-repeatable reads but not write skew.
- **SERIALIZABLE** – Enforces full serializable execution using Serializable Snapshot Isolation (SSI).
The choice of isolation level determines the trade-off between performance and consistency guarantees.

## Isolation Levels in Detail
### READ UNCOMMITTED
- Present for SQL standard compatibility.
- Postgres treats it exactly like **_READ COMMITTED_** — no dirty reads, no inconsistent reads beyond what READ COMMITTED allows.

### READ COMMITTED (Default)
- Snapshots (a set of  transaction IDs visible to transaction) is taken at each statement start.
- A repeated SELECT (in the same transaction) can see changes committed by other transactions.
- Prevents dirty reads means transaction with this isolation level won't see uncommitted data.
#### Example
```sql
    BEGIN; -- Txn 1                                         |
    SELECT COUNT(*) FROM TASKS; -- Sees 10 rows             |
                                                            |   BEGIN; -- Txn 2 (executing concurrent to txn 1)
                                                            |   INSERT INTO TASKS VALUES(11, 'OPEN');
                                                            |   COMMIT; -- Txn2 committed
    SELECT COUNT(*) FROM TASKS; -- Sees 11 rows in Txn 1    |
    COMMIT; -- Txn1 committed                               |
```
Typical anomalies in this mode:
- **Non-repeatable read**: T1 reads a row, T2 updates and commits, T1 reads same row again and sees change.
  - Non-repeatable reads means when a same query run multiple times in a transaction but yield different results because of other transactions commits
- **Phantom rows**: T1 runs a range query twice; T2 inserts a row between the two statements and commits; T1’s second statement can see that new row.

### REPEATABLE READ
- Snapshot taken at the start of the transaction and that's it, all the statements executed in that transaction sees the same snapshots.
- Prevents non-repeatable reads for repeated queries in the same transaction as _snapshot for that transaction is fixed_.
- Write-skew is type of anamoly that can happen here.
#### Example
```sql
    BEGIN; -- Txn 1                                         |
    SELECT COUNT(*) FROM TASKS; -- Sees 10 rows             |
                                                            |   BEGIN; -- Txn 2 (executing concurrent to txn 1)
                                                            |   INSERT INTO TASKS VALUES(11, 'OPEN');
                                                            |   COMMIT; -- Txn2 committed
    SELECT COUNT(*) FROM TASKS; -- Still sees 10 rows       |
    COMMIT; -- Txn1 committed                               |
```
#### Example for Write Skew
```sql
CREATE TABLE oncall (doctor int PRIMARY KEY, oncall boolean);
INSERT INTO oncall VALUES (1, true), (2, true);

-- Session A
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;          |
SELECT * FROM oncall;  -- sees doctor 1 and 2 oncall=true   |
UPDATE oncall SET oncall = false WHERE doctor = 1;          |
                                                            |        -- Session B (concurrent)
                                                            |        BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
                                                            |        SELECT * FROM oncall;  -- sees doctor 1 and 2 oncall=true
                                                            |        UPDATE oncall SET oncall = false WHERE doctor = 2;
                                                            |        COMMIT;  -- commits fine
COMMIT;  -- also commits fine                               |
-- Result: both set oncall=false -> no doctor on call (invariant violated)
```
- Here the invariant assumed is atleast one doctor should be on call always.
- Under REPEATABLE READ both transactions can commit; under SERIALIZABLE PostgreSQL will detect the dangerous pattern and abort one of them.

### SERIALIZABLE
- Strongest isolation level — behaves as if transactions were executed one after another in some serial order.
- Implemented as Serializable Snapshot Isolation (SSI):
  - Runs with snapshots (like REPEATABLE READ).
  - Tracks read/write dependencies between concurrent transactions.
  - Aborts one transaction with SQLSTATE 40001 if it detects a dangerous dependency cycle that could lead to a non-serializable outcome.
- Does not block with range locks; instead, it detects and aborts conflicting transactions at commit time.
```sql
ERROR:  could not serialize access due to read/write dependencies among transactions
SQLSTATE: 40001
```
> Notes: SSI detects dangerous cycles of read-write dependencies — it does not prevent them with range locks; it aborts transactions when necessary.