---
title: "Polyfills"
description: "Learn about using Polyfills using Javascript"
author: "Siva"
date: 2025-07-26
tags: ["Javascript"]
canonical_url: "https://bysiva.vercel.app/blog/polyfills"
---
# Polyfills
## Definition/Purpose
Polyfills in JavaScript are blocks of code that implement functionality not supported in older browsers. Basically it enables the developers to work on latest Javascript/API features in older browsers which do not support them.
- In other words, it is fallback or backup code that mimics missing (e.g., ES6+) functionality, enabling cross-browser compatibility.

## Example
### ES6 Map 
- In ES6, in general we call `map` over an array and we pass a function to process over each element of the array on which the map is called and it returns a new array with mapped element.
#### Example-1
```javascript
    const arr = [1,2,3,4,5,6]
    const doubledArray = arr.map((ele) => {
        return ele*2
    }) // doubledArray = [2,4,6,8,10,12]
```
- In the above function we are just multiplying the each element by 2 and returning it.
- Similar functionality may not support in older browers like IE11. 

### ES6 Map Polyfill
- In those cases, Polyfills let you write your own map logic which runs in unsupported browsers.
- Before writing our own map logic, we must know the Map functionality
    - Map() takes a function as argument, and passes the element and index to the function passed.
    - 1st Argument - element
    - 2nd Argument - element's index
#### Example-2
```javascript
    Array.prototype.compatibleMap = function(func) {
        let new_array = [];
        for (let idx = 0; idx < this.length; idx++) {
            let result = func(this[idx], idx);
            new_array.push(result);
        }
        return new_array
    }
```
> We named it compatibleMap instead of map to avoid overwriting the native method if it exists.
- As explained earlier, we are taking a function **(func)** as an argument to our compatibleMap. 
- Here `this` refers to the array on which the map is called, for example **arr** in example-1 will be referred by `this`
- Then for each element in the array we are calling `func` by passing the element and element's index.
- Once processing is done, we are returning new array like in case of `standard ES6 Map`.
#### Example-3
```javascript
    const arr = [1,2,3,4,5,6]
    const doubledArray = arr.compatibleMap((ele) => {
        return ele*2
    }) // doubledArray = [2,4,6,8,10,12]
```

## Complete Example
```javascript
if (!Array.prototype.map) {
    Array.prototype.map = function(func) {
        let new_array = [];
        for (let idx = 0; idx < this.length; idx++) {
            let result = func(this[idx], idx);
            new_array.push(result);
        }
        return new_array;
    }
}
```
- This checks whether map exists. If it doesn't (as in older browsers), we define our own.
- In real-world projects, developers often rely on libraries like core-js or services like polyfill.io to handle polyfilling automatically during build or load time, rather than writing manual polyfills for each feature.
