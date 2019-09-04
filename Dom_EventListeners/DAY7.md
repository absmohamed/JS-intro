# Event Listeners

Event listeners are a Web API that allows us to listen for events on DOM nodes. There are many different kinds of events that we can listen for.

Here is the [MDN event reference documentation](https://developer.mozilla.org/en-US/docs/Web/Events)

To add an event listener simply call **addEventListener()** on the DOM node which you would like it added to.

```javascript
let myButton = document.querySelector("input[type=submit]")

myButton.addEventListener("click", function(event) {
	console.log(event)
})
```

You will notice that we try to run the listener but at the same time the browser has some default behaviour for an input of type submit inside of form.

_What is the default behaviour?_
The default behaviour is to submit the form to the server, and includes a page reload. Sometimes this isn't what we want.

To disable the browsers default behaviour inside of the listener we can call **event.preventDefault()**. This works because our custom listeners will run before any default browser listener.

```javascript
//Refresh the web page to remove the first listener

let myButton = document.querySelector("input[type=submit]")

myButton.addEventListener("click", function(event) {
	event.preventDefault()
	console.log(event)
})
```

Now when we click the button our event listener runs and prevents the default behaviour of the browser allowing us to log to the console the event and not having the form actually submit. And there we go we have created our first event listener!

Another good thing to now is that we can access the DOM node the event listener was fired on by using the target property on our event.

```javascript
//Refresh the web page to remove the first listener

let myButton = document.querySelector("input[type=submit]")

myButton.addEventListener("click", function(event) {
	event.preventDefault()
	console.log(event.target)
})
```

And because this brings back a DOM node we have all the same functionality as we had before to access and manipulate it’s properties.

```javascript
//Refresh the web page to remove the first listener

let myButton = document.querySelector("input[type=submit]")

myButton.addEventListener("click", function(event) {
	event.preventDefault()
	event.target.value += "!"
})
```

We can also use this to access the the DOM node unless we are using a fat arrow function in the listener (fat arrow functions have a different scope for the this keyword).
