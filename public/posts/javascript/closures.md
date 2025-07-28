---
title: "Closures"
description: "Learn about Closures in JavaScript"
author: "Siva"
date: 2025-07-28
tags: ["JavaScript"]
canonical_url: "https://bysiva.vercel.app/blog/closures"
---
# Closures

## 📑 Table of Contents
1. [Introduction](#introduction)  
2. [Example](#example)  
3. [Internals](#internals)
4. [Closure in Action](#closure-environment-in-action)
5. [Use cases](#use-cases)

## Introduction
In simple terms, a **Closure** is a function that *remembers* the variables from its outer lexical environment—even after the outer function has finished executing.
- This means a closure can access variables from the scope where it was originally defined.

## Example
```javascript
function makeCounter() {
    let count = 0;
    // Closure
    return function () {
        return count++;
    };
}

const counter = makeCounter();
console.log(counter()); // 0
console.log(counter()); // 1
```
- Here, makeCounter() returns a function that forms a closure.
- That returned function retains access to the variable count, which was defined in the outer function scope.

## Internals
## Lexical Environment
You might wonder—how can a closure access variables from its outer scope even after the outer function is done?. The answer lies in Lexical Environment.
### How lexical environment works
In JavaScript, each:
- Function call (function () { ... }),
- Block scope ({ ... }), and
- Script/module,
has an internally associated object called the **Lexical Environment**.
- Lexical Environment contains:
  - Environment Record – holds local variables/functions for that block or function.
  - Outer Reference – points to the outer lexical environment.
### Variable Declaration
```javascript
let phrase = "Hello";
```
Lexical Environment:
```javascript
{
    EnvironmentRecord: {
        phrase: "Hello"
    },
    Outer: null // Global environment has no outer
}
```
### Function Declaration
```javascript
let phrase = "Hello";
function say(name) {
    console.log(`${phrase}, ${name}`)
}
say("John")
```
During the call to say("John"), a new lexical environment is created like this:
```javascript
{
    EnvironmentRecord: {
        name: "John"
    },
    Outer: {
        EnvironmentRecord: {
            phrase: "Hello",
            say: function
        },
        Outer: null
    }
}
```
- When a function is called, JavaScript creates a new Lexical Environment for it.
- If a variable isn't found in the current scope, JS looks outward through the chain of outer environments.

## Closure Environment in Action
Let’s revisit the makeCounter closure example:
```javascript
function makeCounter() {
    let count = 0;
    return function () {
        return count++;
    };
}
```
When the closure is created, here's how the lexical environments are chained:
```javascript
{
    EnvironmentRecord: { /* closure function has no local vars yet */ },
    Outer: {
        EnvironmentRecord: {
            count: 0
        },
        Outer: {
            EnvironmentRecord: {
                makeCounter: function
            },
            Outer: null
        }
    }
}
```
- The closure retains access to the count variable through this lexical chain.
- Even after makeCounter() is finished, the inner function still references count from its preserved outer environment.

## Use cases
Closures are powerful and enable many features like:
- Data encapsulation
- Function factories
- Maintaining private state
