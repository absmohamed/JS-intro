# Promises

- [Promises](#promises)
  - [Creating a Promise](#creating-a-promise)
  - [Resolving a Promise](#resolving-a-promise)
  - [Implementing our 5 joke array with Promises](#implementing-our-5-joke-array-with-promises)
  - [Adding DOM manipulation to the callback](#adding-dom-manipulation-to-the-callback)
    - [Defining the callback function](#defining-the-callback-function)
  - [Error handling and Promises](#error-handling-and-promises)
    - [Add error handling](#add-error-handling)

Promises are a lot like what they sound like. They are a placeholder for a return value from an asychnonous function. They promise to resolve with either a result or an error.

Promises are created like other objects with the *new* keyword. Their constructor takes a callback function as an argument. That callback function executes some asynchronous code, and handles two outcomes: resolve and reject.

If the asynchronous function executes as expected, it calls resolve with the result. If the asynchronous code encounters some error or fails, reject is called with the error. 

Let's look at the lifecycle of a Promise:
![lifecycle of a Promise](img/promises_flow.png)

## Creating a Promise
Here is how we could implement a call to our dad joke API by creating and returning a Promise:
```javascript
function asyncGetJoke() {
  return new Promise(function getDadJoke (resolve, reject) {
    $.getJSON("https://icanhazdadjoke.com/", (dadJoke) => {
      if (dadJoke) resolve(dadJoke.joke);
      else reject("Error getting joke");
    });
  });
}
```
It's a good practice to name an asynchronous function appropriately. This function does not return a value to be used in synchronous program flow. *It returns a Promise*.

If we trying calling our function and log the result, we will see a pending Promise. Let's try.

```html
<!DOCTYPE html>
<html>

<head>
  <script src="https://code.jquery.com/jquery-3.4.1.min.js"
    integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
</head>

<body>
  <button id="button">Get Jokes</button>
  <div id="jokes"></div>
  <script>
    function asyncGetJoke() {
      return new Promise(function (resolve, reject) {
        $.getJSON("https://icanhazdadjoke.com/", (dadJoke) => {
          if (dadJoke) resolve(dadJoke.joke);
          else reject("Error getting joke");
        });
      });
    }
    let promise = asyncGetJoke();
    console.log(promise);
  </script>
</body>

</html>
```
Here's what we see in console:
![pending promise in console](img/pending_promise.png)

We can see that inside of the Promise - it is resolved, and we can even see our joke! But we have to get that resolved value using *then*.

## Resolving a Promise
We use the `.then` method to get the resolution of a Promise. When the Promise *settles* (either resolves or rejects), we can use `.then` to access the result of our asynchronous function.

The `.then` method also takes a callback function as an argument. This function is executed when the Promise settles. Let's add this code to promises_test.html:
```javascript
  promise.then(function logPromise(joke) {
    console.log(joke);
  });
```

Now we can see the joke returned by the API call gets logged!

## Implementing our 5 joke array with Promises
In the last lesson when we saw that a chain of asynchronous function calls can lead to callback hell, we were asked to call the joke API 5 times, store the jokes in an array, then log the array. How can we do that with Promises?

Let's create another function called compileJokes that isn't recursive, and instead uses a loop and our asyncGetJoke method that returns a Promise:

```javascript
function compileJokes(num, callback) {
  let jokes = [];
  for (let i = 0; i <= num; i++) {
    asyncGetJoke()
      .then((dadJoke) => {
        jokes.push(dadJoke);
        if (i == 5) callback(jokes);
      });
  }
}
```
How is this different from our recursive function? Let's put it here so we can compare:
```javascript
function compileJokes(num, callback, arr = []) {
  let url = "https://icanhazdadjoke.com/";
  $.getJSON(url, (dadJoke) => {
    arr.push(dadJoke.joke);
    if (num === arr.length) {
      return callback(arr);
    }
    return compileJokes(num, callback, arr);
  });
}
```
In our Promise implementation, we iterate with a loop (instead of using recursion).

We call the async function, which returns a Promise, and use the `.then` method to handle the resolution. When it resolves, we push the joke to our array, and when we have done this five times, we call the callback function with the array of jokes.

The way we call this async function is exactly the same way that we called the recursive function:
```javascript
document.querySelector("#button").addEventListener("click", () => {
  compileJokes(5, (data) => {
    console.log(data);
  });
});
```
## Adding DOM manipulation to the callback
In addition to logging the array of jokes, we could also display them on the web page.

Notice that in our implementation, we implement the callback function passed to `compileJokes` as an anonymous function, specified directly in the argument list (we do the same for the recursive version). If we are going to add more code to this callback function, to display the jokes on the webpage in addition to logging the array to console, we should name the function, and make our code more modular.

### Defining the callback function
Let's define the callback function:
```javascript
function logAndDisplayJokes(jokes) {

  let jokesDiv = document.createElement("div");
  let body = document.querySelector("body");
  body.appendChild(jokesDiv);
  for (let joke of jokes) {
    let jokePara = document.createElement("p");
    jokePara.innerText = joke;
    jokesDiv.appendChild(jokePara);
  }
  console.log(jokes);
}
```

This function will take the array of jokes as a parameter. It will create a new div in the body to display the jokes, each one in a paragraph element. It will also log the array of jokes to the console.

Now when we call `compileJokes`, we can simplify the call:
```javascript
document.querySelector("#button").addEventListener("click", () => {
  compileJokes(5,logAndDisplayJokes);
});
```

Now we have three functions defined. Instead of keeping them inline in our html file, let's put them in their own script, and include a referene to the script at the bottom of the body. This is done in `code/promises.html` and `code/promises.js`.

## Error handling and Promises
If we wanted to add error handling to our recursive implementation (or the callback hell implementation), we would use try/catch. When we use Promises, we use the `.catch` method instead.

The `.catch` method will trigger when the Promise settles with a rejection. 

### Add error handling
Adding error handling to our example is quite simple:
```javascript
function compileJokes(num, callback) {
  let jokes = [];
  for (let i = 0; i <= num; i++) {
    asyncGetJoke()
      .then((dadJoke) => {
        jokes.push(dadJoke);
        if (i == 5) callback(jokes);
      }).catch((err) => {
        console.log("Error getting jokes", err);
      });
  }
}
```
Now if the Promise results in a rejection, the error will be logged instead of the exception bubbling up to our user. Let's test it.

We'll modify the Promise creation to reject:
```javascript
function asyncGetJoke() {
  return new Promise(function (resolve, reject) {
    $.getJSON("https://icanhazdadjoke.com/", (dadJoke) => {
      if (!dadJoke) resolve(dadJoke.joke);
      else reject("Error getting joke");
    });
  });
}
```

*What happens if we don't have the `.catch` and the Promise rejects?*

Remove the `.catch` and leave in the forced reject, and you'll see there is an uncaught error:
![uncaught rejected Promise](img/promise_reject_uncaught.png)

This is why it is important to handle rejected Promises.