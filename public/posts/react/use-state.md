---
title: "React useState hook"
description: "Learn about the React Hook useState"
author: "Siva"
date: 2025-07-10
tags: ["React", "Frontend", "useState"]
canonical_url: "https://bysiva.vercel.app/blog/react-01"
---
# React Hook: useState

## 📚 Table of Contents
- [React Hook: useState](#react-hook-usestate)
  - [📚 Table of Contents](#-table-of-contents)
  - [Introduction](#introduction)
  - [Definition](#definition)
    - [Parameter](#parameter)
    - [Return](#return)
    - [Example](#example)
  - [More about Set Function](#more-about-set-function)
  - [Examples](#examples)
    - [Example - 1 (Primitive Type)](#example---1-primitive-type)
    - [Example - 2 (Passing function to set function)](#example---2-passing-function-to-set-function)
    - [Example - 3 (Objects: Array)](#example---3-objects-array)
  - [Things to Remember](#things-to-remember)


## Introduction
useState() is a react hook that lets you add a state variable to your component, _allows a component to remember it's state/values across the multiple re-renders._

## Definition
```
    import { useState } from 'react';

    const [state, setState] = useState(initialState);
```
- Here, We have used array destructuring to get the state and state set function (setState)
### Parameter
- initialState: It is the value you want the state to hold initially when the state defined.
    - The type of the value can be of any type like Primitive types (Number, Boolean, String, Bigint, Null, Undefined), Objects or even functions.
    - If the initialState is function, it will be lazily initialized (executed only on the first render).
### Return
useState() hook returns two values i.e current state (state) and a setter function setState.
- state: The current state of the hook. It will match with `initialState` during the first render of the component.
- setState: The **set** function that lets you update the state to a different value and trigger a **re-render** of the component.
    - The set function does not mutate the current state; it replaces it.

> Note: Since it’s a hook, useState must be called at the top level of a React function component (or a custom hook), not inside loops, conditions, or nested functions.
### Example
```
    const MyComponent = (props) => {
        const [state, setState] = useState(0);

        //.. More code can follow now
    }
```

> Note: In strict mode, react will call your initalizer function twice in order to help you find accidental impurities. This is development only behaviour and won't run twice in production mode

## More about Set Function
- The set function returned by useState() lets you update the state to a different value and trigger a re-render.
- One can pass the next state directly or a function that calculates it from the previous state. If the value pass to set function, it should take previous state as an argument.
- This function returns Nothing it just update the **state**.

## Examples
### Example - 1 (Primitive Type)
```
    const Counter = (props) => {
        const [count, setCount] = useState(0);

        const buttonClickHandler = () => {
            setCount(count + 1);
        }

        return (
            <div>
                <p>Button clicked: {count} times</p>
                <button onClick={buttonClickHandler}>Button</button>
            </div>
        )
    }
```
- Initially when the Counter component renders, the value of count will be set to "0" as we pass 0 as initialValue to useState.
- Then everytime you clicked the button, it will call buttonClickHandler where we are using set function which increases the count by 1. And also triggers the re-render, then count will become 1. (It won't again set to 0, it will be set for initial rendering of a component).
- That's how everytime the button clicked, count increases by 1. And we can see in the browser like "Button clicked: 2 times"

### Example - 2 (Passing function to set function)
```
    const Counter = (props) => {
        const [count, setCount] = useState(0);

        const buttonClickHandler = () => {
            setCount(
                (prevState) => prevState + 1
            );
        }

        return (
            <div>
                <p>Button clicked: {count} times</p>
                <button onClick={buttonClickHandler}>Button</button>
            </div>
        )
    }
```
- Initially when the Counter component renders, the value of count will be set to "0" as we pass 0 as initialValue to useState.
- Then everytime you clicked the button, everything works as in the previous example. But here we passing function as a parameter to set function which takes prevState as argument. prevState contains the value equal to 'count'.
- This is preferred when the new state depends on the previous state — especially helpful in asynchronous updates or batched updates.

### Example - 3 (Objects: Array)
```
    const Tasks = (props) => {
        const [todos, setTodos] = useState([]);
        const [todoTitle, setTodoTitle] = useState("");

        const addTodoHandler = () => {
            setTodos([
                ...todos,
                todoTitle
            ])
        }

        return (
            <div>
                <div>
                    <input type="text" value={todoTitle} onChange={(e) => setTodoTitle(e.target.value)}>
                    <button onClick = {addTodoHandler}>Add Task</button>
                </div>
                <div>
                    <p>My Tasks</p>
                    <ol>
                        {todos.map((todo) => {
                            return <li key={Math.random()}>{todo}</li>
                        })}
                    </ol>
                </div>
            </div>
        )
    }
```
- In the above example we have used **Array Spread Operator** and then added the new to-do. Because we must be keep the older todos as well in this case. If we have used simple setTodos([todoTitle]) which will replace the existing state with new state and we will loose the old to-do information which is not an expected behaviour.
- Like this we can do for the objects as well.
- In the example I have added only "Add function", we can also add modify & delete using map() & filter() respectively and the update the state with the results from the map & filter functions.

## Things to Remember
- State value will be initialized only once, that is when the component renders for the first time.
- Initial value can be of any type be it primitive data type, objects or functions
- Calling setState with a value equal to the current state (using Object.is) will not trigger a re-render.
- React batches the "State Updates". It updates the screen after all the set functions to prevent multiple re-renders.
- In strict mode, react will call the initializer function twice to make sure that the function won't cause any errors.