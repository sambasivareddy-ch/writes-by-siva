---
title: "System Design - URL Shortener"
description: "We will explore the feasible system design of a URL shortener"
author: "Siva"
date: 2025-07-12
tags: ["System Design"]
canonical_url: "https://bysiva.vercel.app/blog/system-design-06"
---

# URL Shortener
In this post, we are going to discuss how to design the feasible and efficient the URL shortener system.

## 📚 Table of Contents
- [Aim](#aim)
- [Consideration: Hash Length](#consideration-hash-length)
  - [Example](#example)
  - [Base62](#base62)
- [Calculations](#calculations)
- [Database Design](#database-design)
  - [User Table](#user-table)
  - [URL Table](#url-table)
- [Collision](#collision)
  - [How to Avoid/Handle Collisions](#how-to-avoidhandle-collisions)
- [API](#api)
  - [Shorten URL (Creation)](#shorten-url-creation)
  - [Redirect URL (Redirection Path)](#redirect-url-redirection-path)
- [Rate Limiting](#rate-limiting)
  - [Abuse Prevention ensures that malicious users dont](#abuse-prevention-ensures-that-malicious-users-dont)
  - [Techinques](#techinques)
  - [Example](#example-1)
- [Latency, Caching & Scalability](#latency-caching--scalability)
  - [Where does latency come from our current design](#where-does-latency-come-from-our-current-design)
  - [How can we minimize it](#how-can-we-minimize-it)
    - [Where to Cache](#where-to-cache)
  - [Scalability](#scalability)
    - [Where are the bottlenecks in our RDBMS + Caching setup](#where-are-the-bottlenecks-in-our-rdbms--caching-setup)
    - [Scalability Strategies to scale our system](#scalability-strategies-to-scale-our-system)
- [Complete System Architecture](#complete-system-architecture)
- [Conclusion](#conclusion)

## Aim
The aim of this blog is to design a URL Shortener system which takes
- A long, original URL as input. And **generate a unique, short alias link which redirects to original URL** when searched with short alias in browser.
- _A system which stores the mapping between the long URL and Short link._

## Consideration: Hash Length
For this, we are going with short alias length of 7.
### Example
```text
    mytinyurl.com/ax12abZ

    Hash = ax12abZ
    Hash length = 7
```
In general, we choose **_Base62_** algorithm to generate the hash to map with Long URL.
### Base62
Base62 includes:
- Uppercase letters: A - Z (26)
- Lowercase letters: a - z (26)
- Numbers: 0 - 9 (10) 

As we see, the Base64 algorithm contains 26 uppercase letters, 26 lowercase letters and 10 numbers **(26 + 26 + 10 = 62)**

## Calculations
If we consider the hash length to be **7**, then each position can hold any of the 62 Base62 characters, the total number of unique combinations will be
```math
    62 ^ 7 = 3,521,614,606,208 = ~3.5T
```
- So by considering Base62 algorithm to generate unique short alias and hash length of 7, then we can generate nearly upto 3.5 trillion unique short alias URL.
- We can't assume like our system can hold upto 3.5T users, since one user can shorten multiple their long original URLs. It means our system can holds upto 3.5T URLs.

## Database Design
### User Table
```
    Table Name: User Table
    ________________________________________________________________________________
    | Column Name           | Data Type         | Constraints                      |
    --------------------------------------------------------------------------------
    | id                    | UUID              | Primary Key                      |
    | username              | VARCHAR(2048)     |                                  |
    | email                 | VARCHAR(50)       |                                  |
    | password_hash         | VARCHAR(2048)     |                                  |
    | created_at.           | TIMESTAMP         |                                  |
    --------------------------------------------------------------------------------     
```
### URL Table
```
    Table Name: URL Table
    ________________________________________________________________________________
    | Column Name           | Data Type         | Constraints                      |
    --------------------------------------------------------------------------------
    | short_url             | VARCHAR(7)        | Primary Key                      |
    | long_url              | VARCHAR(2048)     |                                  |
    | created_at            | TIMESTAMP         |                                  |
    | user_id               | UUID              | Foreign Key (USER(ID))           |
    | expiration_at         | TIMESTAMP         |                                  |
    | status                | ENUM              |                                  |
    --------------------------------------------------------------------------------     
```

## Collision
Even with this massive **"Hash Space"**, collision may occurs inform of 
- Same URL generates different hashs each time, and one of which mapped to another long URL.
- Different long URLs points to same hash which has been mapped to another URL.

### How to Avoid/Handle Collisions
- Collision Resolution (Hashing + Retry)
    - When you generate a short hash and when attempts to insert it into your database an error occurs provided hash is the primary key i.e short_url in our case.
    - **_Resolution_**: Everytime a collision occurs we can retry generating the hash for the long url by adding **random salt/counter** to generate the new hash until the collision avoided.
    - But with this solution, **Latency** can increases as the system retry everytime a collision occurs and new requests can fill the queue until the current requests completed.
- Key-Generation Service (KGS) / Pre-generated Keys
    - Instead of generating the hashes on-the-fly for each request, dedicate a large pool contains a **pre-generated** unique hashes each with marked **"unused"**.
    - When a request to shorten a URL comes in, the system fetches an available key from the pool and associates it with the long URL and thereafter mark it to **"used"**.
    - KGS auto-generates new batch of keys/hashes when the existing keys about to exhaust.
    - **_Benefits_**: 
        - Guaranteed uniqueness (mostly) and fast generation
    - **_Trade-Offs_**:
        - Additional we requires to a service to manage the pool.
        - Even though, it pre-generates the unique, internally it has to make sure to avoid collision while generating the hashes.
        - If KGS fails, it may impacts the functionality and users may not able to generate the shorten URLs until it is up.
- Counter-Based Encoding
    - Assign a unique, monotonically increasing integerId to each URL like an auto-incrementing primary key. Then convert that ID to Base62 hash.

In general, the URL shortening systems uses the combination of above things to make the system robust from the attacks.


## API
### Shorten URL (Creation)
- **Endpoint**: `/shorten`
- **Method**: POST
- **Purpose**: To create a new short URL from a long URL
- **Sample Request**:
```json
    {
        "long_url": "https://www.example.com/some/very/long/path?param1=value1&param2=value2",
        "expiration_time": "2026-07-10T16:30:00Z", // Optional: ISO 8601 format
        "user_id": "user123", // Optional: If you want User Authentication
    }
```
- **Sample Response**:
```json
    {
        "short_url": "https://mytinyurl.com/aX12abZi",
        "long_url": "https://www.example.com/some/very/long/path?param1=value1&param2=value2",
        "short_code": "aX12abZi",
        "creation_time": "2025-07-10T16:30:00Z",
        "expires_at": "2026-07-10T16:30:00Z"
    }
```
### Redirect URL (Redirection Path)
- **Endpoint**: `/{short_code}`
- **Method**: GET
- **Purpose**: To redirect the user from the short URL to the original long URL
- **Sample Response**: Respond with _HTTP 301 Moved Permanently_ (indicates permanent redirection) or _HTTP 302 Found_ (for temporary redirects). As this response tells the the browser cache the long url. So that, thereafter when we hit the short url in browser, the browser uses that **cached url** to redirect directly without hitting the API again.
    - **Headers**
        - Browser will cache when the following mentioned in response headers.
        - Location: https://www.example.com/some/very/long/path?param1=value1&param2=value2
        - Cache-Control: public, max-age=... (to hint browsers to cache the redirect)

Similarly we can introduce more endpoints like deletion, user creation, user specific urls deletions etc..

## Rate Limiting
Rate limiting is the process of restricting the number of requests a user or client can make to a server in a given time window.
### Abuse Prevention ensures that malicious users don't:
- Overwhelm the service (DoS or spam attacks)
- Create billions of short URLs in a short time
- Redirect users to malicious/phishing domains
- Circumvent the system by automating bots
### Techinques
- Fixed Window Counter
    - Keep a count of requests per user/IP in a fixed window (e.g., 100 requests per 15 minutes).
- Sliding Window Log
    - Log timestamps of each request and count the ones that fall in the window. More accurate but memory-heavy.
- Token Bucket / Leaky Bucket
    - Each user/IP gets tokens that refill over time. Tokens are consumed per request — if tokens are exhausted, further requests are blocked or queued.
### Example
Use Redis INCR with TTL to count requests per user:
```text
    INCR shorten_user123
    EXPIRE shorten_user123 60
```
- When shorten_user123 hits 60 requests in specified time-frame further requests from that users will denied.

## Latency, Caching & Scalability
- When a user entered a shortened URL in the browser, he will expect to redirect almost instantly, delaying in that may decreases the user experience and may cause high latency.
### Where does latency come from our current design
1. If the database lookup involves high Disk I/O and Database Processing Time.
2. Network Hops: Request going from one service to another service which involves network to communicate.
3. Application server processing.

### How can we minimize it?
**Caching** is an essential for a URL shortener. The redirection path is overwhelming read heavy, making it ideal for caching.
#### Where to Cache:
We can cache the long url to short url in
- **Browser**: by setting the headers to tell the browser to cache as part of response after the first request to API
- **DNS Caching**: DNS records are cached by resolvers and client machines. While not caching the URL mapping, it reduces the time to resolve mytinyurl.com to an IP address.
- **CDN**: For the redirection request, you can configure a CDN to cache the 301/302 redirects. The CDN acts as a proxy, and if it has seen the short_code before, it can serve the redirect from an edge location closer to the user

### Scalability
Scalability means the ability of the system to handle increasing load (more users, more shortened URLs, more clicks) without significant performance degradation.
#### Where are the bottlenecks in our RDBMS + Caching setup?
- Database (Writes): While reads are offloaded by cache, inserting new URL mappings (writes) still hit the database. A single database instance can become a write bottleneck.
- Cache Size: If the working set of active URLs is too large to fit in memory, cache hit rates will drop, pushing more load to the database.
- Application Servers: Can they handle the number of concurrent connections and process requests efficiently?

### Scalability Strategies to scale our system
- **Horizontal Scaling of Application Servers**: Run multiple instances of your application server behind a load balancer (e.g., Nginx, AWS ELB). Load balancer will helps in distributing the traffic to different servers reducing the traffic on one server.
- **Database Read Replicas**: Create one or more read-only copies of your primary database. While the write operations go to the primary ("master"), and read operations are distributed among the replicas managing the read traffic even cache miss happens at cache layer.
- **Database Sharding**: Divide the urls table (and potentially users) into smaller, independent partitions (shards) spread across multiple database servers. Each shard contains a subset of the data
- **Asynchronous Operations**: For non-critical operations like analytical operations like updating click counts, or perhaps even analytics data processing. Use messaging queues like **kafka* to decouple the operation from the main request flow. The application writes to the queue, and a separate worker processes the messages asynchronously.


## Complete System Architecture
```text
   +-----------------------------+                             
   |       User / Client         |
   +-----------------------------+
                |
                |    (1. Access short URL / 2. Request to shorten)
                v
   +-----------------------------+                             
   |       DNS Resolver          |
   +-----------------------------+
               |
               |    (Resolve Shortener Domain)
               v
    +-----------------------------+                             
    |       Load Balancer         |
    +-----------------------------+
               |
               |    (Distributes the Traffic)
               v
    +-----------------------------+         +--------------------------+                   
    |      Application Servers    | <---->  |     Cache (Redis)        |
    |      (Web API)              |         |                          |
    +-----------------------------+         +--------------------------+
               |
               |    (Cache Miss / Write)
               v
    +-----------------------------+         +--------------------------+                   
    |      Database.              | <---->  |         KGS              |
    |      (Master-Slave)         |         |                          |
    +-----------------------------+         +--------------------------+       
```

## Conclusion
In this blog we have discussed about designing the URL shortener system that includes how to generate the hash, avoiding collision, design database, api, latency, scalability and caching.
- What we have discussed the definitely required features in this system. If you are interested you can extend the system by adding analytical sections, asynchronous processing and in api about user creation, url deletion, rate limiting.

---
- **Previous Post**: [System Design - CAP Theorem](/blog/cap-theorem)