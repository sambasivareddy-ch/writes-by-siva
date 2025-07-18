---
title: "React Virtual DOM"
description: "Learn about the React Virtual DOM"
author: "Siva"
date: 2025-07-17
tags: ["React", "Frontend", "DOM"]
canonical_url: "https://bysiva.vercel.app/blog/react-vdom"
---
# React's Virtual DOM

## 📚 Table of Contents
- [Introduction](#introduction)
- [What is DOM?](#what-is-dom)
    - [Example](#example)
- [What is VDOM?](#what-is-vdom)
- [How Virtual DOM works?](#how-virtual-dom-works)
- [Virtual DOM Example](#example-1)
- [Key Benefits](#key-benefits-of-vdom)

## Introduction
The **Virtual DOM**(VDOM) is a concept where an virtual representation of a UI is kept in memory and synced with the Real DOM when the updates required.

## What is DOM?
- DOM stands for **Document Object Model**.
- The DOM is a programming interface for a HTML Document which represents the structure of a document as a tree where each node/child represents a HTML Element
### Example
```text
    document
    └── <html>
        ├── <head>
        │     └── <title>
        │           └── "Page Title"
        └── <body>
                └── <div>
                    ├── <h1>
                    │     └── "Heading Text"
                    └── <p>
                            └── "Paragraph text"
```

## What is VDOM?
React's Virtual DOM is an abstract representation of a real DOM which stored in in-memory. That is you can assume this like a intermediary state between the react components and real DOM.
- When a component's state/properties changes, react first updates the virtual DOM, then calculates the minimum number of operations required to actually updating the DOM.
- In simpler terms, a virtual DOM is a copy of Real DOM maintained by React internally.

## How Virtual DOM works?
Usually VDOM works in 3 steps:
1. Rendering the VDOM
2. Diffing the VDOM
3. Updating the Real DOM 

### Rendering the VDOM
When the application/component state changes, react renders/creates a new Virtual DOM representing the updates happened recently in the application state. 
- This tree represents the updated UI

### Diffing the Virtual DOM
In this step, React compares the recently/newly created Virtual DOM tree with the previous one using a process called **Reconciliation**. This process identifies the differences between the two trees. To identify the difference, React uses the **Diffing Algorithm** where it compares each node of both trees to find the changes.

### Updating the Real DOM
- Based on the differences identified, React determines the most efficient way to update the real DOM. **Only the parts of the real DOM that need to be updated are changed, rather than re-rendering the entire UI.** This selective updating is quick and efficient as it not involves re-rendering of entire DOM again

## Example
Let's consider a Simple Component which shows a Hello Message and a description
```javascript
const MyComponent = () => {
    return (
        <div>
            <h1>Hello</h1>
            <p>Welcome to my site.</p>
        </div>
    )
}
```
- Step 1: Initial Rendering
```tree
VDOM (Old)
└── <div>
    ├── <h1>
    │   └── "Hello"
    └── <p>
        └── "Welcome to my site."
```
- Step 2: New Virtual DOM Tree After State Change
Imagine the state changes and the message changes to "Welcome to my updated site."
```tree
VDOM (New)
└── <div>
    ├── <h1>
    │   └── "Hello"
    └── <p>
        └── "Welcome to my updated site."
```
- Step 3: Diffing Algorithm Identifies Changes
```tree
Comparing:
<p> "Welcome to my site."      ⟶     <p> "Welcome to my updated site."

→ Text inside <p> has changed
→ <h1> remains unchanged
```
    - React identifies that <p> content as changed.
    - No need to update <div> & <h1> again
- Step 4: Real DOM Update 
```tree
Real DOM Before
└── <div>
    ├── <h1> Hello </h1>
    └── <p> Welcome to my site. </p>

⟶ Update only <p>:

Real DOM After
└── <div>
    ├── <h1> Hello </h1>
    └── <p> Welcome to my updated site. </p>

```

## Key benefits of VDOM
- **Enhanced Performance**: Manipulating the real DOM is an expensive operation, as each change triggers recalculations, reflows, and repaints in the browser. By limiting direct interaction with the DOM, the Virtual DOM minimizes these costly operations.
- **Declarative Programming**: The Virtual DOM allows developers to write UI components declaratively. Instead of imperatively describing how to update the DOM, developers can focus on what the UI should look like at any given time, and React handles the updates efficiently.
- **Simplified Development**: React’s Virtual DOM abstracts away the complexities of manual DOM manipulation, making it easier for developers to build and maintain complex applications.