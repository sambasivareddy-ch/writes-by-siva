---
title: "React useEffect hook"
description: "Learn about the React Hook useEffect"
author: "Siva"
date: 2025-08-08
tags: ["React", "Frontend", "useEffect"]
canonical_url: "https://bysiva.vercel.app/blog/react-use-effect"
---
# React's useEffect Hook

- [React's useEffect Hook](#reacts-useeffect-hook)
  - [Introduction](#introduction)
  - [Definition](#definition)
  - [Why useEffect Was Introduced](#why-useeffect-was-introduced)
    - [useEffect was introduced in React 16.8 to](#useeffect-was-introduced-in-react-168-to)
  - [Points to be remembered](#points-to-be-remembered)
  - [Example](#example)
  - [Common Issue](#common-issue)

## Introduction
**useEffect** is a react hook that lets you synchronize a component with an external system like e.g., browser APIs, subscriptions, or network requests etc.

## Definition
```
    import { useEffect } from 'react';

    useEffect(setup, dependencies?)
```
- **_setup_** : Setup is a function that holds your **effects** logic. Setup function may also optionally returns a `cleanup` function.
  - When your component is added to the **DOM** with changed dependecies, React will run the **cleanup** function. 
  - Cleanup function will run with the old values and runs our setup function with the **new values**.
- **_dependencies_** : The list of all reactive values referenced inside of the **setup** code.
  - The number of items passed to the dependencies must be **constant**.
- useEffect returns `undefined`.
  
## Why useEffect Was Introduced
Before React Hooks, class components were the only way to manage side effects using lifecycle methods:
- componentDidMount → Run code after initial render
- componentDidUpdate → Run code after updates
- componentWillUnmount → Clean up before removal
This led to:
- Scattered logic: Related code was split across multiple lifecycle methods.
- Repetitive patterns: Mount/update/unmount logic often repeated.
- Complex state management: Sharing logic between components required higher-order components or render props.
### useEffect was introduced in React 16.8 to
- Combine mount, update, and unmount behavior into one place.
- Work seamlessly with function components (no need for classes).
- Make it easier to reuse side-effect logic across components through custom hooks.

## Points to be remembered
- useEffect should call at the **top level** of the React component.
- If you are not trying to synchronize with some external system, you probably don't need to use effect.
- When **_Strict Mode_ is ON**, react will run `setup + cleanup` cycle one more time in Development Mode for safety checks.
- If any function or object are passed as part of dependencies, then there is a risk of re-run effect more often then needed.
- It only run on the _CLIENT_, they don't run during serves rendering.

## Example
```
    import { useState, useEffect } from 'react';
    import { createConnection } from './chat.js';

    function ChatRoom({ roomId }) {
        const [serverUrl, setServerUrl] = useState('https://localhost:1234');

        useEffect(() => {
            const connection = createConnection(serverUrl, roomId);
            connection.connect();
            return () => {
                connection.disconnect();
            };
        }, [serverUrl, roomId]);
        // ...

        // Component Logic
    }
```
- Our useEffect will run setup function for **initial rendering** and every time when any one of the dependency values **serverUrl, roomId** changes. 
- Before running the setup function, useEffect will run the cleanup function and helps us to disconnect to the previous connection which we took with the old values.

## Common Issue 
A common pitfall is an effect running infinitely. This happens when:
- The effect updates state inside it.
- That state change triggers a re-render.
- The re-render changes one of the effect’s dependencies, causing it to run again.
**Fix** : Ensure that state changes inside useEffect are either conditionally triggered or excluded from the dependency array (if safe to do so).



