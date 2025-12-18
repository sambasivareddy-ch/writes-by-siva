---
title: "Check for symmetry in a binary tree"
description: "Given a binary tree, check whether it is a mirror of itself"
author: "Siva"
date: 2025-07-04
tags: ["Competitive Programming", "Tree"]
canonical_url: "https://bysiva.vercel.app/blog/cp-12"
---

# Check for symmetry in a binary tree
## Problem Statement
Given a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).

### Tree Structure
```
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
      2   2
     / \ / \
    3  4 4  3
- The tree is symmetric.
```

## Approach (DFS)
- We can use a depth-first search (DFS) approach to check for symmetry.
- The steps are as follows:
    - If both nodes are `nil`, return true (base case).
    - If one of the nodes is `nil`, return false (base case).
    - Check if the values of the two nodes are equal, if not return false.
    - Recursively check the left subtree of the first root node with the right subtree of the second root node. (check 1)
    - And recursively check the right subtree of the first root node with the left subtree of the second root node. (check 2)
    - If both checks return true, then the tree is symmetric.
```go
func isSymmetric(left, right *TreeNode) bool {
	if left == nil && right == nil {
		return true
	}
	
	if left.Val != right.Val {
		return false
	}

	if left == nil || right == nil {
		return false 
	}

	return isSymmetric(left.Left, right.Right) && isSymmetric(left.Right, right.Left)
}
```

## Complexity Analysis
- Time Complexity: O(n), where n is the number of nodes in the tree. We visit each node exactly once.
- Space Complexity: O(h), where h is the height of the tree. This is due to the recursive stack space used during the traversal.
- In the worst case, the height of the tree can be n (if the tree is skewed), leading to O(n) space complexity. In the best case, the height is log(n) for a balanced tree, leading to O(log n) space complexity.