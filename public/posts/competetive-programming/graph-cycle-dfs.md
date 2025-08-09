---
title: "Graph Cycle Detection using DFS"
description: "Using recursive DFS algorithm to find the cycle in a graph"
author: "Siva"
date: 2025-08-09
tags: ["Competitive Programming", "Graph"]
canonical_url: "https://bysiva.vercel.app/blog/graph-cycle-dfs"
---

# Graph Cycle Detection using DFS
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
   - We use Depth-First Search (DFS) to explore the graph. A cycle exists in an undirected graph if:
       - While visiting a node, we find a neighbor that is already visited and is not the parent of the current node.
2. Algorithm Steps
    - Mark all nodes as unvisited initially.
    - For each node in the graph:
       - If the node is unvisited, start a DFS from it.
       - Pass the parent node in DFS to track where you came from. 
    - DFS Procedure:
        - Mark the current node as visited.
        - For each neighbor of the current node:
            - If the neighbor is unvisited → Recursively DFS into it.
            - If the neighbor is already visited and not the parent → Cycle found.
    - If any DFS call finds a cycle → return True.
    - If all DFS calls finish without finding a cycle → return False.

## Code
```python
def detectCycle(graph) ->  bool:
    n = len(graph)
    visited = [False]*n 

    def hasCycle(node, parent):
        visited[node] = True 
        for adj in graph[node]:
            if not visited[adj]:
                if hasCycle(adj, node):
                    return True
            elif adj != parent:
                return True
        return False
                
    for start in range(n):
        if not visited[start]:
            if hasCycle(start, -1):
                return True
    
    return False

graph = [[1, 3], [0, 2, 4], [1, 5], [0, 4], [1, 3, 5], [2, 4]]
result = detectCycle(graph)
print("Found cycle: ", result)
```

## Complexity Analysis
- **Time Complexity** - O(V + E) - Because we visit each node of the graph and edge once
- **Space Complexity** - O(V) - Storing the each node in the visited array