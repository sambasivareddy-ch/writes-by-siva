---
title: "MVCC in Postgres"
description: "In this blog, we will discuss about MVCC in PostgreSQL"
author: "Siva"
date: 2025-11-21
tags: ["PostgreSQL"]
canonical_url: "https://bysiva.vercel.app/blog/mvcc"
---

# Multi-Version Concurrency Control

## Table of Contents
- [Multi-Version Concurrency Control](#multi-version-concurrency-control)
  - [Table of Contents](#table-of-contents)
  - [Definition](#definition)
  - [Implementation](#implementation)
    - [Tuple Versioning](#tuple-versioning)
    - [Visibility Rules](#visibility-rules)
    - [Snapshots](#snapshots)
    - [Vacuum Process](#vacuum-process)
  - [Practical Usage](#practical-usage)
    - [Non-blocking reads](#non-blocking-reads)
    - [Concurrent writes](#concurrent-writes)
    - [Repeatable reads](#repeatable-reads)
    - [Performance tuning considerations](#performance-tuning-considerations)
  - [Conclusion](#conclusion)

## Definition
**MVCC (Multi-Version Concurrency Control)** is PostgreSQL’s mechanism for _handling concurrent reads and writes without forcing transactions to block each other unnecessarily_.    
It provides **_transaction isolation, ensures consistent reads, and reduces contention by allowing multiple versions of a row to exist simultaneously_**.

## Implementation
PostgreSQL implements MVCC through:
### Tuple Versioning
- Each row (tuple) includes:
  - **xmin** — the transaction ID that created the row
  - **xmax** — the transaction ID that deleted or superseded it
- Updates create new tuples, not in-place modifications.
### Visibility Rules
PostgreSQL checks tuple metadata against the viewing transaction’s snapshot to decide whether a tuple is visible.
### Snapshots
A snapshot contains:
- Active transaction IDs
- The **_“xmin”_** and **_“xmax”_** boundaries determining visibility
### Vacuum Process
Old row versions are cleaned up by:
- AUTOVACUUM, which removes dead tuples after they are no longer visible to any transaction
- Helps prevent table bloat

![MVCC](https://pub-b8d5ca13188446a08ac9941fcca1304e.r2.dev/mvcc.png)

## Practical Usage
MVCC affects database operations in the following ways:
### Non-blocking reads
- SELECT queries don’t wait on writes.
- SELECTs see a consistent view of data as of their transaction start.
### Concurrent writes
- DMLs don’t block SELECTs and vice-versa.
- Conflicts occur only when two DMLs touch the same row.
### Repeatable reads
- A transaction under REPEATABLE READ sees the same snapshot throughout.
### Performance tuning considerations
- Frequent updates can generate many dead tuples → requires effective autovacuum settings.
- Long-running transactions hold old snapshots → delay cleanup.

## Conclusion
MVCC in PostgreSQL enables high-performance concurrency by letting each transaction see a consistent snapshot of the database without blocking others. Instead of overwriting data in place, PostgreSQL creates new row versions and uses visibility rules to determine which version each transaction should see.