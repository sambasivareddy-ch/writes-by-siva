---
title: "Variables"
description: "Learn about Variables in JavaScript"
author: "Siva"
date: 2025-09-09
tags: ["JavaScript"]
canonical_url: "https://bysiva.vercel.app/blog/variables"
---
# Variables
In most of our modern applications built on the top of javascript needs to store some kind of information. That information can be:
1. User's wishlist products in an E-commerce application.
2. Storing user balance amount in their bank account
**Variables** can be used to store that information

## Definition
A Variable is a **_named storage_** to store the data in the Javascript. We can use these variables to store any type of information an application needed.
### Let
One way to create a variable in Javascript by using `let` keyword.
Let's declare a variable called "message" using let. And initialize a value to it.
```javascript
    let message;
    message = "Hello Everyone!!";
    console.log(message); // Prints 'Hello Everyone!!' in the console
```
Or we can combine the both declaration and initialization in the same line like below:
```javascript
    let message = "Hello Everyone!!";
    console.log(message); // Prints 'Hello Everyone!!' in the console
```
We can define multiple variables in the same line like
```javascript
    let message = "Hello Everyone!!", number = 1024, year = 2000;
```
- But it is recommended to declare a new variable in a new line for Readability Purposes.

### Var
In older javascript script, **_var_** keyword is used to declare a variable like **let**.
#### Example:
```javascript
    var message = "Hello Everyone!!";
    console.log(message); // Hello Everyone!!
```
- Var is almost same to Let in terms of functionality with little difference, we will discuss about it later.

### Const
In certain cases, we **don't want the value in a variable to change**, in these cases we can use **_const_** keyword to declare the constant variables.
#### Example:
```javascript
    const MY_BIRTH_DAY = "24/10/2000"
    console.log(MY_BIRTH_DAY); // 24/10/2000

    MY_BIRTH_DAY = "24/10/2001" // Throws an Error (can't reassign the constant!)
```

## Variable Naming
There are two limitations on variable names in JavaScript:
- The name must contain only **letters**, **digits**, or the symbols **$** and **_**.
- The first character **must not be a digit**.
### Example
Valid variable names
```javascript
    let userName;
    let FirstName;
    let $lastName; 
    // etc..
```

## Let v/s Var
The biggest differences between let and var are scope and hoisting.
### Scope
- **let is block-scoped**: accessible only inside the {} block where it is declared.
- **var is function-scoped**: accessible throughout the function where it is declared.
#### Example
```javascript
    if (true) {
        var x = 10; 
        let y = 20;
    }
    console.log(x); // ✅ 10 (var is function-scoped)
    console.log(y); // ❌ Error: y is not defined (let is block-scoped)
```
### Hoisting
- Variables declared with var are **hoisted and initialized with undefined**.
  - Hoisting means the declaration will be moved to the top of the code.
- Variables declared with let are also hoisted but remain in the **Temporal Dead Zone (TDZ) until declared**.
#### Example
```javascript
    console.log(a); // undefined (var is hoisted)
    var a = 5;

    console.log(b); // ❌ Error: Cannot access 'b' before initialization
    let b = 10;
```