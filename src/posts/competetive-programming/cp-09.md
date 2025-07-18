---
title: "Identical Trees"
description: "Given two binary trees, determine if they are identical."
author: "Siva"
date: 2025-07-03
tags: ["Competitive Programming", "Tree"]
canonical_url: "https://bysiva.vercel.app/blog/cp-09"
---

# Identical Trees
## Problem Statement
Given two binary trees, determine if they are identical. Two binary trees are considered identical if they have the same structure and node values.

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
    Tree A:                 Tree B:

      1                        1
     / \                      / \
    2   3                    2   3
   /                        /
  4                        4

- Tree A and Tree B are identical.

    1                        1
   / \                      / \
  2   3                    2   6
     /                        /
    4                        4

- Tree A and Tree B are not identical.
```

## Approach
We can use a recursive approach to compare the two trees. The steps are as follows:
1. If both nodes are `nil`, return `true`.
2. If one node is `nil` and the other is not, return `false`.
3. If the values of both nodes are equal, recursively check the left and right subtrees.
4. If the values are not equal, return `false`.

```go
func isIdentical(tree1, tree2 *TreeNode) bool {
	if tree1 == nil && tree2 == nil {
		return true
	}

	if tree1 == nil || tree2 == nil {
		return false
	}

	if tree1.Val != tree2.Val {
		return false 
	}

	return isIdentical(tree1.Left, tree2.Left) && isIdentical(tree1.Right, tree2.Right)
}
```

## Complexity Analysis
- **Time Complexity**: O(n), where n is the number of nodes in the trees. We visit each node exactly once.
- **Space Complexity**: O(h), where h is the height of the trees. This is due to the recursive stack space used during the traversal.