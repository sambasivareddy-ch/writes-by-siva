---
title: "Find the Starting point of a cycle in Linkedlist"
description: "Given a linked-list, find the starting point of a linked-list else Null"
author: "Siva"
date: 2025-07-12
tags: ["Competitive Programming", "Linked List"]
canonical_url: "https://bysiva.vercel.app/blog/cp-22"
---

# Find the Starting point of a Cycle in a LinkedList
## Problem Statement
Given the head of a singly linked list. Return the starting point of the cycle in the linked-list else Null

### LinkedList Node
```python
class Node:
	def __init__(self, key):
		self.val = val
    self.next = None
```

### Example
```tree
    1 --> 2 --> 3 --> None => Null

    1 --> 2 --> 3 --> 4 --> 5  => Return Node (3)
                |           |
                |           |
                 <--- <-----
```

## Approach
- We are going to use two pointers method:
    - **Slow** - Moves one step at a time
    - **Fast** - Moves two step at a time
- If there’s a cycle, the fast pointer will eventually “lap” the slow pointer, i.e., they will meet inside the loop.
    - Return the either fast or slow which is the starting point.

```python
def findTheStartingPointInLL(head):
    slow = head 
    fast = head 

    while fast and fast.next:
        slow = slow.next 
        fast = fast.next.next 
        if slow == fast:
            return slow 
    
    return None 
```

## Complexity Analysis
- **Time Complexity** - O(n)
- **Space Complexity** - O(1)