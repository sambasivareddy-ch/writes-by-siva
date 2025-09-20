---
title: "How Replication works in Postgres"
description: "In this blog, we will discuss about how Replication works, how WALs helps in achieving that.."
author: "Siva"
date: 2025-09-20
tags: ["PostgreSQL"]
canonical_url: "https://bysiva.vercel.app/blog/how-replication-in-pg-works"
---

# How Replication in PostgreSQL Works (Part-2)

- [How Replication in PostgreSQL Works (Part-2)](#how-replication-in-postgresql-works-part-2)
  - [Pre Reads](#pre-reads)
  - [Definition](#definition)
  - [Replication Working](#replication-working)
    - [WAL Streaming and Replication](#wal-streaming-and-replication)
    - [How the write-ahead log works for replication](#how-the-write-ahead-log-works-for-replication)
  - [Conclusion](#conclusion)

## Pre Reads
This blog article is based on the assumption that you know about, What is Replication and WAL. I am attaching the my blogs on these articles if not, read these article before: 
- [PostgreSQL Replication](/blog/pg-replication)
- [WALs in PostgreSQL](/blog/wal)

## Definition
Replication in databases means **Copying & Maintaining Data Objects, usually like data**, from one database server (primary/master) to another database server (replica/slave).

## Replication Working
- **_PostgreSQL Replication_** is an essential and most powerful feature of the Postgres, which allows the realtime copying of data between the **Primary Cluster** and **Slave Cluster**, ensuring the `HA, fault tolerance and load balancing` in the Production systems.
### WAL Streaming and Replication
- Replication at it's core uses the **`WALs` (Write-Ahead Logging)** to keep the _Master and Slave Clusters in Sync_.
> WAL is a Postgres mechanisms which records all the transactional changes happened in a database before writing to the disk. If any crash happens before committing the changes, PostgreSQL can replay the WAL logs to maintain the consistency. 
- Replication uses the **same WAL logs** to ship the changes to `replica servers`.
- In streaming replication, **_the master cluster continuously send the chunks of WAL logs to the one or more replica servers_**, where they apply these changes to keep it's data files updated and sync with the master server.
### How the write-ahead log works for replication
Here’s a simplified breakdown of the WAL's role in replication:
- **Transaction record**: Whenever a transaction with DMLs (INSERT, UPDATE or DELETE..) occurs, PostgreSQL writes this transaction to the WAL log before committing it to the database files. This ensures that even if the server crashes, the transaction can be recovered from the log.
- **WAL shipping**: The WAL segments are sent to the standby servers, either as files or via streaming in small chunks. This process is **_asynchronous by default_** but can be configured for synchronous replication to ensure no data is lost during a failure.
- **WAL replay**: The standby server receives the WAL segments and applies them to its own data files, keeping its state in sync with the primary. This happens continuously, which minimizes the delay between the primary and standby.


By using this architecture, PostgreSQL ensures data durability and enables fault tolerance. If the primary server fails, the standby can take over with minimal downtime.  

Here’s a simple diagram illustrating how PostgreSQL WAL streaming replication works:
![Replication](https://pub-b8d5ca13188446a08ac9941fcca1304e.r2.dev/replication-1.png)

In this setup:
- The primary server handles both read and write operations, sending the WAL logs to the standby server.
- The standby server receives and replays the WAL logs, keeping its data synchronized with the primary.
- Clients can connect to the standby for read-only queries, helping distribute the load and improve performance.  

This basic replication setup ensures that in the event of a failure, the standby server can quickly be promoted to act as the new primary, reducing downtime and data loss risks.

## Conclusion
PostgreSQL replication, built on WAL streaming, provides a reliable way to:  
- Ensure **data durability**  
- Minimize downtime during failures  
- Achieve **scalability** by distributing read workloads  
It’s a core feature for running PostgreSQL in **production-grade, highly available systems**.