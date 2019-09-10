# Agenda and resources

- [Agenda and resources](#agenda-and-resources)
	- [The DOM](#the-dom)
	- [Querying The DOM](#querying-the-dom)
- [Event Listeners](#event-listeners)
	- [Adding an event listener](#adding-an-event-listener)
	- [Event Bubbling](#event-bubbling)
	- [Code examples and challenge](#code-examples-and-challenge)


## The DOM

Before we can talk about event listeners, we need to have a basic understanding of the DOM (Document Object Model).

**Document Object Model**

_How many of you think that the HTML you write is the DOM?_

The HTML you write is not really the DOM but it is parsed by the browser and turned into the DOM.

_Is the code we see in Chrome’s dev tools the DOM?_

Kinda. When your looking at the code in dev tools that looks like HTML it is actually just a visual representation of the DOM.
![DOM tree](dom_tree.gif)

Hmmm but it looks exactly like our HTML and you just said that the HTML we write is not the DOM so what gives?

The HTML we write is used to build the DOM initially but it can change during parsing (like when you forget to put a closing tag and the browser does it for you).

```html
<!DOCTYPE html>
<html>
	<head> </head>
	<body>
		<p>
			My sweet paragraph.
		</p>
	</body>
</html>
```

Another way that the DOM if often manipulated is through JavaScript.

```html
<!DOCTYPE html>
<html>
	<head> </head>
	<body>
		<p id="my-paragraph"></p>

		<script>
			let p = document.querySelector("#my-paragraph")
			p.innerHTML = "Some sweet sweet text"
		</script>
	</body>
</html>
```

The Document Object Model is what is know as a programming interface for HTML. Huh? It basically means that the HTML page can be represented as objects to allow our programming language (in this case JavaScript) to interact with the page.

_View the source of the above code & see how it differs from what we see in dev tools on Chrome._

## Querying The DOM

A very useful concept is being able to manipulate DOM nodes that are loaded in the browser. We can access these nodes by querying the DOM.

If we want to get the first element that matches a given CSS selector we can use **querySelector()**.

```javascript
let firstP = document.querySelector("p")
console.log(firstP)

let form = document.querySelector("#page-form")
console.log(form)
```

If we would like to access all nodes that match a given CSS selector we can use **querySelectorAll()**.

```javascript
let allPs = document.querySelectorAll("p")
console.log(allPs)

let odds = document.querySelectorAll(".odd")
console.log(odds)
```

Did you notice anything odd in the console when we logged out our results from querying?

_What data type was logged?_

A NodeList? What the heck?

Yep when we use querySelectorAll() it is return to us as a NodeList, so we don’t have access to all the usual features of an actual Array. However in ES6 we can easily convert this NodeList to an Array.

```javascript
let allPsArray = Array.from(allPs)
console.log(allPsArray)
```

If we already have a node and need a child from it we can query the node instead of the whole document.

```javascript
let div = document.querySelector("div")
let divPs = div.querySelectorAll("p")
console.log(divPs)
```

The querySelector() and querySelectorAll() methods are relatively new. Before them we had **getElementById(), getElementsByClassName** and **getElementsByTagName()**.

```javascript
let form2 = document.getElementById("page-form")
console.log(form)

let odds2 = document.getElementsByClassName("odd")
console.log(odds2)

let allPs2 = document.getElementsByTagName("p")
console.log(allPs2)
```

You will still see these methods used throughout developers JavaScript code. So why do developers use the methods instead of the newer query selector ones? One big difference is between querySelectorAll() and getElementsByClassName() / getElementsByTagName(). The querySelectorAll() method is not live meaning as we add nodes that match the selector the query will not automatically update to include these new nodes.

```javascript
let li1 = document.querySelectorAll("li")
let li2 = document.getElementsByTagName("li")

console.log(li1)
console.log(li2)

let newLi = document.createElement("li")
newLi.textContent = "new li"
document.querySelector("ul").appendChild(newLi)

console.log(li1)
console.log(li2)
```

As we can see li2 now has 5 elements in it where li1 still has the original 2.

The querySelectorAll() method is actually less performant as well since it immediately gathers a static list of the nodes properties.

# Event Listeners

Event listeners are a Web API that allows us to listen for events on DOM nodes. There are many different kinds of events that we can listen for.

Here is the [MDN event reference documentation](https://developer.mozilla.org/en-US/docs/Web/Events)

## Adding an event listener

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
	event.target.value = "You clicked!"
})
```
## Event Bubbling

Event bubbling is where multiple events are invoked at once on different DOM elements. Here is an example

```javascript
let div = document.querySelector("div");
let p = div.querySelector("p");

div.addEventListener("click", function (event) {
    alert("Div clicked");
});

p.addEventListener("click", function (event) {
    alert("P clicked");
});

//Looking at our DOM how many alerts will fire?
//Which order would they be fired in if there is more than one?
```

When you do click on the paragraph inside of the div we first see “P clicked" but immediately after that we get “Div clicked". This is called event bubbling. The event will always start from the inner most child and bubble up to its parents. We can stop this bubbling effect by using **stopPropagation()**.

```javascript
let div = document.querySelector("div");
let p = div.querySelector("p");

div.addEventListener("click", function (event) {
    alert("Div clicked");
});

p.addEventListener("click", function (event) {
    event.stopPropagation();
    alert("P clicked");
});

//Looking at our DOM how many alerts will fire?
//Which order would they be fired in if there is more than one?
```

There is a 3rd argument for event listeners that takes in an optional config object. Normally this argument defaults to false but it also has 3 other options.

* capture - this event will be triggered before any other element beneath it.
* once - this event will only be triggered once
* passive - any preventDefault() will be ignored

Lets take a look at how the capture option can also can our event listeners order.

```javascript
let div = document.querySelector("div");
let p = div.querySelector("p");

div.addEventListener("click", function (event) {
    alert("Div clicked");
}, { capture: true });

p.addEventListener("click", function (event) {
    alert("P clicked");
});
```

Capture made sure that it was ran first thus removing it from the queue of events needed to run during bubbling.

Lets also take a look at the once config object option.

```javascript
let div = document.querySelector("div");
let p = div.querySelector("p");

div.addEventListener("click", function (event) {
    alert("Div clicked");
}, { once: true });

p.addEventListener("click", function (event) {
    alert("P clicked");
});
```

When we first click on the paragraph everything functions the same but if we click it again we see that the div click event does not run again.

**Removing Event Listeners**

Event listeners can be removed by referencing the DOM node, event type and the callback function to be removed.

We can mimic our once config option behaviour by doing using this concept.

```javascript
let div = document.querySelector("div");
let p = div.querySelector("p");

div.addEventListener("click", function divClick (event) {
    alert("Div clicked");
    div.removeEventListener("click", divClick);
});

p.addEventListener("click", function (event) {
    alert("P clicked");
});
```

We can also remove event listeners from one event by clicking on another.

```javascript
let li1 = document.querySelector("li:nth-child(1)");
let li2 = document.querySelector("li:nth-child(2)");

function liClick (event) {
    alert("li was clicked");
};

li1.addEventListener("click", liClick); 

li2.addEventListener("click", function (event) {
    li1.removeEventListener("click", liClick);
    alert("remove li1 event");
}); 
```
## Code examples and challenge
Code examples can be found in the **code** directory here. 

Try the challenges in the **challenge** directory.