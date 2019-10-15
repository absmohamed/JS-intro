# React Components

As we learned in the last lesson, React uses a component-based architecture for application development. There are two kinds of components, functional and class components.

In this lesson we'll learn more about components. We will look at how we can pass information to components, and some ways we can style them.

We will also look at modularising our code.

- [React Components](#react-components)
  - [References](#references)
  - [More about components](#more-about-components)
  - [Component input is called props](#component-input-is-called-props)
    - [create-react-app friendly](#create-react-app-friendly)
  - [Passing a name to the Greeting component](#passing-a-name-to-the-greeting-component)
  - [Styling components](#styling-components)
  - [Making it modular](#making-it-modular)
  - [Components should be in their own files](#components-should-be-in-their-own-files)
  - [Creating component files](#creating-component-files)
    - [The default export](#the-default-export)

## References

- [Components and props](https://reactjs.org/docs/components-and-props.html)
- [React.Component](https://reactjs.org/docs/react-component.html)
- [React file structure](https://reactjs.org/docs/faq-structure.html)

## More about components

Components are the building blocks of a React application that take some set of inputs and _return JSX elements_ that are rendered on the screen. JSX elements can represent DOM tags (such as `div`, `p`, `h1`, etc.), or they can represent user-defined components. We saw examples of both in the last lesson, where we first created JSX that represented an h1:

```javascript
ReactDOM.render(<h1>Hi there, my good friend!</h1>, document.getElementById("root"))
```

and then created JSX that represented our functional component called **Greeting**:

```javascript
const Greeting = () => {
	return <h1>Hi there, my good friend!</h1>
}

ReactDOM.render(<Greeting />, document.getElementById("root"))
```

## Component input is called props

Conceptually, components are like functions (and in the case of functional components they **are** functions!). They take input (JSX attributes) and return an output based on that input.

With React components, inputs are handled in a particular way. Namely, input to a component is passed as a single object argument called **props** (short for properties). When a component is invoked, any information we want to pass to the component is passed through this single props argument. Let's look at an example. First we'll create another app - practice is good!

### create-react-app friendly

We'll create an app called **friendly**. This app will mainly just be a teaching tool to learn some new component concepts. It will start by displaying a greeting, like we did with our example in the last lesson.

```javascript
create-react-app friendly
```

Now, just as we did in the last lesson, remove everything in the src directory and create an empty index.js. In this file, import the two packages we need - what were those again?

index.js

```javascript
import React from "react"
import ReactDOM from "react-dom"
```

Now add three things - see if you can remember how:

1. a functional component called Greeting that returns an h1 element that says 'Hi friend!'
2. a functional component called App that returns a Greeting element
3. a call to ReactDOM.render to render App to the document root

Now start your application and make sure you see Hi friend! as an h1 in the browser. Do you remember how to start the app?

index.js

```javascript
const Greeting = () => {
	return <h1>Hi friend!</h1>
}

const App = () => {
	return <Greeting />
}

ReactDOM.render(<App />, document.getElementById("root"))
```

```
cd friendly
yarn start
```

## Passing a name to the Greeting component

If we want to pass a name to our Greeting component, we can pass it from App, like this:

```javascript
const App = () => {
	return <Greeting friend="Janel" />
}
```

For any argument we want to pass, we give it an attribute label (like _friend_), and use the '=' to assign a value to that attribute (or property).

To make use of the property in Greeting, we need to:

- specify a **props** parameter to the Greeting component
- refer to **props.friend** where we want to reference that property

```javascript
const Greeting = props => {
	return <h1>Hi {props.friend}!</h1>
}
```

It's that simple! You can see how this makes it easy to pass any number of arguments to our components. If we want to specify multiple properties, we just include all of them when we invoke our component. They should be space-separated.

For example, if we want to pass a link to an image to display with our friendly greeting, we could do it like this:

```javascript
const App = () => {
	return <Greeting friend="Janel" image="https://cataas.com/cat/cute" />
}
```

And we could add that image to the JSX element that is returned from Greeting by referring to `{props.image}`. Remember that if we want to return more than one element, we need to put them inside of a single parent element. This one way we could do it:

```javascript
const Greeting = props => {
	return (
		<div>
			<img src={props.image} />
			<h1>Hi {props.friend}!</h1>
		</div>
	)
}
```

## Styling components

As we learned with HTML, CSS, and vanilla JS, there are so many ways to specify styling for our DOM elements. We can put it in the HTML, in CSS, or add it from JavaScript. It is typical for React components to have styling closely coupled with a component. There are a number of ways to do this, and we'll look at some more ways in a later lesson, but no matter how we do it, the best practice is to specify the style in the component.

A common way to style a component is to define inline CSS in a variable in our component. Let's add some style to the Greeting component. For now we'll just add a little padding and change the font-family:

```javascript
const Greeting = props => {
	const styles = {
		padding: "1em",
		fontFamily: "Arial, Helvetica, sans-serif"
	}
	return (
		<div style={styles}>
			<img src={props.image} />
			<h1>Hi {props.friend}!</h1>
		</div>
	)
}
```

Things to notice:

1. We use JSX to refer to our `styles` variable in the `div`
2. JSX inline styling must be specified as an object with key-value pairs
3. Hyphens cannot be used in CSS style element names - instead use camelCase (_fontFamily_)

If we want to specify one or more classes for an element, we can do that too. The only difference is the identifier is **className** instead of **class**, to avoid any clashing issues with the class keyword in javascript.

For example, if we wanted to add a class "container" to our `div`:

```javascript
const Greeting = props => {
	const divStyle = {
		padding: "1em",
		fontFamily: "Arial, Helvetica, sans-serif"
	}
	return (
		<div style={divStyle} className="container">
			<img src={props.image} />
			<h1>Hi {props.friend}!</h1>
		</div>
	)
}
```

We can specify styling with a separate .css file, but let's try it a different way - using a .js file. This approach could be useful if we want to share styles across multiple components.

Create a file called `styles.js`. In it, put the `divStyle` we just defined in Greeting:

styles.js

```javascript
const divStyle = {
	padding: "1em",
	fontFamily: "Arial, Helvetica, sans-serif"
}
```

We will want to import this into our index.js, but in order to do that, we know from experience that we need to export it from styles.js. We have done this with node, and the concept is the same, although the syntax is slightly different for ES6 imports (rather than CommonJS imports used for Node). We could just put the keyword `export` in front of the object declaration:

styles.js

```javascript
export const divStyle = {
	padding: "1em",
	fontFamily: "Arial, Helvetica, sans-serif"
}
```

Then to use it in index.js, we just have to import it and use it:

index.js

```javascript
import React from "react"
import ReactDOM from "react-dom"
import { divStyle } from "./styles"

const Greeting = props => {
	return (
		<div style={divStyle} className="container">
			<img src={props.image} />
			<h1>Hi {props.friend}!</h1>
		</div>
	)
}
. . .

```

Verify this works.

But, assuming we may want to define other styles, and that we might define an object for each set of styles we want to define, this could get messy. Imagine having to export and import each style object individually. Instead we can create an exported object called `styles` that will specify each individual style we define here:

styles.js

```javascript
const divStyle = {
	padding: "1em",
	fontFamily: "Arial, Helvetica, sans-serif"
}

export const styles = {
	divStyle: divStyle
}
```

And import that:

```javascript
import React from "react"
import ReactDOM from "react-dom"
import { styles } from "./styles"

const Greeting = props => {
	return (
		<div style={styles.divStyle} className="container">
			<img src={props.image} />
			<h1>Hi {props.friend}!</h1>
		</div>
	)
}
. . .

```

We'll just have to use dot notation to reference the particular style object we want in our JSX.

This would allow us, for example, to include a style object for img:

styles.js

```javascript
const divStyle = {
	padding: "1em",
	fontFamily: "Arial, Helvetica, sans-serif"
}

const imgStyle = {
	height: "200px"
}

export const styles = {
	divStyle: divStyle,
	imgStyle: imgStyle
}
```

And use it without changing our import statement in index.js:

index.js

```javascript
import React from "react"
import ReactDOM from "react-dom"
import { styles } from "./styles"

const Greeting = props => {
	return (
		<div style={styles.divStyle} className="container">
			<img style={styles.imgStyle} src={props.image} />
			<h1>Hi {props.friend}!</h1>
		</div>
	)
}
. . .

```

## Making it modular

We can't just keep dumping code into our index.js. It would make our code impossible to understand, maintain, enhance, or test. Let's start pulling code out of our index.js, and from now on, create separate files where it makes sense.

## Components should be in their own files

Components should be modular and reusable (when it makes sense). You should lean towards smaller components with clear separation of concerns. This makes code easier to understand, maintain, reuse, and test.

With this in mind, it makes sense to have components in their own files. Some will even put components in their own sub-directories, but this doesn't always make sense. [Reactjs.org has some good advice on choosing a file structure for your app](https://reactjs.org/docs/faq-structure.html), but mostly they advise that you don't over-worry about it. You can always change it as your project grows, and you get a feel for what makes the most sense.

We're going to go with a popular practice of putting components in a components subdirectory.

## Creating component files

Create a **Greeting.js** and **App.js** in a subdirectory under `src` called **components**. Copy the styles.js into the components subdirectory too, since it is styles used by our components:

L components
L App.js
L Greeting.js
L styles.js
L index.js

In Greeting.js, move the function from index.js and put it here. You will also have to include the React import (anywhere that you use JSX you need the React import - so pretty much in every javascript file in your React project). You will also import the 'styles':

Greeting.js

```javascript
import React from "react"
import { styles } from "./styles"

const Greeting = props => {
	return (
		<div style={styles.divStyle} className="container">
			<img style={styles.imgStyle} src={props.image} />
			<h1>Hi {props.friend}!</h1>
		</div>
	)
}
```

In App.js, move the App function from index.js:

App.js

```javascript
import React from "react"

const App = () => {
	return <Greeting friend="Janel" image="https://cataas.com/cat/cute" />
}
```

What else will we have to do?

Now that we have these functions in separate files, we're going to have to do some exporting/importing.

### The default export

In this case, it is appropriate to use `export default` in Greeting.js and App.js. This allows us to import without destructuring, which is appropriate for importing a component. Do do this, we just add `export default Greeting` to Greeting.js, and `export default App` to App.js.

We will have to import Greeting in App.js (where it is used), and we'll have to import App in index.js (where it is used). We should have files that look like this:

Greeting.js

```javascript
import React from "react"
import { styles } from "./styles"

const Greeting = props => {
	return (
		<div style={styles.divStyle} className="container">
			<img style={styles.imgStyle} src={props.image} />
			<h1>Hi {props.friend}!</h1>
		</div>
	)
}

export default Greeting
```

App.js

```javascript
import React from "react"
import Greeting from "./Greeting"

const App = () => {
	return <Greeting friend="Janel" image="https://cataas.com/cat/cute" />
}

export default App
```

index.js

```javascript
import React from "react"
import ReactDOM from "react-dom"
import App from "./components/App"

ReactDOM.render(<App />, document.getElementById("root"))
```

Make these changes and verify everything still works.
