---
title: "Grid Unique Paths"
description: "Given a m*n matrix, find number of unique path to reach (m-1,n-1) from (0,0)"
author: "Siva"
date: 2025-07-22
tags: ["Competitive Programming", "Array"]
canonical_url: "https://bysiva.vercel.app/blog/unique-path"
---
# Grid Unique Paths
## Problem Statement
Given two integers m and n, representing the number of rows and columns of a 2d array named matrix. Return the number of unique ways to go from the top-left cell (matrix[0][0]) to the bottom-right cell (matrix[m-1][n-1]).
### Constraints
Allowed Moves:
- Move Right 
- Move Down

### Example
```text
    Input: m = 3, n = 2
    Output: 3
    Explanation: Starting from (0,0)
    down(1,0) -> down(2,0) -> right(2,1)
    down(1,0) -> right(1,1) -> down(2,1)
    right(0,1) -> down(1,1) -> down(2,1)
```

## Approach (Recursive)
- The function getNoOfValidPaths(i, j, m, n) is a recursive algorithm that calculates the total number of valid paths from a given cell (i, j) to the bottom-right cell (m-1, n-1) in a grid of size m x n. The only allowed moves are:
    - Move right (i.e., to (i, j+1))
    - Move down (i.e., to (i+1, j))
- Base Cases:
    - If current cell is m-1, n-1 i.e (i == m-1 && j == n-1), we have reached our destination so return 1
    - If current cell falls besides outside the grid (i >= m or j >= n), return 0
- Recursive Step:
    - From the current position (i, j), try:
        - Moving Down -> (i+1, j)
        - Moving Right -> (i, j+1)
    - Add the results of both paths to get the total number of valid paths from the current cell.
```python
def getNoOfValidPaths(i, j, m, n):
    if i == m-1 and j == n-1:
        return 1 
    elif i >= m or j >= n:
        return 0 
    
    down = getNoOfValidPaths(i+1, j, m, n)
    right = getNoOfValidPaths(i, j+1, m, n)

    return down + right 
```
### Complexity Analysis
- **Time Complexity** - O(2^(m+n))
- **Space Complexity** - O(m + n)

## Approach (Dynamic Programming)
- For larger grids, we might have compute same sub-path again and again for different cells which adds extra computational code. So to avoid that we are introducing **memoization**.
```python
def getNoOfValidPathsUsingDP(i, j, m, n, memo):
    if i == m-1 and j == n-1:
        return 1 
    elif i >= m or j >= n:
        return 0 
    
    if (i, j) in memo:
        return memo[(i, j)]
    
    down = getNoOfValidPaths(i+1, j, m, n, memo)
    right = getNoOfValidPaths(i, j+1, m, n, memo)

    memo[(i, j)] = down + right 
    return memo[(i, j)]
```
- Same as recursive approach, but here we introduced a dictionary (memo) to memorize the already computed sub-path. If found return that instead of computing again.
### Complexity Analysis
- **Time Complexity** - O(m*n)
- **Space Complexity** - O(m*n)
