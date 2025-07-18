---
title: "CAP Theorem"
description: "In this blog, we are going to discuss about the CAP theorem"
author: "Siva"
date: 2025-07-09
tags: ["System Design"]
canonical_url: "https://bysiva.vercel.app/blog/system-design-05"
---

# CAP Theorem

## 📚 Table of Contents
1. [Introduction](#introduction)  
2. [Network Partitions](#network-partitions)  
3. [Implementation](#implementation)  
4. [Applications](#applications)

## Introduction
The **CAP Theorem** also known as **Browser's Theorem** stats that, in a distributed systems, you can have only **_two_** out of three guarantee states at the same time
- **Consistency**: Every read request will give the most recent write as a response or an error
- **Availability**: Every request will receives a non-error response without a guarantee that it contains **most recent** writes.
- **Partition Tolerance**: The system continous to operates even in case of **Network Partitions**

### Network Partitions
Network partitions refers to the network failures that divides the distributed systems into the two or more groups(partitions) that cannot communicate with each other.
- This doesn't means that the nodes are down, it means they cannot communicate across the partitions
```math

    Distributed Systems 
    (All Systems are connected)
    A --- B --- C --- D

    Network Partitions
    A --- B -X- C --- D
    creates
    A --- B     C --- D
```
- A & B can communicate among each other
- Similarly C & D can communicate among each other
- But A/B cannot communicate with C/D. This is network partitions

## Implementation
In general distributed system choose below combinations of two out of three guarantee states:
- **_CP (Consistency & Partition Tolerance)_**: 
    - Prioritize consistency even if availability suffers.
    - Blocks Ops (writes) to maintain consistency
    - That is we will receive the consistent data or an error from the partitioned nodes.
- **_AP (Availability & Partition Tolerance)_**:
    - Prioritize the availability, so may response contains inconsistent data.
    - Allows Ops (writes) which bring more inconsistencies among nodes. When the partition issue resolves the data will be synced.
    - That is it returns the most recent version of the data the partitioned nodes has.
- **_CA (Consistency & Availability)_**: Only achievable when there is no network partition, which is impractical in distributed environments.

> Note: Partition Tolerance (P) is typically non-negotiable in distributed systems due to real-world network failures. That is a network or part of network can go down frequently & unexpectedly. So we can assume network failures can happen to your system no matter what. That's why CA is impractical as our systems must be Partition Tolerance.

```tree
        Consistency
            /\
           /  \
          /    \
         /      \
  CA    /        \   CP
       /          \
      /            \
     /              \
    /                \
   --------------------
  Availability    Partition
                  Tolerance

```

## Applications
- **CP**:
    - Better to reject a write than allow incorrect data during a partition.
    - Example: Banking Systems, Inventory Management etc
- **AP**:
    - Better to serve slightly outdated or conflicting data than fail outright.
    - Example: Shopping carts, Social Media Posts etc
---
- **Previous Post**: [System Design - CDNs](/blog/cdns)
- **Next Post**: [System Design - URL Shortener](/blog/url-shortener)