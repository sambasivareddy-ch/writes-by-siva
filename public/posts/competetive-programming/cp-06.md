---
title: "Binary Tree Traversals"
description: "Explaination about different types of Traversals"
author: "Siva"
date: 2025-07-01
tags: ["Competitive Programming", "Tree"]
canonical_url: "https://bysiva.vercel.app/blog/cp-04"
---

# Binary Tree Traversals
This post is about the different methods of traversing a binary tree. We will cover the following traversal methods:
- Pre-order Traversal
- In-order Traversal
- Post-order Traversal

```go
type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}
```

### Example Binary Tree
```tree
        1
       / \
      2   3
     / \   \
    4   5   6
       / \
      7   8

- Pre-order Traversal: [1, 2, 4, 5, 7, 8, 3, 6]
- In-order Traversal: [4, 2, 7, 5, 8, 1, 3, 6]
- Post-order Traversal: [4, 7, 8, 5, 2, 6, 3, 1]

```

## Pre-order Traversal
In pre-order traversal, we visit the root node first, then recursively traverse the left subtree, followed by the right subtree. The order of operations is:
1. Visit the root node
2. Traverse the left subtree
3. Traverse the right subtree
### Example
```go
// Time Complexity: O(n), where n is the number of nodes in the tree.
func preorderTraversal(root *TreeNode) {
    if root == nil {
        return 
    }

    fmt.Print(root.Val, " ")
    preorderTraversal(root.Left)
    preorderTraversal(root.Right)
}
```

## In-order Traversal
In in-order traversal, we recursively traverse the left subtree first, then visit the root node, and finally traverse the right subtree. The order of operations is:
1. Traverse the left subtree
2. Visit the root node
3. Traverse the right subtree
### Example
```go
// Time Complexity: O(n), where n is the number of nodes in the tree.
func inorderTraversal(root *TreeNode) {
    if root == nil {
        return 
    }

    inorderTraversal(root.Left)
    fmt.Print(root.Val, " ")
    inorderTraversal(root.Right)
}
```

## Post-order Traversal
In post-order traversal, we recursively traverse the left subtree first, then the right subtree, and finally visit the root node. The order of operations is:
1. Traverse the left subtree
2. Traverse the right subtree
3. Visit the root node
### Example
```go
// Time Complexity: O(n), where n is the number of nodes in the tree.
func postorderTraversal(root *TreeNode) {
    if root == nil {
        return 
    }

    postorderTraversal(root.Left)
    postorderTraversal(root.Right)
    fmt.Print(root.Val, " ")
}
```

## Summary
In this post, we have covered the three main methods of traversing a binary tree: pre-order, in-order, and post-order. Each method has its own order of operations and is useful for different scenarios. The time complexity for all three traversal methods is O(n), where n is the number of nodes in the tree. Understanding these traversal methods is essential for working with binary trees effectively.