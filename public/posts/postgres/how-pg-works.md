---
title: "How PostgreSQL Works"
description: "In this blog, we will discuss how the PostgreSQL works in reality"
author: "Siva"
date: 2025-09-28
tags: ["PostgreSQL"]
canonical_url: "https://bysiva.vercel.app/blog/how-pg-works"
---
# Ever wondered how PostgreSQL Works?
PostgreSQL is one of the **most used database** around the world. Most developers connects to `psql` and run their queries to get the results. Simple right?  
But under the hood, PostgreSQL does a lot more work than we think other than opening a **Connection**. It involves **_dedicating process to each client, lot of Background Workers which run quietly in the background and moving data between the Shared Memory and Disk_**. In this post, we will go deep into "What actually happens inside the **PostgreSQL** from the moment a client connects until the connection ends".

## 1. The Connection Lifecycle
Let's start from the beginning; When a client tries to connect to PostgreSQL server, the following sets will happen:
### Step-1: Client Initialization
The Client gives the **_Host, Port, Database, Username and Password_** to the server using the protocol called **_Postgres Wire Protocol_** (Frontend/Backend Protocol). Before proceeding to TCP Handshake, some checks will happen regarding the versions and supported features.
### Step-2: TCP Handshake
- PostgreSQL follows a **Client-Server** model. The server spans a `postmaster` listening on port given and when the client reaches out:
  - The Postmaster accepts the request.
  - At the end of this interaction, Postmaster forks a **new Backend Process** - a dedicated process for each connection. Yes that is true, for every connection a new backend process will be allocated.
### Step-3: Startup and Authentication
Once the backend process is Spawned, the client sends a **Startup Packet** with details like username, database and protocol version. Then authentication kicks in:
- PG checks the `pg_hba.conf` file to see how to proceed with authenticate the client.
- If your client pass, the backend spawned is yours to query and get the results.
### Step-4: Ready for query
After Authentication
- The server shares it's runtime params like timezone, encoding server version etc..
- Then it send back the `ReadyForQuery` message to the process means the process is now all set to receive the queries.
From now on, you can send the queries and expect the results.

--- 

## 2. Background Workers/Process
Apart from the Postmaster and the backend connections, there's a handful of other processes constantly running and serving the connections to keep the system healthy and running. They play a key role in improving the database **performance, durability and consistency** of the data. What we called those process in the Postgres is **_Background Workers/Processes_**. Now we are going to discuss some of them here:

### Background Writer
The Background Writer is a daemon process in PostgreSQL responsible for **Writing modified (dirty) buffers from Shared Memory to Disk** gradually.
#### Why it's needed
- Without it, client queries would often be forced to write dirty pages themselves when they need a free buffer **causing sudden query slowdowns**.
- Background Writer smooths I/O activity and reduces the query latency.
#### How it works
- Periodically scans the shared buffer pool.
- **_Identifies dirty buffers (data pages modified but not yet written to disk)_**.
- Writes a limited number of them to disk each cycle, so that free buffers are available for new data requests.
#### Settings
- `bgwriter_delay` → Time between runs (default 200 ms).
- `bgwriter_lru_maxpages` → Max number of pages written per cycle.
- `bgwriter_lru_multiplier` → Controls aggressiveness in writing based on buffer demand.

![Background Writer](https://pub-b8d5ca13188446a08ac9941fcca1304e.r2.dev/writer.webp)

### WAL Writer
The WAL Writer manages writes to the **Write-Ahead Log (WAL)**, ensuring durability of transactions.
#### Why it’s needed
- PostgreSQL follows the WAL protocol: **_changes must be logged before writing data pages_**.
- Without a dedicated WAL writer, backends would compete to flush WAL, hurting performance.
- WAL Writer batches writes to disk, improving throughput.
#### How it works
- WAL records are written first into WAL buffers in memory.
- WAL Writer periodically flushes these to disk.
- This ensures that even if PostgreSQL crashes, committed changes can be replayed from WAL.
#### Settings
- `wal_writer_delay` → Delay between WAL flush cycles (default 200 ms).
- `wal_buffers` → Size of in-memory WAL buffers.  
Learn More Here: [WAL](/blog/wal)  
![WAL](https://pub-b8d5ca13188446a08ac9941fcca1304e.r2.dev/wal-writer.webp)

### Checkpointer Process
The Checkpointer ensures database durability by **periodically flushing dirty buffers and marking safe recovery points**.
#### Why it’s needed
- WAL allows crash recovery, but replaying from the beginning of WAL would be very slow.
- Checkpoints guarantee that **all changes before a certain point are safely on disk**.
- This reduces crash recovery time significantly.
#### How it works
At checkpoint time:
- Flushes all dirty buffers from shared memory to disk.
- Forces WAL up to that point to be written.
- After a checkpoint, WAL before that point is no longer needed for crash recovery.
#### Settings
- `checkpoint_timeout` → Max time between checkpoints.
- `max_wal_size` → WAL size before forcing checkpoint.
- `min_wal_size` → Minimum WAL size to keep.
- `checkpoint_completion_target` → Spreads checkpoint I/O over time (default 0.9 = 90%).
![CheckPointer](https://pub-b8d5ca13188446a08ac9941fcca1304e.r2.dev/checkpointer.webp)

### AutoVacuum 
The AutoVacuum system maintains database health by removing dead tuples and updating table statistics automatically.
#### Why it’s needed
- PostgreSQL uses MVCC (Multi-Version Concurrency Control) → old row versions (dead tuples) accumulate.
- Dead tuples cause table bloat, slow queries, and inaccurate query planner statistics.
- Manual vacuuming would be tedious, so AutoVacuum automates it.
#### How it works
- The autovacuum launcher process wakes up regularly.
- It checks table activity against thresholds.
- If needed, it spawns autovacuum worker processes to:
  - Run VACUUM → reclaim space + maintain visibility maps.
  - Run ANALYZE → refresh query planner statistics.
#### Settings
- `autovacuum` → Enable/disable.
- `autovacuum_naptime` → Time between checks (default 1 min).
- `autovacuum_vacuum_scale_factor` → % of table updates/deletes before vacuum.
- `autovacuum_analyze_scale_factor` → % of table changes before analyze.
- `autovacuum_max_workers` → Max number of worker processes.
![AutoVacuum](https://pub-b8d5ca13188446a08ac9941fcca1304e.r2.dev/autovacuum.webp)  

And many more....
--- 

## Queries
In reality, PostgreSQL follows a **_multi-stage pipeline_** that transforms your SQL statement into a well-optimized executable plan and then runs that plan to fetch the results.
### In Big Picture
PostgreSQL's query execution pipeline can be thought of in five key stages:
- **Parser** - Check syntax and create an internal referencable _Parse Tree_.
- **Analyzer** - The analyzer carries out a semantic analysis of a parse tree and generates a _Query Tree_ (unoptimized).
- **Rewriter** - Rewriter transforms a query tree into better query tree (still unoptimized) by applying **Rules, Views and Constraints**.
- **Planner/Optimizer** - The planner decides the best way to run the query by choosing the best plan tree from the set of generated plan trees that can most effectively be executed from the query tree.
- **Executor** - Finally, the executor executes the query how the choosen plan tells by accessing the tables, views and indexes.
```pgsql
SQL --> Parser --> Analyzer --> Planner/Optimizer --> Executor --> Results
```  
### Stages Breakdown
#### A. Parsing
- PostgreSQL takes our SQL statement and parse it into a `parse tree`.
- It do certain checks on the query like:
  - Syntax (`SELECT` vs `SELEC` ?)
  - Also checks for valid column names, functions exists (like avg(), sum()) etc.
- At the end of this stage, we will posses a raw **parse tree* based on syntax (not optimized).  

**Example**
```sql
    SELECT id, first_name FROM users WHERE age > 30;
```
At this stage, PG only cares that:
- Does the `users` table exists?
- Columns `id`, `first_name` and `age` exists in `users` table?
- `>` is valid?
- All `Keywords` used are valid?

#### B. Analyzer & Rewriting
- Analyzer carries out a **semantic** analysis of a parse tree and generates a query tree.
- In this stage, PostgreSQL rewriter tries to apply the transformation rules defined [here](https://www.postgresql.org/docs/current/rules.html). Few examples:
  - **Views** --> replaced with their underlying query definition.
  - **Rules** --> rewrite logic applied
- At the end of this stage, rewriter convers the parse tree into query tree on bases of semantics (not optimized).  

**Example (based on view)**
```sql
    CREATE VIEW active_users AS SELECT * FROM users WHERE active = true;  -- active_users view

    -- We queried as follows:
    SELECT id FROM active_users WHERE age > 30;
```
Now, the rewriter will transforms the above query into something like:
```sql
    SELECT id FROM users WHERE active = true AND age > 30;
```

#### C. Planner/Optimizer
- The main master mind in the whole execution pipeline.
- It takes the query tree as input and generates the **multiple candidata execution plans** for the query.
- It estimates the **_cost_** of each plan generated using table statistics and selects the **cheapest** one among the all.
- But the cost estimated is based purely on stats available, it might not 100% accurate.
- Cost Factors:
  - Table Size
  - Index Availability
  - Join Algorithms (Nested Loop, Hash Join, Merge Join)
  - Disk I/O vs Memory Usage  

**Example**
```sql
    EXPLAIN SELECT id, first_name FROM users WHERE age > 30;
```
Might returns:
```sql
    Seq Scan on users (cost=0.00..45.00 rows=300 width=12)
        Filter: (age > 30)
```
Meaning
- PostgreSQL will scan the whole `users` table.
  - Seq Scan refers table scan.
  - Some other scan you might come across: `IndexScan`, `TidScan`, `BitmapScan`, `IndexOnlyScan` etc.
- Expected rows in the results will be `~300`.

#### D. Execution
- The executor follows the plan choosen by planner and executes it step by step.
- Execution is **Volcano-Style**, meaning each node gets the results from its child node, and processes them and passes them upwards.  

**Example**
```sql
    EXPLAIN SELECT primary_category, sum(likes) FROM blogs GROUP BY primary_category;

                            QUERY PLAN                          
    --------------------------------------------------------------
    HashAggregate  (cost=102.65..102.66 rows=1 width=13)
        Group Key: primary_category
        ->  Seq Scan on blogs  (cost=0.00..102.43 rows=43 width=9)
    (3 rows)
```
As explained:
- At first, postgresql will scan entire table `blogs` and passes it's results to HashAggregate.
- HashAggregate will apply `Group Key` and computes the `sum(likes)` and gives the results to the users.

---

## Conclusion
PostgreSQL might look simple from the outside — you connect, run a query, and get results — but under the hood, it’s a symphony of processes and stages working together.
- Each client gets its own backend process, ensuring isolation and concurrency.
- The invisible background processes like Background Writer, WAL Writer, Checkpointer, and AutoVacuum quietly keep the system consistent, fast, and crash-safe.
- Queries go through a well-designed multi-stage pipeline — from parsing and rewriting to planning and execution — to ensure that you always get efficient results.  

This careful design is what makes PostgreSQL both powerful and reliable. Whether you’re running small apps or managing massive enterprise systems, these background workers and query lifecycle steps are the reason PostgreSQL can handle it all with such grace.  

So next time you type SELECT * FROM users;, remember: there’s a whole army of processes making sure you get your data quickly, safely, and efficiently. 🚀