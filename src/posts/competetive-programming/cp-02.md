---
title: "Next Greater Element"
description: "Given an array of integers, find the next greater element for each element in the array in the order of their appearance."
author: "Siva"
date: 2025-06-20
tags: ["Competitive Programming", "Stack"]
canonical_url: "https://bysiva.vercel.app/blog/cp-02"
---

# Next Greater Element

## Problem Statement
Given an array of integers, find the next greater element for each element in the array in the order of their appearance.

## Example
```python
Input: [4, 5, 2, 10, 8]
Output: [5, 10, 10, -1, -1]
Explanation:
- For 4, the next greater element is 5.
- For 5, the next greater element is 10.
- For 2, the next greater element is 10.
- For 10, there is no greater element, so it is -1.
- For 8, there is no greater element, so it is -1.
```

**Link to problem statement**: [LeetCode - Next Greater Element](https://leetcode.com/problems/next-greater-element-i/)

## Approach - Using Stack
- This approach uses a stack to keep track of the indices of the elements for which we haven't found the next greater element yet.
- We iterate through the array, and for each element, we check if it is greater than the element at the index stored at the top of the stack.
- If it is, we pop the index from the stack and set the next greater element for that index to the current element.
- If the stack is empty, it means there is no greater element for that index, so we set it to -1.
- **Time Complexity**: O(n)
- **Space Complexity**: O(n)
```go
func nextGreaterElement(nums []int) []int {
	n := len(nums)
	result := make([]int, n)
	stack := []int{}

	for i := 0; i < n; i++ {
		// Pop elements from the stack until the current element is <= the top of the stack
		for len(stack) > 0 && nums[i] > nums[stack[len(stack)-1]] {
			index := stack[len(stack)-1]
			result[index] = nums[i]
			stack = stack[:len(stack)-1]
		}
		// Push the current index onto the stack
		stack = append(stack, i)
	}

	// For remaining elements in the stack, set result to -1
	for _, index := range stack {
		result[index] = -1
	}

	return result
}
```