---
title: "Write-Ahead Logging"
description: "Blog post on postgreSQL WAL and how it preserve/restore the data on crash. "
author: "Siva"
date: 2025-08-25
tags: ["PostgreSQL"]
canonical_url: "https://bysiva.vercel.app/blog/wal"
---

# Write-Ahead Logging (WAL)

## Table of Contents
- [Write-Ahead Logging (WAL)](#write-ahead-logging-wal)
  - [Table of Contents](#table-of-contents)
  - [Definition](#definition)
  - [Core Principle](#core-principle)
  - [Why WAL is important?](#why-wal-is-important)
  - [WAL Workflow: Simplified Version](#wal-workflow-simplified-version)
  - [Example](#example)
  - [Crash Simulation](#crash-simulation)
  - [WAL File Structure](#wal-file-structure)
  - [Practical Usage \& Tuning](#practical-usage--tuning)
  - [Understanding WAL files and Sequence Numbers](#understanding-wal-files-and-sequence-numbers)
    - [Log Sequence Number (LSN)](#log-sequence-number-lsn)
    - [WAL File](#wal-file)
      - [Example](#example-1)
      - [Current WAL LSN and insert LSN](#current-wal-lsn-and-insert-lsn)
  - [Inspect the WAL files](#inspect-the-wal-files)
  - [Official Docs](#official-docs)
  - [Closing Notes](#closing-notes)

## Definition
**WAL** stands for **_Write-Ahead Logging_**. It is a PostgreSQL method to ensure the **ACID** durability; any changes are first written sequentially into the WAL log files before being applied to the Date files (_Heap & Indexes_).

## Core Principle
> Never change Data files like **Heap & Indexes** (where the actual data stores) before the corresponding changes are securely logged in the WAL.

```mermaid
flowchart TD
    A[Client Transaction] --> B[Shared Buffers<br/>(Dirty Pages in Memory)]
    B --> C[WAL Buffers]
    C --> D[WAL Files<br/>($PGDATA/pg_wal/)]
    D -->|Checkpoint or BG Writer| E[Data Files<br/>(Heap & Indexes)]

    subgraph Commit Flow
        C --> F[fsync WAL Record]
        F --> G[COMMIT Acknowledged ✅]
    end

    subgraph Crash Recovery
        H[Crash Occurs] --> I[Restart PostgreSQL]
        I --> J[WAL Replay<br/>Redo INSERT/UPDATE/DELETE]
        J --> E
    end

```

## Why WAL is important?
1. **Crash Recovery**
   1. If the server crashes, PostgreSQL can replay WAL records to restore consistency.
2. **Durability Guarantee**
   1. COMMIT is only acknowledged after the WAL record is flushed to disk (fsync), not after data files are updated.
3. **Replication and PITR (Point-In-Time Recovery)**
   1. WAL is shipped to standbys (streaming replication) or archived for PITR.
4. **Performance**
   1. Sequential writes to WAL are much faster than random writes to data pages.

## WAL Workflow: Simplified Version
- A transaction modifies the rows in memory (**_Shared Buffers_**).
- Before flushing these dirty pages to the Disk, PostgreSQL writes a corresponding records to the WAL buffers.
- On **`COMMIT`**:
  - WAL is flushed to the disk (`fsync`)
  - Data Changes in Shared buffer can be written later by the _Checkpoint or Background Writer_.
  
## Example
We’ll do three things:
- Start a transaction that modifies data.
- Observe WAL activity (pg_current_wal_lsn, pg_waldump).
- See how changes hit data files only after checkpoints.
```sql

    -- Create Table
    CREATE TABLE wal_demo(id serial, data text);
    INSERT INTO wal_demo(data) VALUES ('before crash');

    -- LSN before new insert
    SELECT pg_current_wal_lsn() AS lsn_before; -- Says 0/3F8B660

    -- Run a transaction
    BEGIN;
    INSERT INTO wal_demo(data) VALUES ('after commit - WAL first');
    COMMIT;

    -- LSN after new insert
    SELECT pg_current_wal_lsn() AS lsn_after; -- Says 0/3F8B720

    -- Difference in bytes of WAL written
    SELECT pg_size_pretty(pg_wal_lsn_diff('0/3F8B720', '0/3F8B660')); -- Says, 192 bytes

    -- At this moment, the actual table’s data file may not yet reflect the row, because PostgreSQL waits until:
    -- CheckPoint
    -- Background writer flush, so here we are doing CheckPoint
    CHECKPOINT;
    -- Now the page is definitely flushed to disk.
```
## Crash Simulation
```text
    INSERT → WAL write → COMMIT → crash → restart → WAL replay → data restored
```
- If PostgreSQL crashes after COMMIT but before CHECKPOINT:
  - Data files don’t yet show the row.
  - On restart, WAL is replayed → PostgreSQL re-applies the INSERT → row is back ✅
  - On restart, we can see the log message like
  ```makefile
    redo starts at ...
    redo done at ...
  ```
- If crash happens before WAL flush:
  - The row is lost (transaction never considered committed).

## WAL File Structure
- Stored in `$PGDATA/pg_wal/`
- Files are usually **`16MB`** each, and can be configurable at build time.
- Records inside WAL describe the changes like **_Insert tuple in Page X at Offset Y_**

## Practical Usage & Tuning
WAL is not just a crash recovery mechanism; it is central to PostgreSQL performance and high availability. Here are some key areas where WAL plays a role:
1. Replication & PITR
   1. Streaming Replication: WAL records are continuously shipped to standby servers for real-time replication.
   2. Point-in-Time Recovery (PITR): Archived WAL files allow restoring a database to any point in time after a base backup.
2. Performance Considerations
   1. WAL writes are sequential, which is faster than random data writes.
   2. Reducing fsync latency (e.g., with fast disks or wal_compression) improves commit speed.
   3. Checkpoints balance between WAL growth and recovery time.
3. Important Parameters
   1. `wal_level`: Controls the detail of WAL records. Common values:
      1. minimal: only for crash recovery (no replication).
      2. replica: required for streaming replication.
      3. logical: required for logical replication.
   2. `max_wal_size`: Maximum size WAL can grow before triggering a checkpoint.
   3. archive_mode & archive_command: Enables WAL archiving for PITR.
   4. `synchronous_commit`: Controls whether to wait for WAL fsync on COMMIT. Can be relaxed for higher throughput.
   5. `wal_compression`: Compresses WAL records, reducing disk usage at the cost of CPU.

## Understanding WAL files and Sequence Numbers
### Log Sequence Number (LSN)
PostgreSQL create WAL records for the each transaction executed in the database and append them to the WAL logfiles. The position where the current record placed is called as the **_Log Sequence Number (LSN)_**. The difference between two LSN values gives you the amount of WAL generated between those in bytes. 
The LSN is a `64-bit` integer, representing it's position in the WAL log. This 64-bit LSN integer is splited into equal segments of 32-bit integers and we call them **High 32 bits** and **Low 32 bits**. And the common representation of the LSN is _two hexadecimal numbers separated by a slash_ **`XXXXXXXX/YYZZZZZZ`**, where 'X' represent the high bits, 'Y' is the high 8bits of the lower 32-bits section and finally 'Z' represents the record's offset position in the file. And each element is a **_Hexadecimal Number_**.

### WAL File
The WAL file name is in the format _`TTTTTTTTXXXXXXXXYYYYYYYY`_. Here 'T' is the timeline, 'X' is the high 32-bits part of LSN similarly 'Y' is the low 32-bits part of LSN.

#### Example
```makefile
    LSN: 0/3F8B660
    Here, Higher Bits: 0
          Low-High 8Bits: 03 (or 3)

    WAL File: 00000001 00000000 00000003
    Timeline: 00000001
    LSN Higher Bits: 00000000
    LSN Low-High Bits: 00000003 (6 Leading Zeroes)
```
#### Current WAL LSN and insert LSN
We have helper functions to get the current WAL LSN and insert LSN like `pg_current_wal_lsn` which gives the location of the **_last write_**. The `pg_current_wal_insert_lsn` is the logical location reflects **_data in the buffer that has not been written to the disk_**.
```sql
postgres=# select pg_current_wal_lsn(), pg_current_wal_insert_lsn();
 pg_current_wal_lsn | pg_current_wal_insert_lsn 
--------------------+---------------------------
 0/3F8C580          | 0/3F8C580
(1 row)
```


## Inspect the WAL files
```sql
postgres=# select pg_current_wal_lsn(), pg_current_wal_insert_lsn();
 pg_current_wal_lsn | pg_current_wal_insert_lsn 
--------------------+---------------------------
 0/3F8C580          | 0/3F8C580
(1 row)

postgres=# insert into wal_demo (data) values ('sample');
INSERT 0 1

postgres=# select pg_current_wal_lsn(), pg_current_wal_insert_lsn();
 pg_current_wal_lsn | pg_current_wal_insert_lsn 
--------------------+---------------------------
 0/3F8C820          | 0/3F8C820
(1 row)
```
With the information we captured in the previous steps, use `pg_waldump` to get a human readable summary of the WAL segment contents. In the following command the starting position `(-s)` and ending position `(-e)` are specified along with the WAL file name (000000010000000000000003). The start position was the current_wal_lsn before our INSERT and the ending position was the current_wal_lsn after our insert. 
```makefile
pg_waldump -s 76/7E000060 -e 76/7E000108 00000001000000760000007E

RMGR: Transaction ...
RMGR: Heap  action: INSERT ...
```

## Official Docs
- [Postgres Docs](https://www.postgresql.org/docs/current/wal-intro.html)
- [pg_waldump](https://www.postgresql.org/docs/current/pgwaldump.html)

## Closing Notes
Write-Ahead Logging (WAL) is the foundation of PostgreSQL’s durability and reliability. By ensuring that every change is first recorded sequentially in the WAL before touching the actual data files, PostgreSQL guarantees:
- Crash safety → replay WAL to restore consistency.
- Durability → COMMIT is acknowledged only after WAL is safely flushed.
- High availability → WAL powers replication and point-in-time recovery.
- Performance → sequential WAL writes are faster than random heap writes.
In short, WAL is PostgreSQL’s journal of truth — the reason your data survives crashes, powers replication, and scales reliably.
If you’re tuning PostgreSQL or setting up HA (High Availability) systems, understanding WAL is not optional — it’s central to getting durability, performance, and resilience right.