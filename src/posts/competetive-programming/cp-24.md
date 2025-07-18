---
title: "Valid Anagram"
description: "Given a list of strings, find the longest common prefix among them"
author: "Siva"
date: 2025-07-14
tags: ["Competitive Programming", "Strings"]
canonical_url: "https://bysiva.vercel.app/blog/cp-23"
---

# Valid Anagram
## Problem Statement
Given two strings s and t, return true if t is an anagram of s, and false otherwise.

### What is Anagram
An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

### Example
```text
    str1 = 'anagram' str2 = 'naagram' --> Valid
    str1 = 'cat'     str2 = 'tac'     --> Valid
    str1 = 'abc'     str2 = 'def'     --> Not Valid
```

## Approach (HashMap)
- At first, check whether the lengths of both strings are equal or not. If not, they both are not anagrams.
- The second step is to, for each string create a hash which holds
    - Distinct char in the string
    - And count of each char
- Then while iterating any of the hash map, check whether that key exists in another hash map. If not both are not anagrams.
    - If keys, then frequency of that key should match in each hash map. Then only both the strings will become anagrams.

```python
def isValidAnagram(str1, str2):
    if len(str1) != len(str2):
        return False 
    
    dict1 = {}
    dict2 = {}
    for i in str1:
        if i not in dict1:
            dict1[i] = 1
        else:
            dict1[i] += 1
    
    for j in str2:
        if j not in dict2:
            dict2[j] = 1
        else:
            dict2[j] += 1
    
    for key, val in dict1.items():
        if key not in dict2 or dict2[key] != val:
            return False
    
    return True 
```

## Complexity Analysis
- **Time Complexity**: O(n)
- **Space Complexity**: O(n) - If string contains all unique characters