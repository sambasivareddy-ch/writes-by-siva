---
title: "Caching"
description: "In this blog, we are going to discuss about the topic called Caching"
author: "Siva"
date: 2025-08-06
tags: ["System Design"]
canonical_url: "https://bysiva.vercel.app/blog/caching"
---

# Caching

## 📚 Table of Contents
1. [Definition](#definition)  
2. [Caching Techniques](#caching-techniques)  
3. [Cache Strategies](#cahe-strategies)  
4. [Applications](#applications)

## Definition
**Caching** is a technique used to store a copy of data or computational results of the requests that can be retrieved quickly later when the user access the application.
- Caching reduces the _latency_ and _lightens the load_ on the backend by serving pre-processed data. It also improves the _scalability_ and _reduces the computational cost_.

## Caching Techniques
### Browser Caching
Browser caching stores the webpage resources locally to the user browser. And when the user again visits the page, loads the cached results without making a new request to the server.
```javascript
    app.use((req, res, next) => {
        res.set({
            'Cache-Control': 'public, max-age=86400', // 24hrs retention
        });
        next();
    })
```

### CDNs
CDNs caching replicates the user's data across various geographical locations, reducing the data travel time (latency) by serving it from the nearest server to the users.
- Learn more: [System Design - CDNs](/blog/cdns)

### Database Query Caching
Database caches the results of a query and when the same query requests for the data to server, database uses the cached results and return them.

### In-Memory Caching
In-Memory Caching stores data in **_RAM_**, which is much faster than typical disk storage. This technique used for frequently **read data**, **session information** & **full-page** caching.
- Example for in-memory caching is `Redis`.

## Cache Strategies
### Cache-Aside (Lazy Loading)
In this technique, application looks for **data in the cache first**, if it doesn't find the data (cache miss) in the cache, it loads the data from the source, stores them again in the cache, and then returns it. This strategy ensures the only _requested data_ is cached.

### Read-Through 
In this technique, cache acts as a abstract layer between the application and server. When a _cache miss occurs_, the cache will take the responsibility for reading the data from the server (Data Source), storing it and then returning it.

### Write-Through
Every write operation to the Database (Data source) is simultaneously written to the **Cache**. This ensures the always holds the latest data, reducing the **_chance of serving the stale data_**.
- This technique will be used when the application writes are less.
  
### Write-Back (Write-Behind)
In this technique, writes will be written to the cache initially and cache will write back to the database after delay.
- Useful for the features like 'likes' in the application, once user liked, it instantly stores in the cache and return the results. After certain delay, cache will store those likes in the database.

### Refresh-Ahead
Proactively refreshes the data before it gets stale or expires. It ensures the cache contains latest data preventing from serving the stale data when user requests.

## Pros and Cons
Like any technology, caching has its pros and cons.
### Pros:
- Speed: Caching makes your system faster by reducing data fetching time.
- Reduced Server Load: Caching reduces the load on your database or primary servers.
- User Experience: Quick response times lead to happier users!
### Cons:
- Stale Data: Cache data can become outdated, leading to data inconsistency.
- System Complexity: Implementing caching adds an extra layer of complexity to system design.
- Cache Invalidation: Determining when to refresh or clear cache can be challenging.
