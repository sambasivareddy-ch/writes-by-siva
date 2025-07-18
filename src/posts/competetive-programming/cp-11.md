---
title: "Maximum Depth of Binary Tree"
description: "Given a binary tree, find its maximum depth."
author: "Siva"
date: 2025-07-03
tags: ["Competitive Programming", "Tree"]
canonical_url: "https://bysiva.vercel.app/blog/cp-11"
---

# Maximum Depth of Binary Tree
## Problem Statement
Given a binary tree, find its maximum depth. The maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.

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
     / \
    4   5
       /
      6
- The maximum depth of this tree is 4 (1 -> 2 -> 5 -> 6).
```

## Approach (DFS)
- We can use a depth-first search (DFS) approach to traverse the tree and find the maximum depth.
- The steps are as follows:
    - If the current node is `nil`, return 0 (base case).
    - Recursively find the maximum depth of the left and right subtrees and take the maximum of the two depths to get the depth of the current node.
```go
func maxDepth(root *TreeNode, depth int) int {
	if root == nil {
		return depth 
	}

	leftDepth := maxDepth(root.Left, depth+1)
	rightDepth := maxDepth(root.Right, depth+1)

	if leftDepth > rightDepth {
		return leftDepth
	}
	return rightDepth
}
```

## Complexity Analysis
- Time Complexity: O(n), where n is the number of nodes in the tree. We visit each node exactly once.
- Space Complexity: O(h), where h is the height of the tree. This is due to the recursive stack space used during the traversal.