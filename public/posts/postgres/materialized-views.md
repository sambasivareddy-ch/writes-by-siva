---
title: "Materialized Views"
description: "Blog post on Materialized Views and How's it works efficiently than Views "
author: "Siva"
date: 2025-08-26
tags: ["PostgreSQL"]
canonical_url: "https://bysiva.vercel.app/blog/materialized-views"
---

# Materialized Views
## Definition
A **`Materialized View`** in PostgreSQL is a database object which **_stores the result of a query physically on disk_**, unlike normal VIEW which saves the `query definition`.
- It acts like a **snapshot** of the query result.
- Useful for the expensive operations like joins, aggregates etc.. that **don't need to be recalculated every time**.
- Can be refreshed to keep the data up to time.

## Demonstration
- Create a table called **_'SALES'_**
```sql
    CREATE TABLE SALES (ID INT, PRODUCT_ID INT, PRODUCT TEXT, PRICE INT, PRIMARY KEY (ID, PRODUCT_ID));
```

- Insert 2M roles for products with Product_IDs 1 & 2. 1M for each product.
```sql
    -- Product 1
    INSERT INTO SALES (ID, PRODUCT_ID, PRODUCT, PRICE)
    SELECT gs, 1, 'Product-1', (random() * 100 + 1)::INT  
    FROM generate_series(1, 1000000) gs;

    -- Product 2
    INSERT INTO SALES (ID, PRODUCT_ID, PRODUCT, PRICE)
    SELECT gs, 2, 'Product-2', (random() * 100 + 1)::INT  
    FROM generate_series(1, 1000000) gs;
```

- Now I want to know for each product, how many sales happened and what is money generated from that.
```sql
    postgres=# SELECT product_id, count(*), sum(price) FROM sales GROUP BY product_id;
    product_id |  count  |   sum    
    ------------+---------+----------
            1 | 1000000 | 50968137
            2 | 1000000 | 50984014
    (2 rows)
    Time: 98.024 ms
```
  - This query took `98.024ms`. But in real world, query can be more complex and it can work on more complex data.
  
- Let's see, can we decrease the time from 98.024ms further using Materialized View. Creating a materialized view called **money_generated**.
```sql
    CREATE MATERIALIZED VIEW money_generated 
    AS
        SELECT product_id, count(*), sum(price) 
        FROM sales 
        GROUP BY product_id;
```
    - Now the materialized view run the query and stores the results of the query in the disk or say cache the result. So that whenever the user runs the query again, materialized view simply returns the cached results without executing the query.

- Now run the query
```sql
    postgres=# SELECT * FROM money_generated;
    product_id |  count  |   sum    
    ------------+---------+----------
            1 | 1000000 | 50968137
            2 | 1000000 | 50984014
    (2 rows)

    Time: 0.169 ms
```
    - Now, we can see that query rans at around 500% faster.

## Common Problem
- In real-world applications, data will be continously inserted into the tables, means that the materialized view should be return the most recent data.
- But the materialized view executes the query only once and stores the results, to re-compute the results we can **_refresh_** the materialized view.
```sql
    -- Refresh the materialized view (to update with latest data)
    REFRESH MATERIALIZED VIEW money_generated;

    -- Optionally refresh concurrently (non-blocking, requires unique index)
    REFRESH MATERIALIZED VIEW CONCURRENTLY sales_summary;
```
  - REFRESH MATERIALIZED VIEW replaces the old data with fresh results.
  - CONCURRENTLY allows refreshing without blocking reads (but you must have a unique index on the view).
### Example
```sql
    postgres=# delete from sales where product_id = 1;
    DELETE 1000000

    postgres=# SELECT product_id, count(*), sum(price)
               FROM sales
               GROUP BY product_id;
    product_id |  count  |   sum    
    ------------+---------+----------
            2 | 1000000 | 50984014
    (1 row)
    Time: 64.052 ms

    postgres=# select * from total;
    product_id |  count  |   sum    
    ------------+---------+----------
            1 | 1000000 | 50968137
            2 | 1000000 | 50984014
    (2 rows)
    Time: 0.376 ms

    -- Now you see, still the view returning old data, so we ran refresh on materialized view
    REFRESH MATERIALIZED VIEW money_generated;

    postgres=# select * from total;
    product_id |  count  |   sum    
    ------------+---------+----------
            2 | 1000000 | 50984014
    (1 row)
    Time: 0.176 ms
```

## Difference between Materialized Views and Normal Views
- Materialized Views stores the query results on Disk while views don't store the results.
- Materialized Views returns the pre-computed data while Views run the query everytime to return the data.
- Views are alway up-to date while Materialized Views will might return stale data until refreshes it.
- Views are slower in performance for larger data while Materialized view is faster as the results are pre-computed

## Practical Usage
- Data Warehousing / BI reports: Store aggregated sales, financial summaries, etc.
- Caching: Speed up queries that join multiple large tables.
- Pre-computation: Store expensive calculations (like analytics or ML features).
- API/Frontend optimization: Provide pre-aggregated results for dashboards.