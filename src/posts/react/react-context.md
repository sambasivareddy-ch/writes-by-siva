---
title: "React Context"
description: "Learn about the React Context and it's Usage"
author: "Siva"
date: 2025-07-06
tags: ["React", "Frontend", "Context"]
canonical_url: "https://bysiva.vercel.app/blog/react-context"
---

# React Context

## 📚 Table of Contents
- [Introduction](#introduction)
    - [Example](#example)
- [Context an Alternative to Props](#context-an-alternative-to-props)
    - [Examples](#example-1)
    - [Step 1: Create a Context](#step-1-create-the-context)
    - [Step 2: Provide the Context](#step-2-provide-the-context)
    - [Step 3: Consume the Context](#step-3-consume-the-context)
        - [Step 3.a: Consume the Context in Another Component](#step-3a-consume-the-context-in-another-component)
- [Use Cases](#use-cases-of-context)

## Introduction
Usually in React, if you want to pass the information between the components like between the Parent & Children we uses the **Props**

### Example
```jsx
const Heading = ({level, children}) => {
    const Tag = `h${level}`
    return (
        <Tag>
            {children}
        <Tag>
    )
};

const Page = () => {
    return (
        <div>
            <Heading level={1}>Heading 1</Heading>
            <Heading level={2}>Heading 2</Heading>
        </div>
    )
}
```
- From the above you can see, from the Page component to render different Heading (h1, h2) we are passing **level** prop to Heading Component.
- This will works when the information is passed between Parent & 1/2 immediate Children, but it becomes inconvienent when the same information has to pass to so many Components in the React Virtual Dom and may cause [**Props Drilling**](https://react.dev/learn/sharing-state-between-components)
- Context helps in these cases without you have to pass the Props to the every component that requires the information.


## Context: An alternative to Props
React Context lets the Parent Pass the information to entire tree rendered below it without even have to pass the props. 

Here one example would be switching between the Themes in an application. That is when a Theme switched we have pass that information to every component in that application and passing that information as a prop is hard job to do.
### Example 1
```jsx
const Header = ({theme, setTheme}) => {
    const changeHandler = () => {
        setTheme(!theme);
    }

    return (
        <div style = {{ backgroundColor: theme ? '#fff': '#000'}}>
            Header Content
            <button onClick = {changeHandler}>
                Change Theme
            </button>
        </div>
    )
}

const SomeSection = ({theme}) => {
    return (
        <div style = {{ backgroundColor: theme ? '#fff': '#000'}}>
            Content Here
        </div>
    )
}

const Page = ({theme, setTheme}) => {
    return (
        <div>
            <Header theme={theme} setTheme={setTheme}/>
            <SomeSection theme={theme}/>
            {/** And Many Component like above here **/}
        </div>
    )
}

const App = () => {
    const [theme, setTheme] = useState(true);

    return (
        <div>
            <Page theme={theme} setTheme={setTheme}/>
            {/** And Many Pages like above here **/}
        </div>
    )
}
```
- From the above example, we can see that from App component we are passing the theme value to Page and from the Page to Header & SomeSection.
- And when the state changed, again we have to pass the same information to everything rendered under the App component.
- Wouldn't it will nice if we just provide the information to App, so that every child of it can use it without explicitly passing Props to them. That's where the **Context** comes to existence.

### Step 1: Create the Context
First, you need to create the context using `createContext()`.
- The only argument to createContext is **default value** which can be any value like primitive data or event objects.
- Export the context so that you can import the context and use on the components.
```javascript
// ThemeContext.js
import { createContext } from 'react';

const ThemeContext = createContext();

export default ThemeContext;
```

### Step 2: Provide the Context
Now provide the context to the component so that entire child of that component can see the same theme.
```jsx
import ThemeContext from './ThemeContext';

const App = () => {
    const [theme, setTheme] = useState(true);

    return (
        <div>
            <ThemeContext.Provider value={{theme, setTheme}}>
                <Page/>
            </ThemeContext.Provider>
        </div>
    )
}
```

### Step 3: Consume the Context
Now we can access the **_theme_** & **_setTheme_** without even passing them to Page component and from Page components to it's children.
```jsx
import { useContext } from 'react';
import ThemeContext from './ThemeContext';

const Header = () => {
    const { theme, setTheme } = useContext(ThemeContext);

    const toggleThemeHandler = () => {
        setTheme(!theme);
    }

    return (
        <div style = {{ backgroundColor: theme ? '#fff': '#000'}}>
            Header Content
            <button onClick = {toggleThemeHandler}>
                Change Theme
            </button>
        </div>
    )
}
```

### Step 3.a: Consume the Context in another Component
```jsx
import { useContext } from 'react';
import ThemeContext from './ThemeContext';

const SomeSection = () => {
    const { theme } = useContext(ThemeContext);

    return (
        <div style = {{ backgroundColor: theme ? '#fff': '#000'}}>
            Content Here
        </div>
    )
}
```

## Use cases of Context
- **Theming**: If the App provides the toggling between the dark & light themes. You can provide the context at the top of the app and use elsewhere in the entire application.
- **Current account**: When the application allows to maintain multiple accounts. You can use the context to store the userId and make relavent operations in entire component tree.
- **Manage State**: Helps to maintain certain information through out the application and so on..