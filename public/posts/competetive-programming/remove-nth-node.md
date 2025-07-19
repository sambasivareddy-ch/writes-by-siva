---
title: "Remove Nth node from the back of the LL"
description: "Given a linked-list, reverse that linked-list."
author: "Siva"
date: 2025-07-10
tags: ["Competitive Programming", "Linked List", "Two Pointers"]
canonical_url: "https://bysiva.vercel.app/blog/cp-20"
---
# Remove Nth node from the back of the LL
## Problem Statement
Given the head of a singly linked list and an integer n. Remove the nth node from the back of the linked List and return the head of the modified list. The value of n will always be less than or equal to the number of nodes in the linked list.


### LinkedList Node
```python
class Node:
	def __init__(self, key):
		self.val = val
    self.next = None
```

### Example
```tree

    1 --> 2 --> 3 --> 4 --> 5 & n = 2
    Output: 1 --> 2 --> 3 --> 5

    1 --> 2 --> 3 --> 4 --> 5 & n = 4
    Output: 1 --> 3 --> 4 --> 5

    1 --> 2 --> 3 --> 4 --> 5 & n = 6
    Output: 1 --> 2 --> 3 --> 4 --> 5

```

## Approach (Two Pointers)
- The idea is to move one pointer (first) n + 1 steps ahead so that when it reaches the end, the other pointer (second) is just before the node to delete.
- A dummy node is created and points to the head. This helps handle edge cases (like deleting the head) more cleanly, without special conditions.
- Two pointers: first and second, both start at the dummy.
- We move the first pointer n + 1 steps ahead. This ensures that the second pointer will land just before the node we want to delete.
- If first becomes None before completing the loop, n is too large — we return the original list unchanged.
- Now we move both pointers forward simultaneously. When first reaches the end (None), second is just before the target node.
- Skip over the target node by adjusting the next pointer of second, so that we will delete the n-th element from the end.
### Code
```python
def deleteNthNodeFromEnd(head, n):
    dummy = ListNode(0)
    dummy.next = head
    first = dummy
    second = dummy

    # Move first n+1 steps ahead so second is just before the node to delete
    for _ in range(n + 1):
        if not first:
            return head  # n is greater than the length of the list
        first = first.next

    # Move both pointers until first reaches the end
    while first:
        first = first.next
        second = second.next

    # Delete the nth node from the end
    second.next = second.next.next

    return dummy.next
```

## Complexity Analysis
- **Time Complexity** - O(n)
- **Space Complexity** - O(1)