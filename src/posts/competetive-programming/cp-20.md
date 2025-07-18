---
title: "Reverse a Linkedlist"
description: "Given a linked-list, reverse that linked-list."
author: "Siva"
date: 2025-07-10
tags: ["Competitive Programming", "Linked List", "Two Pointers"]
canonical_url: "https://bysiva.vercel.app/blog/cp-20"
---
# Reverse the Linkedlist
## Problem Statement
Given a Single linked-list, reverse that single linked-list and return it.

### LinkedList Node
```python
class Node:
	def __init__(self, key):
		self.val = val
    self.next = None
```

### Example
```tree
    1 --> 2 --> 3 --> 4 --> 5

    Reversed Linkedlist:
    5 --> 4 --> 3 --> 2 --> 1
```

## Approach (Two Pointers)
- Initialize the two pointers: `curr` and `prev`
    - **prev** will become the head of the reversed linked-list
    - **curr** is used to traverse the linked-list
- Store the next node before breaking the link `(nextNode = curr.next)`.
- Reverse the current node's pointer `(curr.next = prev)`.
- Move the prev pointer to the current node.
- Advance the curr pointer to the next node (nextNode).
- Repeat above 4 steps until the curr becomes Null/None.
- Return `prev` as it will the head of the reversed linked-list

```python
def reverseLL(head):
    curr = head 
    prev = None 

    while curr:
        nextNode = curr.next 
        curr.next = prev 
        prev = curr 
        curr = nextNode
    
    return prev 
```

## Complexity Analysis
- **Time Complexity** - O(n)
    - Traverse through entire the linked-list once.
- **Space Complexity** - O(1)
    - uses a constant amount of extra space like prev, curr and nextNode