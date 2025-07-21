---
title: "Merge Overlapping Subintervals"
description: "Given a set of intervals, merge the overlapping intervals"
author: "Siva"
date: 2025-07-21
tags: ["Competitive Programming", "Array"]
canonical_url: "https://bysiva.vercel.app/blog/merge-overlap-intervals"
---

# Merge Overlapping Subintervals
## Problem Statement
Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals in the input.

### Example
```text
    Input:  [[1,5],[3,6],[8,10],[15,18]]
    Output: [[1,6],[8,10],[15,18]]

    [1,5] & [3,6] are overlapping intervals
```
- Overlap Condition: Two intervals [a, b] and [c, d] overlap if and only if c <= b. In that case, the merged interval is [a, max(b, d)].

## Approach (Sort & Compare)
1. Sort the Intervals
    - Sort the intervals based on their start times.
    - This ensures that any overlapping intervals will be next to each other in the list.
2. Initialize a Result list
    - Start with the first interval in the sorted list and add it to the result.
3. Traverse the Sorted Intervals: Start with the first interval in the sorted list and add it to the result.
    - Compare current with the last interval in the result (let’s call it last).
    - If they overlap (i.e., current.start <= last.end):
        - Merge them by setting last.end = max(last.end, current.end).
    - If don't overlap
        - Append current to the result list.
4. Return the result

## Code
```python
def mergeOverlappedIntervals(arr):
    arr.sort()
    result = []
    result.append(arr[0])

    n = len(arr)
    for i in range(1, n):
        curr = arr[i]
        last = result[-1]
        if last[1] >= curr[0]:
            if last[1] < curr[1]:
                result[-1][1] = curr[1]
        else:
            result.append(curr)

    return result 
```

## Complexity Analysis
- **Time Complexity** - O(n logn)
- **Space Complexity** - O(n) - If no overlapping intervals are there