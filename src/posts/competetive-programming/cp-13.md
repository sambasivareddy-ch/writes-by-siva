---
title: "Binary Tree from Preorder and Inorder Traversal"
description: "Given the preorder and inorder traversal of a binary tree, construct the binary tree."
author: "Siva"
date: 2025-07-04
tags: ["Competitive Programming", "Tree"]
canonical_url: "https://bysiva.vercel.app/blog/cp-13"
---

# Binary Tree from Preorder and Inorder Traversal
## Problem Statement
Given the preorder and inorder traversal of a binary tree, construct the binary tree.

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
- The preorder traversal is [1, 2, 4, 5, 3].
- The inorder traversal is [4, 2, 5, 1, 3].
```

## Approach (DFS)
- We can use a depth-first search (DFS) approach to construct the binary tree from the given traversals.
- The steps are as follows:
    - The first element of the preorder traversal is the root of the tree.
    - Find the index of the root in the inorder traversal to determine the left and right subtrees.
    - Recursively construct the left subtree using the elements before the root in the inorder traversal and the corresponding elements in the preorder traversal.
    - Recursively construct the right subtree using the elements after the root in the inorder traversal and the corresponding elements in the preorder traversal.
```go
func buildTree(preorder []int, inorder []int) *TreeNode {
	if len(preorder) == 0 || len(inorder) == 0 {
		return nil
	}

	root := &TreeNode{Val: preorder[0]}

	inorderIndex := 0
	for idx, val := range inorder {
		if val == root.Val {
			inorderIndex = idx
			break
		}
	}

	root.Left = buildTree(preorder[1:1+inorderIndex], inorder[:inorderIndex])
	root.Right = buildTree(preorder[1+inorderIndex:], inorder[inorderIndex:])

	return root
}
```

## Complexity Analysis
- Time Complexity: O(n), where n is the number of nodes in the tree. We visit each node exactly once.
- Space Complexity: O(n), where n is the number of nodes in the tree. This is due to the space used for the recursive stack and the storage of the tree nodes.
- In the worst case, the tree can be skewed, leading to O(n) space complexity. In the best case, the tree is balanced, leading to O(log n) space complexity.