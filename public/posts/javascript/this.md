---
title: "This & Bind Functions"
description: "Learn about this keyword and call, apply & bind functions"
author: "Siva"
date: 2025-07-25
tags: ["Javascript"]
canonical_url: "https://bysiva.vercel.app/blog/this"
---

# This & Bind Functions

## 📚 Table of Contents
- [This \& Bind Functions](#this--bind-functions)
  - [📚 Table of Contents](#-table-of-contents)
  - [This](#this)
    - [Example](#example)
  - [Call, Apply \& Bind](#call-apply--bind)
    - [.call()](#call)
      - [Example](#example-1)
    - [.apply()](#apply)
      - [Example](#example-2)
    - [.bind()](#bind)
      - [Example](#example-3)

## This
- The **`this`** keyword in JavaScript represents the execution context of a function.
- It determines which object is "currently calling" the function or method.

### Example
```
    const user = {
        name: 'Siva',
        greet: function() {
            return `Hi, ${this.name}`;
        }
    }

    console.log(user.greet()); // Hi, Siva
```
- Here, **'this'** in greet function refers to the object `user` where it is defined. Using this we can access all the properties declared as part of user object.

## Call, Apply & Bind
These are the key tools for controlling **`this`** in javascript, that is with these functions you can tell the javascript where to refer when **'this'** is used.
### .call()
- call() is a function with a specific 'this' values and arguments are passed one-by-one.
```
    .call(thisArg, arg1, arg2, ....);
```
#### Example
```
    function greet(greeting, punctuation) {
        console.log(`${greeting}, ${this.name} ${punctuation}`)
    }

    const person = {
        name: 'Siva',
    }

    greet.call(person, 'Hello', '!'); //Hello, Siva!
```
- call() will call the greet function by associating **user** object to 'this', and we can use 'this' to refer any property of **user** object.

### .apply()
- Same as .call(), but arguments are passed as an array/list.
```
    .apply(thisArg, [arg1, arg2, ...]);
```
#### Example
```
    function greet(greeting, punctuation) {
        console.log(`${greeting}, ${this.name} ${punctuation}`)
    }

    const person = {
        name: 'Siva',
    }

    greet.apply(person, ['Hello', '!']); //Hello, Siva!
```

### .bind()
- Returns a new function with a bound this value and optional arguments, without invoking it immediately unlike .call() and .apply() which invokes immediately.
#### Example
```
    function greet(greeting, punctuation) {
        console.log(`${greeting}, ${this.name} ${punctuation}`)
    }

    const person = {
        name: 'Siva',
    }

    const newGreet = greet.bind(person, 'Hello', '!');
    newGreet(); // Hello, Siva!
```