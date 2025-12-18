---
title: "System Design - Google Docs Design"
description: "In this blog, we are going to discuss about designing google docs like system"
author: "Siva"
date: 2025-10-02
tags: ["System Design"]
canonical_url: "https://bysiva.vercel.app/blog/google-docs"
---

# Google Docs System Design
Google Docs is a cloud based **word processor** platform which allows the users to **_create, edit and share the documents_** with the users and also allows the users to **collaborate** concurrently in real-time.

> “Google Docs is not just a text editor — it’s a distributed system that handles real-time collaboration for millions of users. The challenge lies in consistency, low-latency collaboration, offline edits, and durability at scale.”

## Requirements
Before discussing the "High-Level" and "Low-Level" design of this system, lets gather the **Functional and Non-Functional** requirements in order to make the robust, scalable and high level system.
### Functional Requirement
- **Rich Content Editor**: Should allow the users to format the text, lists, tables and files.
- **Single User Editing**: Should allow the single user to create, edit and delete the document.
- **Multi-User Realtime Collaboration**: Multiple users should be able to edit the documents at the same time.
- **Realtime Collaborative Editing**: Multi-user cursors, per-user selection.
- **Asset Management**: Upload, CDN delivery, embedding.
- **Access control + sharing links**
- **Searching**: Search across the document.
### Non-Functional Requirement
- **Latency**: client-perceived edit propagation under ~100–200 ms ideally.
- **Availability**: target SLOs (e.g., read 99.95%, write 99.9%).
  - SLOs stands for `Service Level Objective` - a target we set internally that our product should meet.
- **Durability**: no user data loss (snapshots + WAL + object store backups).
- **Scalability**: support millions of users, bursty concurrent editing.
- **Security**: TLS, authentication (OAuth/JWT), per-document ACLs, audit logs.
- **Cost efficiency**: snapshot/compaction and archive cold data to reduce costs.
- **Maintainability/observability**: metrics, traces, logs, alerts.

## Assumptions and Calculation
### Assumptions
- **Total Users** - `10M`
  - **(Active Users)/day** - `5%`
- **Peak Concurrent Editors** - `2%` of active users
  - That among the active users how many are active editing the documents concurrently at the same time.
- **Average edits per active editor**: `0.5` ops/sec (typing bursts averaged out)
- **Average op payload size**: `200 bytes` (CRDT op compacted form)
- Each collaboration server can handle `1,000 ops/sec` (conservative)
- **Redundancy Factor**: `x2` 
  - means, we provision the 2 servers per 1 assumed serves to handle the sudden spike in traffic
### Calculations
- **Docs Daily Users**: 5% of 10M = `5,00,000`
- **Concurrent Editors**: 2% of 5,00,000 = `10,000` editors
- **Total op/sec at peak**: 10,000 x 0.5 = `5,000` op/sec
- **Network Payload**: 5,000 x 200B 
  - In bytes/sec: `10,00,000` bytes/sec 
  - In mb/sec: `1` MB/Sec
  - In gb/day: 1 MB/sec x 86,400 sec/day = `86.4` GB/day
- **Collaboration Server count required**: 5,000 / 1,000 = `5` servers to meet the demand.
  - with redundancy factor: 5 x 2 = `10` servers
### Memory
- If we assume each connected editor session consumes ~200 KB of ephemeral server memory (session + cursors + per-doc working set):
  - **editors/server** = 10,000 editors / 10 servers = `1,000` editors/server.
  - **memory** = 1,000 × 200 KB = `200,000` KB.
  - 200,000 KB / 1024 = `195.3125 MB` of pure session memory (plus doc state, OS, JVM/container overhead).
-  Provision **_~8–16 GB RAM_** per server depending on number of hot docs, language runtime, and caching.

---

## CRDT
Before going deep, lets have an idea on what is `CRDT` is
- **Full form**: Conflict-free Replicated Data Type.
- It’s a data structure designed for distributed systems where multiple users (or replicas) can update data concurrently and still converge to the same final state without conflicts.  

👉 In simple words:
- Everyone can edit at the same time.
- Even if operations arrive out of order or offline, once merged, all copies of the doc look the same.

### Why Google Docs–style systems use CRDTs?
- To allow offline edits → sync later.
- To ensure no lost updates.
- To remove the need for centralized locking.

### How CRDT works (for text docs)
- Each character or element in the doc has a unique ID (not just a position).
- When you type, an insert op is created with that ID.
- If two people type at the same time, both inserts exist — CRDT uses IDs to keep deterministic ordering.
- Deletes are tombstones (marked as removed but still traceable until compaction).

## High-Level Architecture
![Google Docs](https://pub-b8d5ca13188446a08ac9941fcca1304e.r2.dev/google-docs.png)

### Components
- **Client** - Web, Mobile, Desktop
  - _Local apply + op queue, offline cache, WebSocket for real-time ops, HTTP for metadata/snapshots._
  - As soon as the user type, the operation like **insert/delete/format** will be applied locally to the editor so that user can see changes instantly. And then these operation will be pushed to **op (operation) queue** and once the user goes online, queue elements will be flushed to the **Collaboaration server over the Websocket**.
  - And then servers apply a merge algorithm and send the `ACK` (Acknowledgement) to the client
- **Edge / API Gateway**
  - TLS termination, authentication, route WebSocket to regional collab cluster, static assets via CDN.
- **Realtime Collaboration Cluster (per region)**
  - Router/Gateway: sticky routing by document ID to collab servers.
  - Collaboration Servers: keep in-memory live doc state for hot docs, validate and broadcast ops.
  - Sequencer / Orderer (optional): canonical sequence numbers when stronger ordering semantics are required (hybrid CRDT + sequencer).
- **Persistence Layer**
  - Short-term WAL / append log (fast SSD) for durability of ops.
  - Long-term snapshots stored in object store (S3/GCS). Deltas (ops) archived alongside.
- **Search & Indexing Pipeline**
  - Sidecar pipeline that extracts text from snapshots and pushes to search index with ACLs.
- **Assets/Media + CDN**
  - Images and large attachments stored in object store and delivered from CDN.
- **Auth & Permissions Service**
  - Centralized IAM, token issuance, ACL evaluation (used by collab servers & search queries).
- **History & Versioning Service**
  - Exposes snapshot browsing, diffs, restore endpoints.
- **Offline Sync Service**
  - Handles complex rebase/replay when clients reconnect with queued ops.
- **Observability & Ops**
  - Metrics, distributed tracing, logs, alerting, autoscaling.

### Data flow (editing)
> **Client applies edit locally → emits CRDT op → sends to regional collab server over WebSocket → collab server persists op to WAL, assigns sequence if needed, broadcasts to other clients → periodic snapshot compaction persisted to object store.**

## Low-Level Architecture
This is the detailed, actionable part — includes **_CRDT choice, message formats, persistence layout, compaction strategy, APIs, and failure handling_**.
### Collaboration algorithm: hybrid CRDT + server sequencing
- Why hybrid?
  - CRDTs enable safe offline edits & easy merges.
  - Server sequencing provides a compact, linearized server view for history, search, and operations that require a single canonical order.
- Recommended CRDT
  - A sequence CRDT like RGA / Logoot / Yjs style (identifier per element). Use tombstones for deletes, and periodic compaction to remove tombstones and reassign compact IDs in snapshots.
  
### CRDT op JSON (example)
```
{
  "type": "op",
  "opId": "uuid-1234",
  "userId": "user-42",
  "docId": "doc-7",
  "op": {
    "action": "insert",            // insert | delete | style
    "posId": "elem-345",           // anchor element id for insert
    "elemId": "elem-678",          // unique id for new element
    "value": "Hello",              // inserted text chunk
    "meta": { "attrs": { "bold": true } }
  },
  "causal": { "clock": 12345678 }, // client Lamport/vector clock
  "ts": 1690000000
}
```

### WebSocket protocol (simplified)
- **Client → Server messages**: op, cursor, presence, heartbeat, sync-request
- **Server → Client messages**: op-broadcast, ack(seq/opId), snapshot, presence-update
```
{ "type": "ack", "opId": "uuid-1234", "seq": 10010 }
```

### Persistence layout
#### Metadata DB (SQL / Spanner)
```
DOCUMENTS (document_id PK, owner_id, title, latest_snapshot_id, acl_id, created_at, updated_at)
SNAPSHOTS (snapshot_id PK, document_id FK, storage_path, seq_start, seq_end, created_at)
DELTAS (doc_id, seq_num PK, op_blob_path, created_at)
ACLS (acl_id PK, doc_id FK, subject_id, role)
```
#### Object store
- `/snapshots/{doc}/{snapshot_id}.blob`
- `/assets/{asset_id}`
- `/deltas/{doc}/op_{seq}.ndjson (optional)`
#### Short term durable WAL
- Append-only log (local SSD with replication to durable storage) to guarantee durability on write before ack.

### Snapshotting & compaction
When to snapshot
- On thresholds: `ops_since_last_snapshot > 50k` OR `time_since_last_snapshot > 10` min OR when doc unmounted.

### Offline reconciling flow
- Client reconnects and sends queued ops with causal metadata (opIds & clocks).
- Server verifies opIds not already seen (dedupe).
- Server returns snapshot pointer + missing ops to bring client up to date if its base snapshot is older than server compaction point.
- If client had ops that rely on pre-compaction IDs, server provides a mapping or performs server-side rebase using compaction map.

### APIs (REST + WS)
- `POST /v1/docs` → create document.
- `GET /v1/docs/{id}` → doc metadata (latest snapshot pointer & ACL).
- `GET /v1/docs/{id}/snapshot/{snapshot_id}` → download snapshot.
- `GET /v1/docs/{id}/history?from_seq=...` → stream deltas for replay.
- `wss://api/.../realtime?doc={id}&token=...` → real-time WS for ops & presence.

### Search & Indexing
- Index snapshots when finalized/committed, include ACL tags.
- Search queries include ACL filter evaluated by search service (stamp allowed viewers only).
- Keep index refreshed by streaming deltas or periodic snapshot reindexing.

### Failure modes & recovery
- **Server crash**: WAL replay + snapshot restore. Keep WAL replicated to at least one other node for quick failover.
- **Region outage**: designate document region affinity and allow client to read-only from replicas or migrate document to new region with a short maintenance window.
- **Client loses ops**: client resends queued ops on reconnect; server dedupes via opId.
- **Compaction conflict for old clients**: server provides snapshot + mapping to rebase old ops; if impossible, server rejects very old ops and client must rebase locally (UI shows conflict resolution).

### Observability & SLOs
- **Metrics**: ops/sec, op_latency_ms (p50/p90/p99), snapshot_time, replay_time, ws_conn_count, reconnect_rate.
- **Traces**: client→gateway→collab server→persistence traces.
- **Alerts**: high op latency, WAL lag, high reconnect rate, snapshot failures.

## Conclusion
Designing a Google Docs–like system requires balancing consistency, availability, and performance. With CRDTs for conflict-free editing, WAL + snapshots for durability, and a scalable collaboration cluster, such a system can reliably support millions of concurrent users while ensuring low latency and high availability.