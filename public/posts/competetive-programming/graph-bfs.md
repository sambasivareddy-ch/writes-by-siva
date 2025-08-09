---
title: "Graph Traversal(BFS)"
description: "BFS Algorithm to traverse the Graph"
author: "Siva"
date: 2025-08-02
tags: ["Competitive Programming", "Graph"]
canonical_url: "https://bysiva.vercel.app/blog/graph-bfs.md"
---

# Graph BFS Traversal
## Problem Statement
Given an undirected connected graph with V vertices numbered from 0 to V-1, the task is to implement the Breadth First Search (BFS) traversal starting from the 0th vertex. The graph is represented using an adjacency list where adj[i] contains a list of vertices connected to vertex i. Visit nodes in the order they appear in the adjacency list.

### Example
```tree

            1 ------------- 3
          / |               |
        /   |               |
       0    |               |
        \   |               |
          \ |               |
            2 ------------- 4
    
    Output: 0 -> 1 -> 2 -> 3 -> 4
```

## Approach
- Using this algorithm, first we start from the source node. Then visit all of it's adjacent nodes before traversing through the adjacent node's adjacent nodes.
- **Initialization**: Initialize a queue. And enqueue the source node and mark it as visited.
- **Main Logic**: While queue is not empty
  - Dequeue a node from the front of queue to explore it's adjacent nodes.
  - Enqueue all of the dequeue node's neighbours if they are not visited already.
  - While enqueuing the neighbours, mark them as **visited**, so that we no need to process that node again.
- Repeat the step 2, until the queue is empty.
  
### Code
```python
def bfs(graph: List[List[int]]) -> List[int]:
    n = len(graph)
    visited = [False]*n 
    queue = [0] # Start with Node 0
    visited[0] = True

    result = []

    while queue:
        curr = queue.pop(0)
        for adj_node in graph[curr]:
            if not visited[adj_node]:
                queue.append(adj_node)
                visited[adj_node] = True
        result.append(curr)
    
    return result

graph = [[1,2], [0,2,3], [0,4], [1,4], [2,3]]
result = bfs(graph)
print(result)
```

## Complexity Analysis
- **Time Complexity** - O(n) - Because we visit each node of the graph once
- **Space Complexity** - O(n) - Storing the each node in the result and queue