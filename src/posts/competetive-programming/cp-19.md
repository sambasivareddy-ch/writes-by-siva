---
title: "Find the Cycle in a LinkedList"
description: "Given a linked-list, find whether the ll contains loop or not."
author: "Siva"
date: 2025-07-09
tags: ["Competitive Programming", "Linked List"]
canonical_url: "https://bysiva.vercel.app/blog/cp-19"
---

# Find the Cycle in a LinkedList
## Problem Statement
Given the head of a singly linked list. Return true if a loop exists in the linked list or return false.

### LinkedList Node
```python
class Node:
	def __init__(self, key):
		self.val = val
    self.next = None
```

### Example
```tree
    1 --> 2 --> 3 --> None => No Cycle

    1 --> 2 --> 3 --> 4 --> 5  => Has Cycle
                |           |
                |           |
                 <--- <-----
```

## Approach
- We are going to use two pointers method:
    - **Slow** - Moves one step at a time
    - **Fast** - Moves two step at a time
- If there’s a cycle, the fast pointer will eventually “lap” the slow pointer, i.e., they will meet inside the loop.

```python
def hasCycle(head):
    if not head:
        return False 
    
    slow = fast = head 
    while fast and fast.next:
        fast = fast.next.next 
        slow = slow.next 

        if fast == slow:
            return True 
    
    return False
```

## Complexity Analysis
- **Time Complexity** - O(n)
- **Space Complexity** - O(1)