---
title: "Validate whether the BT is BST or not"
description: "Check whether the given Binary Tree is BST or not"
author: "Siva"
date: 2025-07-07
tags: ["Competitive Programming", "BST"]
canonical_url: "https://bysiva.vercel.app/blog/cp-16"
---

# Validate whether the BT is BST or not
## Problem Statement
Check whether the given Binary Tree is BST or not. If yes return true else false

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
        10
       /  \
      5    30
     / \
    1   8

Valid = true

        10
       /  \
      5    9
     / \
    1   8

Valid = false
```

## Approach (Recursive)
### 1. Assumption
- The validation logic assumes that node values fall within the range `[IntMin, IntMax]`, which represents the **full integer range**.
- This is the **initial valid range** for the root node.
### 2. Validating the Root Node
- If the `root` node’s value lies within `[min, max]`, it is considered valid.
- The root node splits the range for its left and right subtrees.
### 3. Left Subtree Constraints
- All nodes in the **left subtree** must have values in the range `[min, root.Val]`.
- This is because in a BST, the left child's value is **less than** the parent node.
- Therefore, the **maximum** valid value for the left subtree is `root.Val`.
### 4. Right Subtree Constraints
- All nodes in the **right subtree** must have values in the range `[root.Val, max]`.
- This is because the right child's value is **greater than** the parent node.
- So the **minimum** valid value for the right subtree is `root.Val`.
### 5. Invalid Node Detection
- A node is considered **invalid** if:
  - `node.Val <= min`, or
  - `node.Val >= max`.
- This violates the allowable value range passed down from ancestors.

```go
func validateBST(root *TreeNode, min, max int) bool {
	if root == nil {
		return true 
	}

	if root.Val <= min {
		return false 
	}

	if root.Val >= max {
		return false 
	}

	return validateBST(root.Left, min, root.Val) && validateBST(root.Right, root.Val, max)
}
```

## Complexity Analysis
### Time Complexity
- O(n): since we have to visit every node in the tree to check the validity
### Space Complexity
- O(h): Height of the binary tree as it stored in stack due to recursion