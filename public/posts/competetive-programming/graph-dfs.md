---
title: "Graph Traversal(DFS)"
description: "DFS Algorithm to traverse the Graph"
author: "Siva"
date: 2025-08-08
tags: ["Competitive Programming", "Graph"]
canonical_url: "https://bysiva.vercel.app/blog/graph-dfs.md"
---

# Graph BFS Traversal
## Problem Statement
Given an undirected connected graph with V vertices numbered from 0 to V-1, the task is to implement the Depth First Search (DFS) traversal starting from the 0th vertex. The graph is represented using an adjacency list where adj[i] contains a list of vertices connected to vertex i. Visit nodes in the order they appear in the adjacency list.

### Example
```tree

            1 ------------- 3
          / |               |
        /   |               |
       0    |               |
        \   |               |
          \ |               |
            2 ------------- 4
    
    Output: 0 -> 2 --> 4 --> 3 --> 1
```

## Approach
- **Initialization**
  - Create a stack (LIFO).
  - Push the starting node into the stack.
  - Create a visited list to keep track of visited nodes.
- **Main Loop**
  - While the stack is not empty:
    - Pop the top element from the stack.
    - If it has not been visited:
      - Mark it as visited.
      - Process it (print/store in result list).
      - Push all its adjacent unvisited nodes onto the stack (often in reverse order so traversal order matches recursive DFS).
- Repeat step 2 until the stack becomes empty — all reachable nodes are visited.
  
### Code
```python
from typing import List

def dfs(graph: List[List[int]]) -> List[int]:
    n = len(graph)
    visited = [False]*n 
    stack = [0]
    result = []

    while stack:
        curr = stack.pop()
        if not visited[curr]:
            for adj in graph[curr]:
                if not visited[adj]:
                    stack.append(adj)
            visited[curr] = True
            result.append(curr)
    
    return result

graph = [[1,2], [0,2,3], [0,4], [1,4], [2,3]]
result = dfs(graph)
print(result) # [0, 2, 4, 3, 1]
```

## Complexity Analysis
- **Time Complexity** - O(V + E) - Each Vertex once (V) and each Edge once (E)
- **Space Complexity** - O(V) - Visited array and Stack for DFS