# Agenda and resources

- [Agenda and resources](#agenda-and-resources)
- [DOM Manipulation](#dom-manipulation)
	- [Manipulating The DOM](#manipulating-the-dom)
	- [Adding To The DOM](#adding-to-the-dom)
	- [Removing From The DOM](#removing-from-the-dom)
	- [Modifying Classes and Attributes](#modifying-classes-and-attributes)
	- [Adding & Retrieving CSS Styles](#adding--retrieving-css-styles)
	- [Element Properties](#element-properties)
	- [Challenges](#challenges)
		- [Bonus Challenge](#bonus-challenge)
		- [Extra Bonus Challenge - persisting the challenge data](#extra-bonus-challenge---persisting-the-challenge-data)

# DOM Manipulation

## Manipulating The DOM

_Use the below HTML code to load up a web page that we will be using to practice our DOM manipulation._

```html
<!DOCTYPE html>
<html>
	<head>
		<style>
			.blue {
				color: blue;
			}
		</style>
	</head>
	<body>
		<h1>Welcome</h1>
		<p>This page is used for practicing DOM manipulation</p>
		<div>
			<p>We will be learning</p>
			<ul>
				<li class="odd">Adding To The DOM</li>
				<li>Querying The DOM</li>
				<li class="odd">Changing The DOM</li>
				<li>Event Listeners</li>
			</ul>
		</div>
		<form id="page-form">
			<input type="text" />
			<input type="submit" value="Click Me" />
		</form>
	</body>
</html>
```

## Adding To The DOM

We can create new DOM objects in JavaScript.

```javascript
let newDiv = document.createElement("div")
```

Once we create our new DOM node we can manipulate it the same as if we retrieve a node directly from the DOM.

Creating it does not automatically make it available to the browser - currently is only stored in the `newDiv` variable. We have to append the new node to the DOM.

```javascript
document.body.appendChild(newDiv)
```

Now that we've appended it, we can see it in the elements on inspection.

We'll add some text so we can see it rendered in the browser.

```javascript
newDiv.innerHTML = "Awesome div text"
```

You may also have heard of document.write() to add html elements to the screen but this should be used with caution because if you call document.write() after an HTML page has been fully loaded with will replace all of the HTML on the page.

```javascript
document.write("<h1>Hello There</h1>")
```

## Removing From The DOM

If we would like to remove a node from the DOM we can use removeChild() to remove a child of a node, or remove() to remove a node itself.

Note that remove() is not supported on IE. For that reason, you may want to only use removeChild(), to ensure compatibility.

We can access the children of a node by calling the `children` method on the parent node. It returns an array of all children. Alternatively, we could call `querySelector` (or any of the query methods) on the parent node to access the children.

To remove the first `li` of the first `ul`, we could do the following for example:

```javascript
let ul = document.querySelector("ul")
let li1 = ul.children[0]
ul.removeChild(li1)
```

What are some other ways we could do this?

If we want to access a parent node from a child node, we can use the **parentNode** property. We can use this to work around the unavailibility of remove() on a node for IE. To remove a node, we can access it's parentNode, then call removeChild().

```javascript
let li2 = document.querySelector("li")
li2.parentNode.removeChild(li2)
```

## Modifying Classes and Attributes

Adding and removing classes from a node is very easy.

```javascript
let title = document.querySelector("h1")

title.classList.add("blue")
title.classList.remove("blue")
title.classList.toggle("blue")
```

Modifying attributes is also easy. We can just access and change them like any other property on an object.

```javascript
let formButton = document.querySelector("input[type=submit]")

console.log(formButton.value)

formButton.value = "Don't click me!"

//We can assign multiple attributes at once using Object.assign()

Object.assign(formButton, {
	id: "form-button",
	value: "ok you can click"
})
```

## Adding & Retrieving CSS Styles

CSS styles can be applied to a node just like any other property, the big gotcha is instead of dashes we camel case the names of the style properties.

```javascript
title.style.paddingLeft = "100px"
```

If we want to retrieve the value of a certain style property using `.style` will only give us a value if the style has been applied directly to the node. However it will not give us any computed style such as from a class or styling inherited from its parent.

```javascript
title.classList.add("blue")
console.log(title.style.color)
```

We can retrieve this value using **window.getComputedStyle()**.

```javascript
window.getComputedStyle(title).getPropertyValue("color")
```

## Element Properties

The last thing we will discuss about our node elements are a couple of properties that we always have access to. Those are **innerHTML** and **textContent** (Note: there is also a property called innerText but it should be avoided as it is a non standard property that was introduced in Internet Explorer and moved over to WebKit browser to avoid compatibility issues).

They are both writable properties meaning we can modify their content directly. There is a difference - innerHTML parses content as HTML and takes longer, while textContent uses straight text, does not parse HTML, and is faster.

```javascript
let ul = document.querySelector("ul")
console.log(ul) //ul element
console.log(ul.innerHTML) //html inside the ul element
```

Because this property is writable we can add HTML directly to it.

```javascript
ul.innerHTML += `<li>New li element</li>`
```

Or we can remove all of the innerHTML by setting it to null

```javascript
ul.innerHTML = null
```

The same concept applies for textContent.

## Challenges

There are two challenges in Ed for you to try:
* [DOM Manipulation - The Book List](https://edstem.org/courses/3808/challenges/6406)
* [DOM Manipulation - About Me](https://edstem.org/courses/3808/challenges/6408)

If you have trouble accessing them, let the instructor know.

### Bonus Challenge
Build a web page that you can use to track code challenges that you want to complete.

[Here is an example (that uses Bulma)](https://gph.is/g/4DLx87B). Yours doesn't have to be styled - just have fun with it!

*For this challenge, it's OK that the data is only available until you refresh the page.*

### Extra Bonus Challenge - persisting the challenge data
Making data persist on a client isn't something we typically do, unless it's for temporarily storing information for quick access - also known as *caching*. The reason for this is that we don't store and access data on our user's systems - that's a security issue. 

We can store data in the browser because there are security measures and settings built into the browser (well - in the directories used by the browser). But if we just store the data in the browser, it's only available on that computer and from that browser, and only until we clear out the data. 

For an application like the challenge tracker, we would persist data on the server, and retrieve it, and update it from the client (browser). This is similar to what we did with our Rails app. We won't get into this until we cover Express - so don't try to tackle that right now.

[Research using localStorage](https://www.w3schools.com/html/html5_webstorage.asp), and see if you can use localStorage to save your challenge data in the client(browser). Once you do this, as long as you're on the same computer and using the same browser, you won't lose your challenges every time you reload.


