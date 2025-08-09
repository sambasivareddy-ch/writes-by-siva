---
title: "Graph Cycle Detection using BFS"
description: "Using BFS algorithm to find the cycle in an undirected graph"
author: "Siva"
date: 2025-08-09
tags: ["Competitive Programming", "Graph"]
canonical_url: "https://bysiva.vercel.app/blog/graph-cycle-bfs"
---

# Graph Cycle Detection using BFS
## Problem Statement
Given an undirected graph with V vertices labeled from 0 to V-1. The graph is represented using an adjacency list where adj[i] lists all nodes connected to node. Determine if the graph contains any cycles.

### Example
```tree

            1 ------------ 2
          /   \            |
        /      \           |
       0        \          |
        \        \         |
          \       \        |
            3 ---- 4 ----- 5

    Cycle 1: 0 --> 1 --> 4 --> 3 --> 0
    Cycle 2: 1 --> 2 --> 5 --> 4 --> 1
    Cycle 3: 0 --> 1 --> 2 --> 5 --> 4 --> 3 --> 0

```

## Algorithm
1. Idea
   - In an undirected graph:
       - We use BFS to traverse nodes level-by-level.
       - For each node, we track the parent from which we arrived.
       - If we encounter a visited neighbor that is not the parent, we have found a cycle.
2. Algorithm Steps
   - Create a visited array (all False initially).
   - For each unvisited node:
       - Start BFS from that node.
       - Use a queue storing (node, parent).
   - While queue is not empty:
       - Pop (current, parent) from queue.
       - For each neighbor of current:
           - If not visited → Mark visited, enqueue (neighbor, current).
           - Else if visited and neighbor ≠ parent → Cycle found.
   - If no cycle found after BFS from all components → return False.

## Code
```python
def detectCycleBFS(graph):
    n = len(graph)
    visited = [False] * n

    for start in range(n):
        if not visited[start]:
            queue = [(start, -1)]
            visited[start] = True

            while queue:
                node, parent = queue.pop(0)
                for neighbor in graph[node]:
                    if not visited[neighbor]:
                        visited[neighbor] = True
                        queue.append((neighbor, node))
                    elif neighbor != parent:
                        return True
                    
    return False

graph = [[1, 3], [0, 2, 4], [1, 5], [0, 4], [1, 3, 5], [2, 4]]
result = detectCycleBFS(graph)
print("Found cycle: ", result)
```

## Complexity Analysis
- **Time Complexity** - O(V + E) - Because we visit each node of the graph and edge once
- **Space Complexity** - O(V) - Storing the each node in the visited array