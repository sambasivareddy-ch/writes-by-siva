---
title: "Maximum Sub-array Sum"
description: "Given an array of integers, find the contiguous subarray which has the largest sum and return its sum."
author: "Siva"
date: 2025-06-19
tags: ["Competitive Programming", "Dynamic Programming"]
canonical_url: "https://bysiva.vercel.app/blog/cp-01"
---

# Maximum Sub-array Sum 
## Problem Statement
Given an array of integers, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.

## Example
```python
Input: [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum = 6.
```

**Link to problem statement**: [LeetCode - Maximum Subarray](https://leetcode.com/problems/maximum-subarray/)

## Approach - Brute Force
- This approach involves checking all possible subarrays and calculating their sums to find the maximum sum.
- The time complexity is O(n^3) since we check all pairs of indices and calculating the sum each time between the indices arr[i..j].
- **Time Complexity**: O(n^3)
- **Space Complexity**: O(1) 
```javascript
const maxSubArraySum = (arr) => {
    const n = arr.length,
          maxSum = 0;
    
    for (let i = 0; i < n; i++) {
        for (let j = i; j < n; j++) {
            let currentSum = 0;

            // Calculate the sum of the subarray arr[i..j]
            for (let k = i; k <= j; k++) {
                currentSum += arr[k];
            }

            // Update maxSum if currentSum is greater
            maxSum = Math.max(maxSum, currentSum);  
        })
    })

    return maxSum;
}
```

## Approach - Brute Force Optimized
- This approach optimizes the brute force method by calculating the sum of the subarray in a single loop.
- Instead of recalculating the sum for each subarray, we maintain a running sum and update it as we expand the subarray.
- The time complexity is O(n^2) since we still check all pairs of indices, but we reduce the sum calculation to O(1) for each subarray.
- **Time Complexity**: O(n^2)
- **Space Complexity**: O(1)
```javascript
const maxSubArraySum = (arr) => {
    const n = arr.length;
    let maxSum = 0;

    for (let i = 0; i < n; i++) {
        let currentSum = 0;

        // Calculate the sum of the subarray arr[i..j]
        for (let j = i; j < n; j++) {
            currentSum += arr[j];

            // Update maxSum if currentSum is greater
            maxSum = Math.max(maxSum, currentSum);
        }
    }

    return maxSum;
}
```

## Approach - Kadane's Algorithm
- Kadane's Algorithm is an efficient way to solve the maximum subarray sum problem in linear time.
- It works by maintaining a running sum of the current subarray and updating the maximum sum found so far.
- If the running sum becomes negative, it is reset to zero, as a negative sum would not contribute positively to any future subarray.
- **Time Complexity**: O(n)
- **Space Complexity**: O(1)
```javascript
const maxSubArraySum = (arr) => {
    let maxSumSoFar = 0;
    let maxEndingHere = 0;
    const n = arr.length;
    
    for (let i = 0; i < n; i++) {
        maxEndingHere += arr[i];

        if (maxEndingHere < 0){
            maxEndingHere = 0; // Start searching for a new subarray
        })

        maxSumSoFar = Math.max(maxSumSoFar, maxEndingHere);
    })

    return maxSumSoFar;
}
```

## Conclusion
Kadane's Algorithm is the most efficient solution for the maximum subarray sum problem, achieving a time complexity of O(n) and a space complexity of O(1). The brute force methods, while straightforward, are not practical for large arrays due to their higher time complexities. The optimized brute force method improves performance but still does not match the efficiency of Kadane's Algorithm.