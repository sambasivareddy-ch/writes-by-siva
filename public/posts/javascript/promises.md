---
title: "Promises, Async/Await"
description: "Learn about Promises and Async/Await in Javascript"
author: "Siva"
date: 2025-07-26
tags: ["Javascript"]
canonical_url: "https://bysiva.vercel.app/blog/promises"
---
# Promises, Async/Await 
## 📑 Table of Contents
- [Promises, Async/Await](#promises-asyncawait)
  - [📑 Table of Contents](#-table-of-contents)
  - [Introduction](#introduction)
    - [Constructor for a Promise Object](#constructor-for-a-promise-object)
    - [Example](#example)
  - [Core States of a Promise](#core-states-of-a-promise)
  - [Consumers: then, catch](#consumers-then-catch)
    - [.then](#then)
      - [Example-1](#example-1)
      - [Example-2](#example-2)
    - [.catch](#catch)
    - [.finally](#finally)
    - [Example-3](#example-3)
  - [Promise Static Methods (used on Promise class)](#promise-static-methods-used-on-promise-class)
    - [Promise.resolve(value)](#promiseresolvevalue)
    - [Promise.reject(error)](#promiserejecterror)
    - [Promise.all(iterable)](#promisealliterable)
    - [Promise.allSettled(iterable)](#promiseallsettlediterable)
    - [Promise.race(iterable)](#promiseraceiterable)
    - [Promise.any(iterable)](#promiseanyiterable)
  - [Async/Await](#asyncawait)
    - [Async Functions](#async-functions)
    - [Await](#await)
    - [Example-4](#example-4)

## Introduction
A Promise is a Javascript object that reprents the **eventaul completion (or rejection)** of an asynchronous operation and its resulting value.
- Handles Asynchronous operations and avoid callback hell.
### Constructor for a Promise Object
```
    let promise = new Promise((resolve, reject) => {
        // Executor Code Here
    })
```
The function passed to the `new Promise` is called **executor**. When **new Promise** is created, the executor runs automatically. It contains the producing code whch eventually produce the result.
- It takes two arguments `resolve` and `reject` are callbacks provided by javascript.
- When executor got the results be soon or late, it should call either of the above callback functions.
    - call `resolve(value)` - if the job is finished successfully, with result 'value'
    - call `reject(error)` - if an error has occurred, error is the error object.
- So to summarize,  the executor runs automatically and attempts to perform a job. It calls resolve if the job done successfully or reject if there was an error.
### Example
```
    const promise = new Promise((resolve, reject) => {
        // Async operation
        setTimeout(() => {
            resolve("Success!");
            // reject("Failed!");
        }, 1000);
    });
```
- Here, setTimeout will executes after 1s and call resolve function with value 'success!' means success. Similarly if an error occurs call 'reject'.
> In case something goes wrong, the executor should call reject. That can be done with any type of argument (just like resolve). But it is recommended to use Error objects (or objects that inherit from Error). Like below:
```
    const promise = new Promise((resolve, reject) => {
        // Async operation
        setTimeout(() => {
            reject(new Error('Something went wrong..'));
        }, 1000);
    });
```

## Core States of a Promise
- **Pending** - Initial State, neither resolved or rejected.
- **FulFilled** - Operation completed successfully.
- **Rejected** - Operation Failed

## Consumers: then, catch
When the executor code in Promise either resolve or rejects, we have to register the consumers like `then` and `catch` to receive the result (if resolved) or error (if rejected) respectively.
### .then
Syntax is:
```
    promise.then(
        (result) => {/* Handle Success */},
        (error) => {/* Handle Error */}
    );
```
- The first argument for the '.then' is a function that runs when the promise is resolved and receives the results
- The second argument is also function but this will run when the promise is rejected and takes error.
#### Example-1
```
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve('done'), 1000);
    })

    promise.then(
        (result) => console.log(result), // Prints 'done'
        (error) => console.log(error), // Won't run
    )
```
Similarly,
#### Example-2
```
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => reject('error'), 1000);
    })

    promise.then(
        (result) => console.log(result), // Won't run
        (error) => console.log(error), // Prints 'error'
    )
```
- Two arguments are mandatory in .then, if you want to concentrate only on success, then we can provide only one function argument to .then like:
```
    promise.then(
        (result) => console.log(result), // Runs only when Promise resolved means succeeded
    )
```

### .catch
- If we are only interested in error/failure, then we can use `.catch(errorFunc)`, like
```
    promise.catch(
        (error) => console.log(error) // Runs when promise is rejected.
    )
```

### .finally
- And there is .finally which runs independent of whether the promise is success or failure.
```
    promise.finally(
        () => console.log('I will run always') // Runs always.
    )
```

### Example-3
```
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Success!");
        }, 1000);
    });

    promise
    .then((result) => console.log(result))
    .catch((error) => console.log(error))
    .finally(() => console.log('Cleanup'))

    // Output: 
    // Success!
    // Cleanup
```

## Promise Static Methods (used on Promise class)
### Promise.resolve(value)
- Returns a promise that is already resolved with a value.
```
    Promise.resolve(5).then(console.log); // 5
```
### Promise.reject(error)
- Returns a promise that is already rejected with an error.
```
    Promise.reject("Error!").catch(console.error); // "Error!"
```
### Promise.all(iterable)
- Waits for all promises to resolve
- If any one of the promises failed, it rejects immediately.
```
    Promise.all([
        Promise.resolve(1),
        Promise.resolve(2),
        Promise.resolve(3)
    ]).then(console.log); // [1, 2, 3]
```
### Promise.allSettled(iterable)
- Waits for all promises to settle (either resolve or reject).
- Returns an array of result objects with status.
```
    Promise.allSettled([
        Promise.resolve("OK"),
        Promise.reject("ERROR"),
    ]).then((result) => console.log(result)) // ['OK', 'ERROR']
```
### Promise.race(iterable)
- Resolves or rejects as soon as one of the promises resolves or rejects.
```
    Promise.race([
        new Promise(res => setTimeout(() => res("First"), 100)),
        new Promise(res => setTimeout(() => res("Second"), 200))
    ])
    .then(console.log); // "First"
```
- Here 'res' refers to 'resolve'.
### Promise.any(iterable)
- Resolves with the first successful promise.
- Ignores rejections unless all fail, then throws **AggregateError**.
```
    Promise.any([
        Promise.reject("fail"),
        Promise.resolve("success"),
        Promise.reject("fail again")
    ])
    .then((result) => console.log(result)); // "success"
```

## Async/Await
- Async/Await makes asynchronous code look synchronous.
### Async Functions
- We can make the functions async by using the keyword **`async`** before the function definition.
```
    const myFunc = async () => {} // Async function
    // or
    async function myFunc() {
        // Async function
    }
```
- 'async' ensure that the function returns a **promise** and wraps non-promise in it.
### Await
- The keyword `await` makes javascript wait until the promise settles and returns it result either value or error.
- `await` works only inside the async functions.
### Example-4
```
    const func = async () => {
        try {
            let promise = new Promise((resolve, reject) => {
                setTimeout(() => resolve('done'), 1000)
            })

            let result = await promise; // Waits here until the promise resolves

            console.log(result); // done
        } catch(err) {
            console.log(err)
        }
    }
```
- **await** literally suspends the function execution until the promise settles, and then resumes it with the promise result. That doesn’t cost any CPU resources, because the JavaScript engine can do other jobs in the meantime: execute other scripts, handle events, etc.