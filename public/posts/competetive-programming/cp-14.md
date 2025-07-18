---
title: "Binary Tree from Inorder & Postorder Traversals"
description: "Given the inorder and postorder traversal of a binary tree, construct the binary tree."
author: "Siva"
date: 2025-07-05
tags: ["Competitive Programming", "Tree"]
canonical_url: "https://bysiva.vercel.app/blog/cp-14"
---

# Binary Tree from Inorder & Postorder Traversals
## Problem Statement
Given the inorder and postorder traversal of a binary tree, construct the binary tree.

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
- The inorder traversal is [4, 2, 5, 1, 3].
- The postorder traversal is [4, 5, 2, 3, 1].
```

## Approach (DFS)
- We can use a depth-first search (DFS) approach to construct the binary tree from the given traversals.
- The steps are as follows:
    - The last element of the postorder traversal is the root of the tree.
    - Find the index of the root in the inorder traversal to determine the left and right subtrees.
    - Recursively construct the left subtree using the elements before the root in the inorder traversal and the corresponding elements in the postorder traversal.
    - Recursively construct the right subtree using the elements after the root in the inorder traversal and the corresponding elements in the postorder traversal.
```go
func buildTree(inorder, postorder []int) *TreeNode {
	if len(inorder) == 0 || len(postorder) == 0 {
		return nil 
	}

	postLen := len(postorder)

	root := &TreeNode{Val: postorder[postLen-1]}

	inorderIndex := 0
	for idx, val := range inorder {
		if val == root.Val {
			inorderIndex = idx
			break
		}
	}

	root.Left = buildTree(inorder[:inorderIndex], postorder[:inorderIndex])
	root.Right = buildTree(inorder[inorderIndex+1:], postorder[inorderIndex:postLen-1])

	return root
}
```

## Complexity Analysis
- Time Complexity: O(n), where n is the number of nodes in the tree. We visit each node exactly once.
- Space Complexity: O(n), where n is the number of nodes in the tree. This is due to the space used for the recursive stack and the storage of the tree nodes.
- In the worst case, the tree can be skewed, leading to O(n) space complexity. In the best case, the tree is balanced, leading to O(log n) space complexity.

