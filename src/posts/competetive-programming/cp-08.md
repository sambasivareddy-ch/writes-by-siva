---
title: "Path from Root to Node."
description: "Given a Binary Tree, return the path from the root to a specified node."
author: "Siva"
date: 2025-07-02
tags: ["Competitive Programming", "Tree"]
canonical_url: "https://bysiva.vercel.app/blog/cp-08"
---

# Path from Root to Node.
## Problem Statement
Given a Binary Tree, return the path from the root to a specified node.

### Constraints
- Given node is guaranteed to be present in the tree.
- Node values are unique.

### Tree Structure
```go
type TreeNode struct {
    Val   int
    Left  *TreeNode
    Right *TreeNode
}
```

### Example
```tree

	    1
	   / \
	  2   3
	 / \   \
	4   5   6
	   / \
	  7   8

For the target node 7, the path from root to node 7 is [1, 2, 5, 7].	
```

## Approach (DFS)
- We can use a depth-first search (DFS) approach to traverse the tree and find the path to the specified node.
- We will maintain a list to store the current path from the root to the current node.
- When we reach the specified node, we will return the path.
```go
func findPath(root *TreeNode, target int, path *[]int) bool {
	if root == nil {
		return false
	}

	if root.Val == target {
		*path = append([]int{root.Val}, *path...) 
		return true
	}

	if findPath(root.Left, target, path) || findPath(root.Right, target, path) {
		*path = append([]int{root.Val}, *path...)
		return true
	}

	return false
}

func rootToNodePath(root *TreeNode, target int) []int {
	path := []int{}
	if findPath(root, target, &path) {
		return path
	}
	return nil // Return nil if the target is not found 
}
```

## Complexity Analysis
- **Time Complexity**: O(n), where n is the number of nodes in the binary tree. We may visit each node once.
- **Space Complexity**: O(h), where h is the height of the tree. This is due to the recursive stack space used during the traversal.
