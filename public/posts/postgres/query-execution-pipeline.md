---
title: "Query Execution Pipeline"
description: "Detailed & structured explanation of how queries will be processed and execution in PostgreSQL Internally"
author: "Siva"
date: 2025-08-08
tags: ["PostgreSQL"]
canonical_url: "https://bysiva.vercel.app/blog/query-execution-pipeline"
---

# The Query Execution Pipeline in PostgreSQL - From SQL string to Results

## 📚 Table of Contents
- [The Query Execution Pipeline in PostgreSQL - From SQL string to Results](#the-query-execution-pipeline-in-postgresql---from-sql-string-to-results)
  - [📚 Table of Contents](#-table-of-contents)
  - [Introduction](#introduction)
    - [In Big Picture](#in-big-picture)
  - [Stages Breakdown](#stages-breakdown)
    - [A. Parsing](#a-parsing)
      - [Example](#example)
    - [B. Analyzer \& Rewriting](#b-analyzer--rewriting)
      - [Example (based on view)](#example-based-on-view)
    - [C. Planner/Optimizer](#c-planneroptimizer)
      - [Example](#example-1)
    - [D. Execution](#d-execution)
      - [Example](#example-2)
  - [Conclusion](#conclusion)
   
Have you ever wondered how PostgreSQL return the results **magically** out of nowhere, when you run a query with simple SQL Statement? Well this blog helps you understand in this blog with detailed explanation

## Introduction
In reality, PostgreSQL follows a **_multi-stage pipeline_** that transforms your SQL statement into a well-optimized executable plan and then runs that plan to fetch the results.
### In Big Picture
PostgreSQL's query execution pipeline can be thought of in five key stages:
- **Parser** - Check syntax and create an internal referencable _Parse Tree_.
- **Analyzer** - The analyzer carries out a semantic analysis of a parse tree and generates a _Query Tree_ (unoptimized).
- **Rewriter** - Rewriter transforms a query tree into better query tree (still unoptimized) by applying **Rules, Views and Constraints**.
- **Planner/Optimizer** - The planner decides the best way to run the query by choosing the best plan tree from the set of generated plan trees that can most effectively be executed from the query tree.
- **Executor** - Finally, the executor executes the query how the choosed plan tells by accessing the tables, views and indexes.
```pgsql
SQL --> Parser --> Analyzer --> Planner/Optimizer --> Executor --> Results
```

## Stages Breakdown
### A. Parsing
- PostgreSQL takes our SQL statement and parse it into a `parse tree`.
- It do certain checks on the query like:
  - Syntax (`SELECT` vs `SELEC` ?)
  - Also checks for valid column names, functions exists (like avg(), sum()) etc.
- At the end of this stage, we will posses a raw **parse tree* based on syntax (not optimized).
#### Example
```sql
    SELECT id, first_name FROM users WHERE age > 30;
```
At this stage, PG only cares that:
- Does the `users` table exists?
- Columns `id`, `first_name` and `age` exists in `users` table?
- `>` is valid?
- All `Keywords` used are valid?

### B. Analyzer & Rewriting
- Analyzer carries out a **semantic** analysis of a parse tree and generates a query tree.
- In this stage, PostgreSQL rewriter tries to apply the transformation rules defined [here](https://www.postgresql.org/docs/current/rules.html). Few examples:
  - **Views** --> replaced with theire underlying query definition.
  - **Rules** --> rewrite logic applied
- At the end of this stage, rewriter convers the parse tree into query tree on bases of semantics (not optimized)
#### Example (based on view)
```sql
    CREATE VIEW active_users AS SELECT * FROM users WHERE active = true;  -- active_users view

    -- We queried as follows:
    SELECT id FROM active_users WHERE age > 30;
```
Now, the rewriter will transforms the above query into something like:
```sql
    SELECT id FROM users WHERE active = true AND age > 30;
```

### C. Planner/Optimizer
- The main master mind in the whole execution pipeline.
- It takes the query tree as input and generates the **multiple candidata execution plans** for the query.
- It estimates the **_cost_** of each plan generated using table statistics and selects the **cheapest** one among the all.
- But the cost estimated is based purely on stats available, it might not 100% accurate.
- Cost Factors:
  - Table Size
  - Index Availability
  - Join Algorithms (Nested Loop, Hash Join, Merge Join)
  - Disk I/O vs Memory Usage
#### Example
```sql
    EXPLAIN SELECT id, first_name FROM users WHERE age > 30;
```
Might returns:
```sql
    Seq Scan on users (cost=0.00..45.00 rows=300 width=12)
        Filter: (age > 30)
```
Meaning
- PostgreSQL will scan the whole `users` table.
  - Seq Scan refers table scan.
  - Some other scan you might come across: `IndexScan`, `TidScan`, `BitmapScan`, `IndexOnlyScan` etc.
- Expected rows in the results will be `~300`.

### D. Execution
- The executor follows the plan choosen by planner and executes it step by step.
- Execution is **Volcano-Style**, meaning each node gets the results from its child node, and processes them and passes them upwards.
#### Example
```sql
    EXPLAIN SELECT primary_category, sum(likes) FROM blogs GROUP BY primary_category;

                            QUERY PLAN                          
    --------------------------------------------------------------
    HashAggregate  (cost=102.65..102.66 rows=1 width=13)
        Group Key: primary_category
        ->  Seq Scan on blogs  (cost=0.00..102.43 rows=43 width=9)
    (3 rows)
```
As explained:
- At first, postgresql will scan entire table `blogs` and passes it's results to HashAggregate.
- HashAggregate will apply `Group Key` and computes the `sum(likes)` and gives the results to the users.
  
## Conclusion
PostgreSQL’s query execution pipeline is a blend of parsing rigor, rewrite intelligence, and cost-based planning wizardry. By understanding each stage, you can write smarter SQL and make the database work for you, not against you.