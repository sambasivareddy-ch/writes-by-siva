---
title: "Subset sum equals to target"
description: "Given an array arr of n integers and an integer target, determine if there is a subset of the given array with a sum equal to the given target."
author: "Siva"
date: 2025-09-20
tags: ["Competitive Programming", "Recursion"]
canonical_url: "https://bysiva.vercel.app/blog/subset-sum-equal-to-target"
---

# Subset sum equals to target
## Problem Statement
Given an array `arr` of `n` integers and an integer `target`, determine if **there is a subset of the given array with a sum equal to the given target**.

## Approach
We solve this using recursion with choices:  
At every index idx in the array, we have two options:  
- Include the current element (arr[idx]) in our running total.
- Exclude the current element and move to the next.  

We keep exploring both possibilities until:
- The running total matches target → return `True` (we found a valid subset).
- We reach the end of the array without finding a match → return `False`.

## Code
```python
def isSubsetEquals(arr, idx, total, target):
    if total == target:
        return True
    if idx == len(arr):
        return False
    
    include = isSubsetEquals(arr, idx+1, total+arr[idx], target)
    exclude = isSubsetEquals(arr, idx+1, total, target)
    return include or exclude

def containsSubset(arr, target):
   return isSubsetEquals(arr, 0, 0, target)
```

## Complexities
- **Time Complexity** - O(2^n)
- **Space Complexity** - O(n)
