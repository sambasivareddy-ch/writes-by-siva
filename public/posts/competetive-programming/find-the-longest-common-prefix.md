---
title: "Find the Longest Common Prefix"
description: "Given a list of strings, find the longest common prefix among them"
author: "Siva"
date: 2025-07-13
tags: ["Competitive Programming", "Strings"]
canonical_url: "https://bysiva.vercel.app/blog/cp-23"
---

# Longest Common Prefix
## Problem Statement
Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string "".

### Example
```text
    ['flower', 'flow']
    --> Longest Common Prefix = 'flow'

    ['flower', 'flow', 'fly']
    --> Longest Common Prefix = 'fl'

    ['dog', 'cat', 'monkey']
    --> Longest Common Prefix = ''
```

## Approach
- Here, at first we will find the length of shortest string in the given list. Because length of the longest prefix will not exceed the length of shortest string in worst case the shortest string will becomes the longest common prefix.
- Once we find the smallest string length, we iterate through this length and compare the each index of all strings until the miss match occurs.

```go
func getLongestCommonPrefix(strs []string) string {
	if len(strs) == 0 {
		return ""
	}

	least_length := len(strs[0])
	for _, str := range strs {
		if len(str) < least_length {
			least_length = len(str)
		}
	}

	n := len(strs)
	common_prefix := ""
	for i := 0; i < least_length; i++ {
		curr_char := strs[0][i]
		for j := 0; j < n; j++ {
			if strs[j][i] != curr_char {
				return common_prefix
			}
		}
		common_prefix += string(curr_char)
	}

	return common_prefix
}
```

## Complexity Analysis
- **Time Complexity**: O(m*n)
    - m = length of the shortest string
    - n = length of the list
- **Space Complexity**: O(m)