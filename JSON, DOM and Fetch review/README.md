# Review lesson

- [Review lesson](#review-lesson)
	- [Getting data from a Web API asynchronously](#getting-data-from-a-web-api-asynchronously)
	- [Read a JSON Object](#read-a-json-object)
	- [Display JSON data in the browser](#display-json-data-in-the-browser)
	- [Event listener](#event-listener)
	- [Handling errors](#handling-errors)

With a code-along project we are going to review last weeks' lessons, trying to focus in the most important issues of JSON, DOM and asynchronous functions. First of all, we'll see how can we get data from an API. Usually, that data is in JSON format, so after getting it, we'll manage the JSON object to be in a more accesible way for our goals. Finally, by DOM manipulation we'll be able to display data into our browser.

In the `start` folder you'll find the code you need to start with the project.

## Getting data from a Web API asynchronously

Last week we had lessons about asynchronous functions in JavaScript. These could be overwhelming, but all of them were oriented to understand why we need to know asynchronous functions. 

The main goal of asynchronous functions in JavaScript is to avoid blocking functions that could ruin the user experience. So, all functions that could take much time should run asynchronously (be executed when they won't block any other part of the program). Luckily, JavaScript provide us easy ways to get that. 

`Promises` are the best way to get data from an API asynchronously, but it can be quite tricky to manage them. Promises guarantee a return, the required result (response) or an error (reject), and after that we can resolve the promise with the `.then` method.

`Fetch` is the easiest way to get the data. It's actually a promise but it needs less code. 

```javascript
const url = "https://randomuser.me/api/?results=12";

//asynchronous function to get the JSON document from the url
fetch(url).then(response => response.json())
        .then(data => console.log(data));
```
If we try this in our browser we'll see in the console.log the result of the JSON Object.

This call will always return a json object (at least always the web API returns a JSON...). We can try with several APIs.

`http://www.boredapi.com/api/activity`

`https://icanhazdadjoke.com/`

`https://dog.ceo/api/breeds/image/random`


## Read a JSON Object

If we have a look again to the console.log we'll see again the info about our 12 random users. JSON works with `keys` (left) and `values` (right), so we need to call to the key to get the value. Every object is defined between curly braces `{}` and arrays between brackets `[]`. So, when we try to store data in our program, if we use a key as a reference, its value will be stored in a variable. In our example if we use the result key, we will get an array of random users.

```javascript
fetch(url).then(response => response.json())
        .then(data => showUsers(data));

function showUsers(data) {
	console.log(data.results);
}
```
If we want to go to the detail we can iterate the array and get some extra information from our users.

```javascript
function showUsers(data) {
    //console.log(data.results);
    data.results.forEach((user, index) => {     
        console.log(index+" "+user.name.first+": "+user.email);
    });
}
```


## Display JSON data in the browser

Any time we want to modify our html dynamically we should use DOM manipulation. With the DOM we can easily get elements from the HTML file to the JavaScript file and modify them. First we need to reference them in the .js file. We can have access to this elements by functions like `getElementById()`, `getElementsByClassName()`, `querySelector()`, `querySelectorAll()`, `getElementsByTagName()`, etc. We could use them depending on how they are built in the HTML file. Then, we can also create new elements in the js file. 

In our example we want to display our random users in the browser. If we have a look to the index file we'll see a div called gallery, it looks like a good place to insert our data. So, first of all we'll create a variable with a reference to the gallery

```javascript
const url = "https://randomuser.me/api/?results=12";
const gallery = document.getElementById('gallery');
```
And now, inside the for we can create a div element to store each user in a div. It's useful to give class names to the divs so then we can give them style with the css.

```javascript
data.results.forEach((user, index) => {     
	console.log(index+" "+user.name.first+": "+user.email);
	const card = document.createElement('div');
	card.className = 'card';
});
```
If we have a look to the elements we'll see that nothing changes. This is because we we need to add this elements we've just created to somewhere in the HTML file. Inside the gallery div could be a good choice.

```javascript
const card = document.createElement('div');
card.className = 'card';
gallery.appendChild(card);
```
Next step should be add some information from our user the `card` div. We can store the full name in a paragraph and the image in an img.
```javascript
const card = document.createElement('div');
card.className = 'card';
const fullName = document.createElement('p');
fullName.textContent= user.name.first + " " + user.name.last;
const email = document.createElement('p');
email.textContent= user.email;
const profPic = document.createElement('img'); 
profPic.setAttribute('src', user.picture.medium);
card.appendChild(profPic);
card.appendChild(fullName);
card.appendChild(email);
gallery.appendChild(card);
```
Now you can have a look to the API definitions and use some filters...

## Event listener
We can add a button so every time we click it, we get other 12 random users. We can add the button statically in the index file, and then, by the DOM create the event listener. I'm not going to add it an id but a class.

```html
<div id="gallery" class="gallery"></div>
<input class="button" type="submit" value="New random users!">
<script src="app.js"></script>
```
Then, we need the event handler in app.js. I can get the button first with the `querySelector()`.
```javascript
const gallery = document.getElementById('gallery');
const button = document.querySelector('.button');
```
In the event listener we need to call the fetch again, so, instead of writing the same code again, we are going to create a function.
```javascript
function getJSON(){
    fetch(url).then(response => response.json())
        .then(data => showUsers(data));
}
getJSON();
```

```javascript
button.addEventListener('click',(e)=>{
    e.preventDefault();
    gallery.innerHTML="";
    getJSON();
});
```

## Handling errors

What happens if the API is not working? or if we don't have a connection? Let's try to force an error and see how the browser works. 
(Changing the url we could see that nothing displays, but we don't know what's going on)

We should use a `catch` clause after the `then` and display an error message in the browser.

```javascript
fetch(url).then(response => response.json())
        .then(data => showUsers(data))
        .catch( e => {
            gallery.innerHTML = "<h3>OOOOPS... Something went wrong!</h3>";
            console.error(e);
        });
```

