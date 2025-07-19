---
title: "Search in BST"
description: "Given the key and root of the BST, search the key in BST"
author: "Siva"
date: 2025-07-07
tags: ["Competitive Programming", "BST"]
canonical_url: "https://bysiva.vercel.app/blog/cp-15"
---

# Search in BST
## Problem Statement
Given the root of a binary search tree (BST) and an integer val. Find the node in the BST that the node's value equals val and return the subtree rooted with that node. If such a node does not exist, return null.

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

Search Key = 1
- Found = True
Search Key = 28
- Found = False
```

## Approach (Recursive)
- Given a Binary Search Tree and a key. Search for the key in the BST,
- If the root is Null return False.
- If the root's Val == val return True.
- Else if root.Val > val, that means the "val" might have exists in the Left subtree of the root then search in Left Subtree.
- Else if root.Val < val, that means the "val" might have in Right subtree search in Right subtree.
```go
func searchBST(root *TreeNode, val int) bool {
	if root == nil {
		return false
	}

	if root.Val == val {
		return true 
	}

	if val < root.Val {
		return searchBST(root.Left, val)
	}

	return searchBST(root.Right, val)
}
```

## Complexity Analysis
### Time Complexity
- O(log n): if the tree is balanced BST
- O(n): if the tree is skewed
### Space Complexity
- O(h): Height of the BST