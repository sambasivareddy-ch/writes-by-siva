---
title: "Replication in Postgres"
description: "In this blog, we will discuss about replication, and how to test it"
author: "Siva"
date: 2025-09-18
tags: ["PostgreSQL"]
canonical_url: "https://bysiva.vercel.app/blog/pg-replication"
---

# Replication in PostgreSQL

- [Replication in PostgreSQL](#replication-in-postgresql)
  - [Definition](#definition)
  - [Why Replication is important?](#why-replication-is-important)
  - [Types of Replication](#types-of-replication)
    - [Physical Replication](#physical-replication)
    - [Logical Replication](#logical-replication)
    - [Synchronous vs Asynchronous Replication](#synchronous-vs-asynchronous-replication)
  - [Cluster](#cluster)
  - [Physical Replication](#physical-replication-1)
    - [On Primary Cluster](#on-primary-cluster)
    - [On Replica Cluster](#on-replica-cluster)
    - [Testing / Verification](#testing--verification)
  - [Logical Replication](#logical-replication-1)
    - [On Primary Cluster](#on-primary-cluster-1)
    - [On Replica Cluster](#on-replica-cluster-1)
    - [Verification](#verification)
  - [When to Consider Replication?](#when-to-consider-replication)
  - [Conclusion](#conclusion)
  
## Definition
**Replication** in databases means **_Copying & Maintaining Data Objects, usually like data_**, from one database server (primary/master) to another database server (replica/slave).
- While **master** handles the both `reads & writes` coming to the system, **replica** serves as the `read-only` servers and `backup` to the master

## Why Replication is important?
1. **High Availability (HA)**: Under any circumstances if master crashes, a _replica can take-over as master_, what we called as `failover`.
2. **Load Balancing**: Since the both master & replica contains the same data, replicas can serves the read queries there by reducing the load on master who is serving both reads and writes.
3. **Data Recovery**: Helps in recovering the data when data loss happens.
4. **Minimal Downtime**: Upgrades can be done without much downtime.

## Types of Replication
### Physical Replication
  - Works at **Binary Level**.
  - Replica will be an **Exact Copy** of the Master Database Cluster.
  - Can be run Asynchronously or Synchronously.
  - Uses the **streaming** replication, where the data changes recorded in WAL of master will be streamed to replica in real-time.
### Logical Replication
  - Works at **Table/Data** Level.
  - Master publishes the changes (INSERT/UPDATE/DELETE etc..) to the subscribers (replicas).
  - Flexible: unlike physical replication can replicate only some tables.
  - Useful for migrations, warehousing and multi-version upgrades.
### Synchronous vs Asynchronous Replication
  - **Synchronous**: Transaction on primary is considered committed only after replica confirms. Guarantees no data loss, but slower.
  - **Asynchronous**: Primary doesn’t wait for replica. Faster, but risk of data loss if primary fails before replica catches up.  

![Replication](https://pub-b8d5ca13188446a08ac9941fcca1304e.r2.dev/replication.png)

**Ufff!! That's lot of theory, let's get our hands dirty!!**
## Cluster
Let's initialize a **Primary Cluster**
```bash
    initdb -D /Users/samba-17793/Documents/distdb/experiments/master 
```
- I am going with PORT 6432 instead of default port 5432 (anything is fine). To change the port, change `port` variable in `postgresql.conf` file and restart the postgres to get that applied

## Physical Replication
### On Primary Cluster 
  - Edit the `postgresql.conf`:
    ```ini
        wal_level = replica
        max_wal_senders = 5         //max number of walsender processes
        max_replication_slots = 5   //max number of replication slots
        hot_standby = on
    ```
  - Allow replication in `pg_hba.conf`:
    ```ini
        host replication replicator 127.0.0.1/32 md5
    ```
  - Create a **replication user**:
    ```sql
        CREATE ROLE replicator WITH replication LOGIN PASSWORD '*****';
    ```
  - Now restart the Primary cluster i.e Master
    ```bash
        pg_ctl -D /Users/samba-17793/Documents/distdb/experiments/master -l logfile restart
    ```

### On Replica Cluster
  - Stop PostgreSQl
  - Clone data from primary using pg_basebackup:
    ```bash
        pg_basebackup -h 127.0.0.1 -p 6432 -D /Users/samba-17793/Documents/distdb/experiments/slave -U replicator -P -R
    ```
    - Why **pg_basebackup**? 
      - It makes an initial full copy of the master’s data directory.
      - This ensures the replica starts from the same consistent snapshot as the master.
      - It also writes the standby.signal and connection info (primary_conninfo) so the replica knows:
        - “I am a standby.”
        - “Here’s how to connect to the master for WAL.”
    - -R writes primary_conninfo into **`recovery.signal`**.
  - Edit the **_postgresql.conf_** by changing the `PORT` to 6433.
  - Start the PostgreSQL

### Testing / Verification
- **On Primary Cluster**
  ```sql
    SELECT client_addr, state FROM pg_stat_replication;
  ```
    - Now you should see the **replica** connected.
- **On Replica**
  ```sql
    SELECT pg_is_in_recovery();
  ```
    - It should return true.
  - Now if you create any table and do DMLs on that table, they should replicate in the **replica** as well.
  - And on replica cluster, you can see the **`recovery.signal`** file with the properties set **primary_conninfo**

- **Failover**
  - Crash the Primary Cluster by running the following
  ```bash
    pg_ctl -D /Users/samba-17793/Documents/distdb/experiments/master -m immediate stop
  ``` 
    - `-m immediate` simulates a crash, because it kills the instance instantly without flushing everything.
  - **Promote the Slave to Become New Master**
  ```bash
    pg_ctl -D /Users/samba-17793/Documents/distdb/experiments/slave promote
  ```
    - This changes the **recovery.signal** to `recovery.done`
    - Now you can connect to `6433` and check whether DMLs is working. If works, you can confirm that the slave is being promoted to the master.

## Logical Replication
This is row-level replication (table-based). Replicas can be read-write and don’t have to be identical.
### On Primary Cluster
  - Edit the `postgresql.conf`:
  ```ini
    wal_level = logical
    max_replication_slots = 5
    max_wal_senders = 5
  ```
  - Restart the **PostgreSQL**.
  - Create a **Publication**
  ```sql
    CREATE PUBLICATION my_pub FOR TABLE employees, departments;
  ```

### On Replica Cluster
  - Ensure the same schema exists (tables must exist, but data may be copied).
  - Create a subscription:
  ```sql
    CREATE SUBSCRIPTION my_sub
    CONNECTION 'host=127.0.0.1 port=6433 user=replicator password=***** dbname=postgres'
    PUBLICATION my_pub;
  ```
  - Now inserts/updates/deletes on employees or departments in primary will replicate to the replica.

### Verification
- On replica:
```sql
    SELECT * FROM pg_subscription;
```
- On primary:
```sql
    SELECT * FROM pg_stat_replication;
```

## When to Consider Replication?
You should consider replication when:
- You need high availability for production workloads.
- You want to offload read-heavy workloads to replicas.
- You need disaster recovery with minimal downtime.
- You require real-time reporting/analytics without impacting production.
- You’re performing database migration or upgrades with minimal downtime.

## Conclusion
Replication in PostgreSQL is a powerful feature that ensures high availability, scalability, and disaster recovery. Whether you choose physical replication for a full cluster copy or logical replication for fine-grained control, it enables seamless failover, load balancing, and near real-time data distribution.
By setting it up correctly, you can minimize downtime, improve performance, and make your PostgreSQL setup production-ready for mission-critical applications.