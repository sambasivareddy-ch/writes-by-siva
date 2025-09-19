---
title: "System Design - Music Streaming Systems"
description: "In this blog, we are going to discuss about designing music-streaming systems"
author: "Siva"
date: 2025-09-17
tags: ["System Design"]
canonical_url: "https://bysiva.vercel.app/blog/music-system"
---

# Music Streaming Systems
Building a large-scale _music streaming system like Spotify, Apple Music, or YouTube Music is not just about storing and serving audio files_. These platforms handle hundreds of millions of users, deliver songs in real-time with minimal latency, and provide personalized experiences through recommendations and playlists. The challenge lies in designing a system that is scalable, highly available, and cost-efficient—all while ensuring seamless playback across devices. In this blog, we’ll explore the requirements, architecture, database design, and APIs behind a robust streaming platform.

## 📚 Table of Contents
- [Music Streaming Systems](#music-streaming-systems)
  - [📚 Table of Contents](#-table-of-contents)
  - [Requirements](#requirements)
    - [Functional Requirements](#functional-requirements)
    - [Non-Functional Requirements](#non-functional-requirements)
  - [Calculations](#calculations)
    - [Assumptions](#assumptions)
    - [Network Bandwidth](#network-bandwidth)
    - [Storage](#storage)
  - [High Level Design](#high-level-design)
    - [Clients](#clients)
    - [Load Balancer](#load-balancer)
    - [Auth Service](#auth-service)
    - [App Servers](#app-servers)
    - [Services](#services)
    - [Storage and Caching](#storage-and-caching)
    - [Observability](#observability)
  - [Low-level Design](#low-level-design)
    - [Database Design](#database-design)
    - [API Design](#api-design)
      - [Streams API](#streams-api)
        - [GET /song/{song\_id}](#get-songsong_id)
        - [GET /search](#get-search)
  - [Key Design Considerations](#key-design-considerations)
    - [Scalability](#scalability)
    - [Low Latency](#low-latency)
    - [High Availability](#high-availability)
    - [Cost Optimization:](#cost-optimization)
  - [Conclusion](#conclusion)


## Requirements
Before designing the High-level design, lets point out what are the `Functional` and `Non-Functional` requirements we need for the robust system.
### Functional Requirements
- **Search Engine**: Users should be able to search _Songs, Artists, Albums, Playlists_ etc..
- **Music Streaming**: Should be able to stream the songs in _real-time_.
- **Playlists**: Users can _create, update, delete_ the playlists as their wish.
- **Recommendations**: A recommendation system which recommend the songs based on User's activity.
### Non-Functional Requirements
- **Scalability**: System should able serve the millions of users with their requested songs.
- **Low Latency**: Songs which should be loaded with low latency.. so that users can experience the song in real-time.
- **High Availability**: System should be available/up all the time with minimal down time.

## Calculations
### Assumptions
- **User Base**:
  - `100M` Users
  - Among them `50M` users are active at a time.
- **Average Songs/Day per User**: 15 songs
- **Average Song Duration**: 4 Minutes
- **Average Song Size**: 5MB
- **Total No.of Songs in the System**: 75M
### Network Bandwidth
Network Bandwidth is to determine **_how much of data that system needs to transfer over the network per day_**.
- **Songs Streaming** = 50M Active Users x 15 Songs/users = 750M Songs
- **(Data Transfers)/day** = 750M x 5MB = 3.75PB (PetaBytes)
  - per sec = 3.75PB / 86400s = ~43GB 
### Storage
- **Total Storage**: 75M x 5MB/song = ~375.6 TB = ~0.37PB
Assuming `2kb` for storing the song metadata and `10kb` to store user metadata, then
- **Song Metadata Storage**: 75M x 2KB = ~140GB
- **Users Metadata Storage**: 100M x 10KB = ~1TB

## High Level Design
The music streaming system can be divided into several high level components as mentioned in the below picture:
![High-Level Design](https://pub-b8d5ca13188446a08ac9941fcca1304e.r2.dev/spotify-design.png)
### Clients
- **Platforms**: Mobile apps, web, desktop.
- **Role**: Provide UI, make API calls to backend (streaming, search, playlists, auth).
- **Protocol**: Typically use HTTPS + HLS (HTTP Live Streaming) with adaptive bitrate for smooth playback.
### Load Balancer
- **Distributes traffic** evenly across app servers.
- Ensures no **single point of failure**.
- Examples: Nginx, HAProxy, AWS ALB.
### Auth Service
- Handles login, tokens (JWT/OAuth), subscription checks (free vs premium).
- Blocks unauthorized requests early.
### App Servers
- API Gateway layer: Routes requests to appropriate microservices.
- Stateless → scales horizontally.
### Services
- **Streaming Service**: Fetches audio files (chunks) from storage/CDN and streams to clients.
- **Recommendations Service**: Recommends user's personalized songs based on the user's activity in the system like search history, played songs etc.
- Uses:
  - Collaborative filtering (users with similar tastes).
  - Content-based filtering (song embeddings, genres).
  - Hybrid models with real-time analytics.
- **User Service**: Manages profiles, playlists, likes, follows, subscription tiers.
- **Search Service**: Powered by **Elastic search/Solr** for fast lookups across songs, albums, and artists.
### Storage and Caching
- **Metadata DB**: Relational (Postgres/MySQL) for strong consistency OR NoSQL (MongoDB/Cassandra) for scalability.
- **Audio Files**: Stored in Object Storage (AWS S3, GCP Storage).
- **CDN**: Distributes hot content closer to users, reducing latency.
- **Caching Layer**: Redis/Memcached for session data, hot playlists, and recommendations.
### Observability
- Monitoring: Prometheus + Grafana dashboards.
- Logging: Centralized logs (ELK stack).
- Analytics: Real-time stream processing (Kafka + Spark/Flink) to improve recommendation.

## Low-level Design
### Database Design
- Most typical and required table entities of a streaming system will be the following:
  - Users
  - Songs
  - Artists
  - Albums
  - Playlists
- We can use relational database like **PostgreSQL** or **SQL**, the schema of the above tables will looks like below:
```sql
    USERS (
        user_id primary key, 
        name, 
        email unique, 
        country, 
        subscribed, 
        created_at
    );

    ARTISTS (
        artist_id primary key, 
        name, 
        debut_year, 
        bio
    );

    SONGS (
        song_id primary key, 
        song_name, 
        release_date, 
        duration, 
        genre, 
        artist_id foreign key (artists.artist_id)
    );

    ALBUMS (
        album_id primary key, 
        album_name, 
        release_date, 
        artist_id foreign key (artists.artist_id)
    )

    ALBUM_SONGS (
        album_id foreign key (albums.album_id)
        song_id foreign key (songs.song_id)
    )

    PLAYLISTS (
        playlist_id primary key, 
        playlist_name, 
        user_id foreign key (users.user_id)
    )

    PLAYLIST_SONGS (
        playlist_id foreign key (playlists.playlist_id)
        song_id foreign key (songs.song_id)
    )
``` 
- Similarly we can use non-relational databases like **MongoDB** or **NoSQL** to store the search results or recommendations.

### API Design
#### Streams API
##### GET /song/{song_id}
- This endpoint will return the **Blob Host URI** of the song.
```bash
    https://aws_s3_song_name.blog/
```
##### GET /search
- This endpoint can take following parameters
  - query: searching key
  - limit: no.of records should return
  - pagination offset: default 0
```bash
    {
        "results": [
            {
            "type": "song",
            "id": "12345",
            "title": "Blinding Lights",
            "artist": "The Weeknd",
            "album": "After Hours"
            },
        ]
    }
```
- Like the above, we can include some other endpoints like `/albums`, `/playlists/:user_id`, `/genres` etc..

## Key Design Considerations
### Scalability
- Horizontal scaling of microservices.
- Global CDN + multi-region deployment.
### Low Latency
- Cache hot songs (top 20%).
- Place content at edge locations.
### High Availability
- Replication across multiple availability zones.
- Failover mechanisms with active-active setup.
### Cost Optimization:
- Deduplicate audio files.
- Store multiple quality levels efficiently.
- Tiered storage (hot vs cold).

## Conclusion
Designing a music streaming system requires careful consideration of both functional aspects and non-functional aspects. By leveraging microservices, CDN-based delivery, caching, and distributed databases, we can build systems capable of serving millions of users with a smooth listening experience. While the architecture here focuses on the fundamentals, real-world platforms also incorporate DRM, offline downloads, social features, and advanced AI-driven recommendations to stay competitive. Ultimately, the success of such a system lies in striking the right balance between performance, reliability, and cost optimization.