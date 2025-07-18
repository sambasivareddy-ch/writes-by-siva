---
title: "System Design - Load Balancing"
description: "We will explore the concept of load balancing, a critical aspect of designing scalable and efficient systems.."
author: "Siva"
date: 2025-06-19
tags: ["System Design"]
canonical_url: "https://bysiva.vercel.app/blog/system-design-02"
---

# System Design - Load Balancing
This blog post is the second in a series on system design, where we will explore the concept of load balancing, a critical aspect of designing scalable and efficient systems.

## 📚 Table of Contents

1. [Introduction](#system-design---load-balancing)  
2. [Definition](#definition)  
3. [Load Balancing Algorithms](#load-balancing-algorithms)  
4. [Why Load Balancing was Introduced](#why-load-balancing-was-introduced)  
5. [Example Use Cases](#example-use-cases)

## Definition
Load balancing is the process of distributing incoming network traffic or workloads across multiple servers or resources to ensure no single server bears too much load. 
**The goal is to:**
- Optimize resource utilization
- Maximize throughput
- Minimize response time
- Ensure high availability and fault tolerance

## Load Balancing Algorithms
- **Round Robin**
    - Distributes incoming requests to servers in a circular order. Once it reaches the last server, it starts again from the first.
    - Simple and effective for servers with similar capabilities.
- **Least Connections**
    - Directs traffic to the server with the fewest active connections, assuming it is less busy.
    - Helps when server requests vary significantly in processing time.
- **IP Hash**
    - Uses the client's IP address to determine which server will handle the request.
    - Ensures that requests from the same client are consistently directed to the same server as the hash will be same in all the cases.
    - It will also helps in persistenting of sessions.
- **Weighted Round Robin**
    - Similar to Round Robin, but assigns a weight to each server based on its capacity or performance.
    - Servers with higher weights receive more requests, allowing for better resource utilization.
- **Weighted Least Connections**
    - Combines the principles of Least Connections and Weighted Round Robin.
    - Directs traffic to the server with the fewest connections, but also considers the server's weight.
- **Random**
    - Randomly selects a server to handle the request.
    - Simple but may lead to uneven distribution if not used carefully.

![Load Balancing Algorithms](/blog_assets/load_balancer.png)

## Why Load Balancing was Introduced
As systems scaled beyond a single server, several challenges emerged:
- **Single Point of Failure**: If a single server fails, the entire system becomes unavailable
- **Performance Bottlenecks**: A single server may struggle to handle high traffic, leading to slow response times or crashes.
- **Limited Capacity**: A single server has finite resources (CPU, memory, bandwidth), which can limit the system's ability to handle increased load.
Load balancing was introduced to:
- Eliminate single points of failure
- Support horizontal scaling by adding more servers
- Improve performance and responsiveness by distributing traffic
- Enhance fault tolerance by rerouting traffic in case of server failures
- Enable stateless and scalable architectures.

## Example Use Cases
- **Web Applications**: Distributing HTTP requests across multiple web servers to handle high traffic volumes
- **Microservices**: Balancing requests among various microservices to ensure efficient resource utilization
- **Database Clusters**: Distributing database queries across multiple database servers to improve performance and availability
- **Content Delivery Networks (CDNs)**: Balancing requests for static content across multiple edge servers to reduce latency and improve user experience
- **APIs**: Distributing API requests across multiple instances to ensure high availability and responsiveness


---
- **Previous Post**: [System Design - Introduction to System Design](/blog/intro-to-system-design)
- **Next Post**: [System Design - Scalability](/blog/scalability)