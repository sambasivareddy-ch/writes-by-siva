---
title: "Min Stack"
description: "Design and Implement a min stack"
author: "Siva"
date: 2025-06-23
tags: ["Competitive Programming", "Stack"]
canonical_url: "https://bysiva.vercel.app/blog/cp-05"
---

# Min Stack
Design and Implement a min stack with Space Complexity: O(N) and supports basic stack operations like Push, Pop, Top and getMin
- getMin() - return the minimum number of stack at that particular time.

## Approach - Two element member in stack.

To implement a **Min Stack**, we use a modified stack where each pushed element is an array (or tuple) consisting of two values:
- `[currentValue, currentMin]`
    - `currentValue`: The actual value to be pushed onto the stack.
    - `currentMin`: The minimum value in the stack up to this point.
### Push Operation
- **If the stack is empty**:
    - Push `[value, value]`, since the value is the only element and hence the minimum.
- **If the stack is not empty**:
    - Let `currentMin` be the second value of the top element.
    - If `value <= currentMin`, push `[value, value]`.
    - Else, push `[value, currentMin]`.
This ensures each element in the stack carries the correct minimum value up to that point.
### getMin Operation
- To retrieve the current minimum, return the second value (index `1`) of the top element of the stack.

Link: [Leetcode](https://leetcode.com/problems/min-stack/description/)

```python
class Stack:
    def __init__(self):
        self.stack = []
        self.length = 0
    
    def push(self, val):
        if self.length == 0:
            self.stack.append([val, val])
        else:
            curr = self.stack[-1]
            if curr[1] > val:
                self.stack.append([val, val])
            else:
                self.stack.append([val, curr[1]])
        self.length += 1
    
    def pop(self):
        self.length -= 1
        return self.stack.pop()[0]
    
    def top(self):
        if len(self.stack) == 0:
            print('Stack is Empty')
        return self.stack[-1][0]
    
    def getMin(self):
        if len(self.stack) == 0:
            print('Stack is Empty')
        return self.stack[-1][1]
```
- **Time Complexity**: O(1)
- **Space Complexity**: O(N)