---
title: "React useMemo hook"
description: "Learn about the React Hook useMemo"
author: "Siva"
date: 2025-07-10
tags: ["React", "Frontend", "useMemo"]
canonical_url: "https://bysiva.vercel.app/blog/react-memo"
---
# useMemo

## 📚 Table of Contents
- [useMemo](#usememo)
  - [📚 Table of Contents](#-table-of-contents)
  - [Introduction](#introduction)
    - [Example](#example)
  - [Memo](#memo)
    - [Example-1](#example-1)
      - [Before Memoization (Inefficient Re-render)](#before-memoization-inefficient-re-render)
      - [After Memoization (Efficient Re-render)](#after-memoization-efficient-re-render)
  - [Use Cases](#use-cases)

## Introduction
**useMemo** is a React Hook that lets you "cache" the result of a calculation between the re-renders.
- React’s rendering behavior is powerful, but sometimes you might notice unnecessary recalculations during component re-renders. This is where React's useMemo hook comes in handy.
```
    const cachedValue = useMemo(funcForCalculation, dependencies)
```
- `funcForCalculation`: The function calculating the value that you want to **Cache**. It should be pure, should take no arguments, and should return a value of any type. React will calls your function for first render. On next renders, function will call only when on of the dependecies changes else return the old cached value.
- `dependencies`: An array/list of all reactive values used inside **funcForCalculation**. And it must of constant number of items.

### Example
```
    import React, { useMemo } from 'react';

    const calculateValue = (val) => {
        let total = 0;
        for (let i = 0; i < 1e7; i++) {
            total += val;
        }
        return total;
    }

    const ExpensiveComponent = ({ val }) => {
        const result = useMemo(() => {
            return calculateValue(val)
        }, [val]);

        return <div>Result: ${ result }</div>
    }
```
- In the above example, we are passing `calculateValue` function to useMemo with dependencies [val]. 
- Consider initially we rendered above component as below:
```
    const App = () => {
        return <ExpensiveComponent val={10}>
    }
```
- useMemo will call `calculateValue` by passing the value **10** and cache the results, which is **10*1e7**. Now if suppose for the next render I pass the val as **10**, then **calculateValue** won't be called again while rendering for the second time.

## Memo
In react by default if a component re-renders it will recursively re-renders it's child componenets as well. If the number of children components are less, it won't show much effect. But if you experienced the slowness while re-rendering the children and you know that the **props** passed to the child components won't change, then actual you can cache that children component as well by wrapping the component around `memo()`.
### Example-1 
#### Before Memoization (Inefficient Re-render)
```
import React, { useState } from 'react';

function ChildComponent({ name }) {
  console.log('Child rendered');
  return <div>Child Component - Name: {name}</div>;
}

function ParentComponent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <ChildComponent name="Siva" />
    </div>
  );
}

export default ParentComponent;
```
- In the above example, ChildComponent will re-renders everytime when Increment button clicked. But actually we are not changing prop to `ChildComponent` at all, so re-rendering everytime count increases is not ideal. We can avoid that by using `memo`.
#### After Memoization (Efficient Re-render)
```
import React, { useState, memo } from 'react';

const ChildComponent = memo(function ChildComponent({ name }) {
  console.log('Child rendered');
  return <div>Child Component - Name: {name}</div>;
});

function ParentComponent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <ChildComponent name="Siva" />
    </div>
  );
}

export default ParentComponent;
```
- Clicking the button increments the counter, but the ChildComponent no longer re-renders because its props haven't changed.

## Use Cases
Add these in Use Cases for more practical appeal:
- Filtering and sorting large datasets
- Computing derived values from props/state
- Avoiding unnecessary function/object recreations in dependency arrays