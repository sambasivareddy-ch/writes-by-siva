---
title: "Introduction to Shared Buffers"
description: "In this blog series, we are going to discuss about the Shared Buffers in PostgreSQL"
author: "Siva"
date: 2025-11-17
tags: ["PostgreSQL"]
canonical_url: "https://bysiva.vercel.app/blog/shared-buffer-introduction"
---

# Introduction to Shared Buffers

## Table of Contents
- [Introduction to Shared Buffers](#introduction-to-shared-buffers)
  - [Table of Contents](#table-of-contents)
  - [Defintion](#defintion)
  - [Configuration](#configuration)
  - [Internals Overview](#internals-overview)
    - [Key internal components:](#key-internal-components)
    - [How PostgreSQL reads a page:](#how-postgresql-reads-a-page)
    - [How PostgreSQL writes:](#how-postgresql-writes)
  - [PostgreSQL’s Buffer Architecture](#postgresqls-buffer-architecture)
  - [Implementation Breakdown](#implementation-breakdown)
    - [Buffer Pool (The Page Array)](#buffer-pool-the-page-array)
    - [Buffer Descriptors](#buffer-descriptors)
    - [Buffer Tags](#buffer-tags)
    - [Hash Table for Fast Lookups](#hash-table-for-fast-lookups)
    - [Free List (Not what people think!)](#free-list-not-what-people-think)
    - [Pinning and Reference Counting](#pinning-and-reference-counting)
    - [Dirty Buffers](#dirty-buffers)
    - [Putting It All Together](#putting-it-all-together)
  - [Conclusion](#conclusion)
  
## Defintion
**Shared Buffers** in Postgresql can be defined as the **`in-memory data cache`**. That is it can be used to store recently accessed **_table pages, index pages and any data structures_**, so that future reads can be served from **_Memory (RAM) instead of Disk_**, helps in improving the performance drastically.

## Configuration
Shared Buffers size can be configured and controlled by the configuration parameter:
```markdown
shared_buffers = 125MB (or Whatever the value feasible for your DB System)
```
The whole point of existance of shared buffers is to:
- Reduce disk I/O
- Speed up read and write operations
- Provide a shared area accessible by all server processes
- Maintain consistency through buffer management and WAL integration

## Internals Overview
PostgreSQL implements shared buffers as a **fixed-size region of shared memory allocated at server startup.**

### Key internal components:
- **Buffer Pool**: Array of fixed-size 8 KB pages.
- **Buffer Descriptors**: Metadata about each buffer (usage count, dirty/clean flag, tags).
- **Clock-Sweep Algorithm**: PostgreSQL’s variation of LRU used for page eviction. [Refer Here](https://www.bysiva.blog/blog/clock-sweep)
- **Checkpointer & Background Writer**: Flush dirty buffers to disk.
- **WAL Sync**: Ensures durability before flushing dirty pages.

### How PostgreSQL reads a page:
- Check shared buffers cache
- If present → return
- If not → read page from disk → place it in a buffer → return

### How PostgreSQL writes:
- Modify the page in shared buffers
- Mark as "dirty"
- WAL flushed first
- Dirty pages later flushed by background writer / checkpointer


## PostgreSQL’s Buffer Architecture
In this section, we are going to discuss how PostgreSQL **manages, stores, tracks and retrieves** the data pages from the shared memory and how the architecture will look like under the hood.  
It is all about coordinate all backend processes so they can efficiently read, pin, modify, and flush 8-KB blocks without corrupting data or blocking each other. 

![Shared Buffers](https://pub-b8d5ca13188446a08ac9941fcca1304e.r2.dev/shared_buffers.png)

## Implementation Breakdown
PostgreSQL’s buffer system is made of several tightly connected structures:

### Buffer Pool (The Page Array)
- A large contiguous array in shared memory
- Contains fixed-size 8 KB pages
- Number of slots = shared_buffers / 8 KB. Example:
```
shared_buffers = 8GB → 8GB / 8KB = ~1,048,576 buffers
```
- Each slot holds:
  - Table pages
  - Index pages
  - Visibility map pages
  - Free space map pages

### Buffer Descriptors
- Each buffer has a descriptor that stores metadata.
- A simplified version:
```c
typedef struct BufferDesc {
    BufferTag tag;         // identifies relation + block number
    uint16    flags;       // dirty, valid, io_in_progress, etc.
    int       usage_count; // for eviction
    int       refcount;    // pinned buffers
    LWLock    buf_hdr_lock;
} BufferDesc;
```
- **Purpose**:
  - Identify what page is stored
  - Keep track of how often it’s used
  - Determine whether it is being read or written

### Buffer Tags
- A buffer tag uniquely identifies a specific 8 KB block:
```
(relfilenode, tablespace, database OID, block number)
```
- This allows PostgreSQL to map file pages → memory slots.

### Hash Table for Fast Lookups
- PostgreSQL uses a shared hash table, the buffer lookup hash, to locate a page quickly.
- **Flow**:
  - Query wants page X
  - Hash table lookup → find buffer slot
  - If found: return
  - If not: load page from disk → assign a free slot
- The hash table is protected by lightweight locks.

### Free List (Not what people think!)
PostgreSQL used to maintain a free list, but modern versions rarely use it.
Most buffers are allocated through the clock-sweep algorithm instead of the free list.

### Pinning and Reference Counting
When a backend accesses a page:
- A pin is added (refcount++)
- Other backends must wait to evict the buffer   

Purpose:
- Prevent eviction while a backend is using the page
- Ensure correctness during reads and writes

Pinned buffers are the #1 cause of:
- Autovacuum stuck
- Long-running transactions blocking vacuum
- Bloat not being cleaned

### Dirty Buffers
- A dirty buffer = memory page modified but not yet written to disk.
- **Descriptor** contains a **_dirty flag_**.   

Dirty pages can only be flushed after:
- Their WAL records are safely persisted
- A background writer or checkpointer chooses them for writing

### Putting It All Together
When a query requests a page:
- Acquire shared buffer lock
- Lookup via buffer hash
- If found: pin → read/modify
- If not found:
  - Choose victim via clock-sweep
  - Flush if dirty
  - Load new page
- Adjust usage_count
- Unpin
- Possibly set dirty flag
- Eventually background writer/checkpointer flushes the page

## Conclusion
Shared Buffers form the foundation of PostgreSQL’s entire memory and I/O workflow. They sit at the heart of how data pages are cached, accessed, modified, and safely written back to disk. By understanding how PostgreSQL organizes its buffer pool, how buffer descriptors track page state, how pins prevent unsafe eviction, and how WAL coordinates durable writes, you gain a clearer picture of what actually happens beneath every query.   

This introduction sets the stage for the deeper internals you’ll explore in the upcoming parts of the series—such as the clock-sweep algorithm, page lifecycle, flushing behavior, and real-world tuning strategies. With these fundamentals in place, you’re now ready to dive further into how PostgreSQL keeps performance high while maintaining strict correctness guarantees.   

Stay tuned for the next chapter in this series!