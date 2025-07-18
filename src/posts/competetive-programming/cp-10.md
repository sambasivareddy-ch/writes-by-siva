---
title: "Level-Order Traversals"
description: "Given the root of a binary tree, return its level order traversal as a list of lists."
author: "Siva"
date: 2025-0703
tags: ["Competitive Programming", "Tree"]
canonical_url: "https://bysiva.vercel.app/blog/cp-10"
---

# Level-Order Traversal
## Problem Statement
Given the root of a binary tree, return its level order traversal as a list of lists.

### Example
```tree
        1
       / \
      2   3
     / \   \
    4   5   6
       / \
      7   8

- Level Order Traversal: [[1], [2, 3], [4, 5, 6], [7, 8]]
```

## Approach
- We can use a queue to perform a level-order traversal of the binary tree.
- We will maintain a queue to keep track of nodes at each level.
- For each node, we will add its value to the current level's list and enqueue its left and right children (if they exist).
- We will continue this process until we have processed all nodes in the tree.
```go
func levelOrder(root *TreeNode, result *[][]int, level int) {
	if root == nil {
		return 
	}

	if len(*result) == level {
		*result = append(*result, []int{})
	}

	(*result)[level] = append((*result)[level], root.Val)

	levelOrder(root.Left, result, level+1)
	levelOrder(root.Right, result, level+1)
}
```

## Complexity Analysis
- Time Complexity: O(n), where n is the number of nodes in the tree. We visit each node exactly once.
- Space Complexity: O(n), where n is the number of nodes in the tree. This is due to the space required to store the result and the queue used for traversal.

