---
title: "Clock Sweep Algorithm"
description: "The Clock Sweep Algorithm is a page replacement algorithm used in postgreSQL to manage the buffer pool. "
author: "Siva"
date: 2025-07-03
tags: ["PostgreSQL"]
canonical_url: "https://bysiva.vercel.app/blog/clock-sweep"
---

# Clock Sweep Algorithm in PostgreSQL

## Table of Content
- [Clock Sweep Algorithm in PostgreSQL](#clock-sweep-algorithm-in-postgresql)
  - [Table of Content](#table-of-content)
  - [Definition](#definition)
  - [Implementation (PostgreSQL)](#implementation-postgresql)
    - [How the Algorithm Works](#how-the-algorithm-works)
  - [Why It Was Introduced?](#why-it-was-introduced)

## Definition
The **Clock Sweep Algorithm** is a page replacement algorithm used in postgreSQL to manage the buffer pool. 
- The purpose of this algorithm is to efficiently select a buffer (i.e., a page in shared memory) to evict when the buffer pool is full for a new page, balancing performance and memory usage.

## Implementation (PostgreSQL)
PostgreSQL maintains a **Circular Array** of buffer descriptors (`BufferDesc`) that represent the pages in the buffer pool. Each buffer descriptor will contains:
- `buf_id`: The identifier of the buffer.
- `ref_count`: Tells whether the buffer is pinned or not. 
    - If the buffer is pinned, it cannot be evicted.
    - Pinned buffers are typically in use by active transactions.
- `usage_count`: A counter that tracks how many times the buffer has been accessed.
- And other metadata like `flags`, `tag`, etc.
### How the Algorithm Works
- A clock hand (a pointer) sweeps through the buffer descriptors in a circular manner.
- For each buffer descriptor, it checks the `ref_count` and `usage_count`.
    - If `ref_count` > 0, the buffer is pinned and cannot be evicted.
    - If `usage_count` > 0, the buffer has been accessed recently, decrement this value and skip.
    - If both `ref_count` and `usage_count` are 0, the buffer is eligible for eviction.
- Continue sweeping until a suitable buffer is found.
- This loop continues until a victim buffer is selected or all buffers are skipped due to being pinned or recently used.

```c
// File Path: src/backend/storage/buffer/freelist.c
// Function: StrategyGetBuffer

trycounter = NBuffers;
for (;;)
{
    buf = GetBufferDescriptor(ClockSweepTick());

    /*
        * If the buffer is pinned or has a nonzero usage_count, we cannot use
        * it; decrement the usage_count (unless pinned) and keep scanning.
        */
    local_buf_state = LockBufHdr(buf);

    if (BUF_STATE_GET_REFCOUNT(local_buf_state) == 0)
    {
        if (BUF_STATE_GET_USAGECOUNT(local_buf_state) != 0)
        {
            local_buf_state -= BUF_USAGECOUNT_ONE;

            trycounter = NBuffers;
        }
        else
        {
            /* Found a usable buffer */
            if (strategy != NULL)
                AddBufferToRing(strategy, buf);
            *buf_state = local_buf_state;
            return buf;
        }
    }
    else if (--trycounter == 0)
    {
        /*
            * We've scanned all the buffers without making any state changes,
            * so all the buffers are pinned (or were when we looked at them).
            * We could hope that someone will free one eventually, but it's
            * probably better to fail than to risk getting stuck in an
            * infinite loop.
            */
        UnlockBufHdr(buf, local_buf_state);
        elog(ERROR, "no unpinned buffers available");
    }
    UnlockBufHdr(buf, local_buf_state);
}
```

## Why It Was Introduced?
- Efficiency: True LRU is costly to maintain due to overhead in tracking exact usage order.
- Simplicity: Clock sweep offers a simpler, lower-overhead alternative with similar eviction behavior.
- Concurrency: Suits PostgreSQL’s need for high concurrency with minimal locking.
- Adaptivity: The use of `usage_count` allows pages to stay longer in memory if frequently accessed.