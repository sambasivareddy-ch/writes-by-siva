---
title: "Write-Ahead Logging"
description: "Blog post on postgreSQL WAL and how it preserve/restore the data on crash. "
author: "Siva"
date: 2025-08-25
tags: ["PostgreSQL"]
canonical_url: "https://bysiva.vercel.app/blog/wal"
---

# Write-Ahead Logging (WAL)
## Definition
**WAL** stands for **_Write-Ahead Logging_**. It is a PostgreSQL method to ensure the **ACID** durability; any changes are first written sequentially into the WAL log files before being applied to the Date files (_Heap & Indexes_).

## Core Principle
> Never change Data files like **Heap & Indexes** before the corresponding changes are securely logged in the WAL.

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
- A transaction modifies the rows in memory in **_Shared Buffers_**.
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

## Inspect the WAL files
At the OS level (assuming cluster at /var/lib/postgresql/data):
```bash
    pg_waldump -f -n 10 /var/lib/postgresql/data/pg_wal/
```
You’ll see records like:
```makefile
RMGR: Transaction ...
RMGR: Heap  action: INSERT ...
```

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