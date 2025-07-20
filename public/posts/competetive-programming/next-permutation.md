---
title: "Next Permutation"
description: "Given an array, find the next lexicographical largest permuation"
author: "Siva"
date: 2025-07-20
tags: ["Competitive Programming", "Array"]
canonical_url: "https://bysiva.vercel.app/blog/next-permutation"
---

# Next Permutation
## Problem Statement
Given an array 'arr', find the next lexicographical largest permutation within that array of integers

### Example
```text
    Example-1:
    nums = [1,2,3]
    Output = [1,3,2]

    Possible permutations of [1,2,3] => [1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]
    Assume a dictionary in that 123 will come first following by 132, 213, 231, 312, 321

    Example-2:
    nums = [3,2,1]
    Ouput = [1,2,3]
    Same as above, it will again starts at 123
```

## Approach
- Find the first decreasing element from the end (called the pivot):
    - Traverse from the end of the array and find the first index i such that nums[i] < nums[i + 1].
- If such a pivot doesn't exist (i.e., the array is non-increasing):
    - Reverse the whole array to get the lowest permutation.
- Otherwise:
    - From the end of the array, find the first element j that is greater than nums[i].
    - Swap nums[i] and nums[j].
- Reverse the subarray nums[i + 1:] (to get the next smallest lexicographic order).

## Code
```python
def nextPermutation(arr):
    i = len(arr) - 2
    while i >= 0 and arr[i] >= arr[i+1]:
        i -= 1
    
    if i >= 0:
        j = len(arr) - 1
        while j >= 0 and arr[j] <= arr[i]:
            j -= 1
        arr[i], arr[j] = arr[j], arr[i]
    
    left, right = i + 1, len(arr) - 1
    while left < right:
        arr[left], arr[right] = arr[right], arr[left]
        left += 1
        right -= 1
    
    return arr 
```

## Complexity Analysis
- **Time Complexity** - O(n)
- **Space Complexity** - O(1)