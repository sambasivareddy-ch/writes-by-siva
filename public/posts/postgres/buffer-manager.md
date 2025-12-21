---
title: "How the Buffer Manager works"
description: "The 2nd blog in the shared buffers series discussing how the buffer manager works underneath"
author: "Siva"
date: 2025-12-20
tags: ["PostgreSQL"]
canonical_url: "https://bysiva.vercel.app/blog/buffer-manager"
---

# How the Postges Buffer Manager works?
This blog is a continuation post in the **Shared Buffers** series, where we are going to discuss about how the postgres's buffer manager works underneath by handling the page access requests and maintaining the shared buffer pool.   
Checkout [Part-1](/blog/shared-buffers-introduction) here..

## Table of Contents
- [How the Postges Buffer Manager works?](#how-the-postges-buffer-manager-works)
  - [Table of Contents](#table-of-contents)
  - [Purpose](#purpose)
  - [Implementation](#implementation)
  - [Accessing a Page already in Shared Buffers](#accessing-a-page-already-in-shared-buffers)
  - [Loading Page into a Empty Slot](#loading-page-into-a-empty-slot)
  - [Loading a Page When All Slots Are Full](#loading-a-page-when-all-slots-are-full)
  - [Conclusion](#conclusion)

## Purpose
The buffer manager in PostgreSQL is the internal component responsible for:
- Handling page access requests from backend processes.
- Maintaining the shared buffer pool (in-memory cache of disk pages).
- Managing lookups, pins, and evictions.
- Coordinating with disk I/O safely and efficiently.
Whenever a backend process needs a table or index page, it calls **_ReadBufferExtended()_**, and that function routes the request through the buffer manager.

## Implementation
The buffer manager handles page access through three scenarios:
- Page is already in the buffer pool.
- Page is not in memory and there is an empty slot.
- Page is not in memory and all slots are in use.   

We are going to discuss how each of these scenarios handled underneath with detailed explanation.

## Accessing a Page already in Shared Buffers
When a backend requests a page that is already cached:
- Build a **buffer_tag** representing the page identity.
- Look up the **buffer_tag in a hash table that maps tags to buffer IDs**.
- If found, pin the buffer: _increment its reference (refcount) and usage counters_.
- Acquire a shared content lock before reading or an exclusive lock before modifying.
- Release the lock(s) after use.
> Pinning ensures that a page in use is not selected for eviction by other backends.   

![Buffer Manager 1](https://pub-b8d5ca13188446a08ac9941fcca1304e.r2.dev/shared-manager-1.png)

## Loading Page into a Empty Slot
If the page is not in shared buffers and there is at least one empty buffer descriptor:
- Look up the buffer table to confirm the page is absent.
- Remove a descriptor from the freelist (initial pool of empty descriptors).
- Pin that descriptor and insert the new **(buffer_tag, buffer_id) entry into the buffer (hash) table**.
- **Read the page from disk into the assigned buffer slot**.
- Mark the descriptor as valid and release locks.
- Access the buffer now that the page is in memory.
![Buffer Manager 2](https://pub-b8d5ca13188446a08ac9941fcca1304e.r2.dev/shared-manager-2.png)

## Loading a Page When All Slots Are Full
When the buffer is full and the requested page is not present, the buffer manager:
- Looks up the buffer table and confirms a miss.
- Selects a **_victim buffer via the clock sweep algorithm_**.
- If the victim page has been modified **(“dirty”)**, flush it to disk before reuse — including ensuring WAL (Write-Ahead Log) has been flushed.
- Remove the old buffer table entry.
- Insert the **new buffer_tag mapped to the victim’s buffer ID**.
- Load the desired page into the now-repurposed buffer.
- Update flags and access the page.
![Buffer Manager 3](https://pub-b8d5ca13188446a08ac9941fcca1304e.r2.dev/shared-manager-3.png)

## Conclusion
The buffer manager is the heart of PostgreSQL’s storage engine, quietly orchestrating how data moves between disk and memory while balancing performance, correctness, and concurrency. Every page read or write flows through it, making its design fundamental to how PostgreSQL behaves under real-world workloads.