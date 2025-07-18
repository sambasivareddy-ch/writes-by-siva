---
title: "Predecessor and successor of a key in BST"
description: "Find the Predecessor and Successor of a key in BST. If not found return -1"
author: "Siva"
date: 2025-07-08
tags: ["Competitive Programming", "BST"]
canonical_url: "https://bysiva.vercel.app/blog/cp-17"
---

# Predecessor & Successor of a Key in BST
## Problem Statement
Given the BST and a key, find the inorder Predecessor and Successor of the key in the BST. If either of them deosn't exists, return -1 instead.

### Tree Node
```python
class Node:
	def __init__(self, key):
		self.val = key
		self.left = None 
		self.right = None 
```

### Example
```tree
        10
       /  \
      5    30
     / \   /
    1   8 20

Inorder Traversal: 1 5 8 10 20 30

Key = 10
Inorder Predecessor = 8 (the largest value smaller than the key)
Inorder successor = 20 (the smallest value greater than the key)
```

## Definitions
- **Inorder Traversal** - Left -> Root -> Right
- **Inorder Predecessor** - The node with the largest value less than the current node (i.e., the node that comes just before it in the inorder traversal).
- **Inorder Successor** - The node with the smallest value greater than the current node (i.e., the node that comes just after it in the inorder traversal).

## Approach (Optimal)
- Traverse the tree to find out the key
- While searching the key:
    - If key > current.val:
        - Move right (since larger values are on the right).
        - Current node might be the predecessor, so store it. As moved node might not contains the children
    - If key < current.val:
        - Move left (since smaller values are on the left).
        - Current node might be the successor, so store it. As moved node might not contains the children
    - key == current.val:
        - Key found break
- Now once the key found, find the predecessor and successor by traversing the left subtree and right subtree of the key node
- If the key found and has left subtree:
    - Its predecessor is the rightmost node in its left subtree (maximum value in the left subtree).
- If the key found and has right subtree:
    - Its successor is the leftmost node in its right subtree (minimum value in the right subtree).

```python
def findPredecessorSuccessor(root, key):
	predecessor = -1 
	successor = -1 

	# Search the key
	current = root
	while current:
		if key > current.val:
			predecessor = current.val 
			current = current.right 
		elif key < current.val:
			successor = current.val 
			current = current.left 
		else:
			break # Key Found 
	
	if not current:
		return predecessor, successor
	
	if current.left:
		temp = current.left 
		while temp.right:
			temp = temp.right 
		predecessor = temp.val 
	
	if current.right:
		temp = current.right 
		while temp.left:
			temp = temp.left 
		successor = temp.val 

	return predecessor, successor
```

## Complexity Analysis
- **Time Complexity**: O(h)
- **Space Complexity**: O(1)