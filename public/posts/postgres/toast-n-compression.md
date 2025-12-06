---
title: "Toast And Compression"
description: "In this blog, we will discuss about how the large data stored in Postgres with the help of Toast and Compression Techniques"
author: "Siva"
date: 2025-10-29
tags: ["PostgreSQL"]
canonical_url: "https://bysiva.vercel.app/blog/toast-n-compression"
---

# Unpacking PostgreSQL TOAST: How Large Data Gets Stored (and Compressed)
When working with PostgreSQL, most developers think in terms of rows and columns. But few ever stop to wonder what happens when a single column value—say a giant JSON document or a lengthy text blob—grows too large for PostgreSQL’s fixed 8KB page size.   
PostgreSQL has a clever answer to this challenge: `TOAST`, short for The Oversized-Attribute Storage Technique.  
In this post, we’ll explore what TOAST is, how it compresses and stores large data efficiently, and how you can tune its behavior for optimal performance.

## What is TOAST 🍞?
Every table in PostgreSQL is made up of pages, each typically 8KB in size. Every row must fit inside a single page—there’s no spanning allowed.  

Now consider a table like this:
```sql
CREATE TABLE documents (id SERIAL PRIMARY KEY, content TEXT);
```
Insert a large data into it:
```sql
INSERT INTO documents (content)
VALUES (repeat('A very long string ', 10000));
```
The data we just inserted will definitely exceeds `8kb`, so what happens now?   

**That's where the TOAST steps in**  

- When PostgreSQL detects that a row (or an attribute within it) is too large, it will compress and/or move the oversized attribute into a separate, automatically created TOAST table.  
- Your main table still contains a reference to the data, but the bulk of it lives elsewhere—quietly, efficiently, and transparently.

## How TOAST Works Under the Hood
When a **TOASTable data type (like TEXT, BYTEA, or JSONB)** is inserted or updated, PostgreSQL checks if the value fits into the main table’s page.  

If it doesn’t, PostgreSQL applies this sequence of actions:
- **Attempt Compression**
  - The data is compressed using PostgreSQL’s internal algorithm (pglz by default, or lz4 in modern versions).
- **Check Size Again**
  - If the compressed data still doesn’t fit, it’s stored “out-of-line” in a TOAST table.
- **Store a Pointer in the Main Table**
  - The original table keeps a small pointer (around 18 bytes) referring to the TOASTed value.

PostgreSQL automatically creates and manages this TOAST table behind the scenes. You can see its existence using:
```sql
\d+ documents;
```
Look for **_Storage_** column
```markdown
Column  |  Type    | Storage | 
--------+----------+---------+
id      | integer  | plain   |     
content | text     |extended | 
```
- **plain**: No compression, no out-of-line storage
- **extended**: Compresses and stores out-of-line if needed (default)

## TOAST Storage Strategies
TOAST behavior can be controlled per column using the STORAGE parameter. There are four strategies:
- **PLAIN**: No compression, no out-of-line storage (large data will fail to insert)
- **MAIN**: Compresses, stores inline if possible
- **EXTERNAL**: No compression, stores out-of-line if too large
- **EXTENDED**: Compresses and stores out-of-line if needed (default)
### Example
```sql
CREATE TABLE custom_toast (
    id serial,
    doc text STORAGE EXTERNAL
);
```
This tells PostgreSQL: **“Don’t compress, just store the data externally if it doesn’t fit.”** 

You can modify an existing column too:
```sql
ALTER TABLE custom_toast ALTER COLUMN doc SET STORAGE MAIN;
```

## Compression: PostgreSQL’s Hidden Superpower
By default, PostgreSQL uses pglz compression—a lightweight, lossless algorithm that strikes a balance between speed and ratio.  
Since PostgreSQL 14, you can optionally enable lz4, which is faster but produces slightly less compression.  
You can check what compression method a column is using with:
```sql
SELECT pg_column_compression('documents', 'content');
```
Typical outputs:
- 'pglz' – default
- 'lz4' – if enabled and chosen
- NULL – not compressed

Want to enable LZ4 globally?
```sql
ALTER SYSTEM SET default_toast_compression = 'lz4';
SELECT pg_reload_conf();
```

## Peeking Inside TOAST Data
Every table that might store large attributes has a TOAST companion table, named something like `_tablename_oid`.  
You can discover it with:
```sql
SELECT reltoastrelid::regclass
FROM pg_class
WHERE relname = 'documents';
```
Once you know the name, you can even (carefully) inspect it:
```sql
SELECT * FROM pg_toast_66387 LIMIT 5;
```
Each row corresponds to a “chunk” of your compressed or uncompressed large data.

## Performance Considerations
While TOAST is fantastic for automatic management, there are trade-offs.
### ✅ Advantages
- Transparent to the user
- Automatic compression and storage
- Keeps main tables smaller and faster for most operations
### ⚠️ Caution
- Accessing TOASTed data requires an extra lookup → slight performance cost
- Sequential scans on large, frequently-accessed text columns can slow down
- Updates to large TOASTed values can cause extra writes

## Conclusion
PostgreSQL’s TOAST system is one of those features that “just works”—quietly optimizing how large data is stored, compressed, and retrieved.  
Understanding how it works gives you powerful insight into your database’s inner mechanics and helps you design schemas that scale gracefully, no matter how large your data grows.  
Next time you store a massive JSON blob or text document, remember:
PostgreSQL is already thinking about how to keep it lean and efficient—one TOASTed chunk at a time.