---
title: "Find the intersection point of Y LL"
description: "Given the heads of two linked-lists, find the intersection of two ll."
author: "Siva"
date: 2025-07-11
tags: ["Competitive Programming", "Linked List"]
canonical_url: "https://bysiva.vercel.app/blog/cp-20"
---
# Find the intersection point of Y Linkedlist
## Problem Statement
Given the heads of two linked lists A and B, containing positive integers. Find the node at which the two linked lists intersect. If they do intersect, return the node at which the intersection begins, otherwise return null.

### LinkedList Node
```python
class Node:
	def __init__(self, key):
		self.val = val
    self.next = None
```

### Example
```tree

    1 ---> 2 ---> 3 ---
                        \
    8 ---> 9 ------------> 4 ---> 5

    Intersected at: 4

    1 ---> 2 ---> 3 ---> 4 ---> 5
    6 ---> 7 ---> 8 ---> 9

    Intersected at: None
```

## Approach
- Calculate the lengths of each linked lists.
- Move the pointer of the longer linkedlist by the difference between the lengths
    - That is consider lenA is length of first linkedlist
    - lenB is length of second linkedlist
    - if lenA > lenB, move head of the first linkedlist to the (lenA - lenB)
    - if lenB > lenA, move head of the second linkedlist to (lenB - lenA)
- Then traverse both lists together until the nodes match by reference.
    - If there is no intersection, then either of the linkedlists will reach to end

```python
def findIntersectionOfTwoLL(headA, headB):
    def getLength(head):
        count = 0
        while head:
            count += 1
            head = head.next
        return count 
    
    lenA, lenB = getLength(headA), getLength(headB)

    if lenA > lenB:
        diff = lenA - lenB 
        while diff:
            diff -= 1
            headA = headA.next
    else:
        diff = lenB - lenA 
        while diff:
            diff -= 1
            headB = headB.next 
    
    while headA and headB:
        if headA == headB:
            return headA
        headA = headA.next 
        headB = headB.next 
    
    return None 
```

## Complexity Analysis
- **Time Complexity**: O(n)
- **Space Complexity**: O(1)