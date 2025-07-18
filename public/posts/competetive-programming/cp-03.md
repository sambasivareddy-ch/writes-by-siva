---
title: "Stack - Linear Data Structure"
description: "Explaination about linear-data structure stack"
author: "Siva"
date: 2025-06-21
tags: ["Competitive Programming", "Stack"]
canonical_url: "https://bysiva.vercel.app/blog/cp-03"
---

# Stack - Linear Data Structure
Stack is a linear data structure which follows the principle of **Last In First Out (LIFO)** principle. That is the element which is inserted last will be the element removed first from the stack.

## Basic Operations
- **Push**: Add an element to the top of the stack
- **Pop**: Remove an element from the top of the stack
- **IsEmpty**: Check if the stack is empty or not
- **IsFull**: Check if the stack is full or not
- **Peek**: Returns the top of the element without removing it.

![Stack DSA](/blog_assets/stack.png)

## Working of Stack Data Structure
The operation works as follow:
- A pointer called **TOP** is used to keep the track of top element of the stack.
- When initializing the stack, we set TOP to -1. So that we can whether stack is empty or not by comparing TOP == -1.
- On pushing an element, we increase the value of **TOP** by 1 and stores the new element at the new position pointed by the TOP.
- On popping an element, we return the element pointed by TOP and reduce the **TOP** value by 1.
- Before pushing, we check whether the stack is full or not.
- Before popping, we check whether the stack is empty or not.

## Implementation
```go
type Stack[T any] struct {
	elements []T
	top	  int
	capacity int
}

func NewStack[T any](capacity int) *Stack[T] {
	return &Stack[T]{
		elements: make([]T, capacity),
		top:      -1,
		capacity: capacity,
	}
}

func (s *Stack[T]) Push(value T) {
	if s.top >= s.capacity-1 {
		fmt.Println("Stack overflow")
		return
	}

	s.top += 1
	s.elements[s.top] = value
	fmt.Println("Pushed:", value)
}

func (s *Stack[T]) Pop() (T, bool) {
	if s.top < 0 {
		fmt.Println("Stack underflow")
		var zeroValue T
		return zeroValue, false
	}

	value := s.elements[s.top]
	s.top -= 1
	return value, true
}

func (s *Stack[T]) Peek() (T, bool) {
	if s.top < 0 {
		fmt.Println("Stack is empty")
		var zeroValue T
		return zeroValue, false
	}

	return s.elements[s.top], true
}

func (s *Stack[T]) IsEmpty() bool {
	return s.top < 0
}

func (s *Stack[T]) Size() int {
	return s.top + 1
}

func (s *Stack[T]) IsFull() bool {
	return s.top >= s.capacity-1
}
```
- **Time Complexity**: O(n)
- **Space Complexity**: O(n)

## Applications of Stack
- Reverse a word
- Balanced Parenthesis
- In compilers like Postfix, Prefix Expressions
