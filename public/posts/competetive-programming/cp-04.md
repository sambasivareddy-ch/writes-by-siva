---
title: "Check for Balanced Parenthesis"
description: "Given the string check for the Balanced Parentheses"
author: "Siva"
date: 2025-06-21
tags: ["Competitive Programming", "Stack"]
canonical_url: "https://bysiva.vercel.app/blog/cp-04"
---

# Check for Balanced Parenthesis
**Problem Statement**: Check Balanced Parentheses. Given string str containing just the characters '(', ')', '{', '}', '[' and ']', check if the input string is valid and return true if the string is balanced otherwise return false.

String **str** is valid if the following conditions met:
- Open brackets must be closed by the same type of brackets.
- Opening brackets must be closed in the correct order.

## Example
```
Input = {}[](), Output = True
Input = {({[(]})}, Output = False
```

## Approach - using Stack Data Structure
- Initialize a empty stack.
- Then iterate through the input string, while iterating:
    - Push the bracket into stack if the stack is (, { or [.
    - Pop the top element of the stack if bracket is a closing bracket like ), } or ] and top of the stack is the closing bracket's corresponding open bracket.
    - If the match not found return **False**.
- Once the iteration done, check if stack is empty or not. 
    - If empty, return **True** means the input is valid.
    - Else return **False**
```python
def IsStrValid(string):
    stack = []

    for char in string:
        if char in ['(', '{', '[']:
            stack.append(char)
        elif char == ']' and stack[-1] == '[':
            stack.pop()
        elif char == '}' and stack[-1] == '{':
            stack.pop()
        elif char == ')' and stack[-1] == '(':
            stack.pop()
        else:
            return False 
    
    if len(stack):
        return False
    
    return True 
```

- **Time Complexity**: O(n)
- **Space Complexity**: O(n), if the input contains only open brackets, we store all in the stack.