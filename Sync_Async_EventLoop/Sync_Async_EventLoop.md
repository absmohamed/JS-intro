# JavaScript Synchronicity

- [JavaScript Synchronicity](#javascript-synchronicity)
  - [Synchronous vs Asynchronous](#synchronous-vs-asynchronous)
    - [Synchronous code execution](#synchronous-code-execution)
    - [Asynchronous code execution](#asynchronous-code-execution)
  - [Call Stack](#call-stack)
  - [Web APIs](#web-apis)
  - [Callback Queue](#callback-queue)
  - [Event Loop](#event-loop)
  - [Callback Hell](#callback-hell)
    - [Callback hell example](#callback-hell-example)
    - [Recursive example](#recursive-example)

## Synchronous vs Asynchronous

### Synchronous code execution

Synchronous codes is also referred to as **blocking**, where asynchronous is referred to as **non-nonblocking** code execution.

Blocking or synchronous code is executed in order and must finish before moving on to the next line of code.

We have all seen this within our programs so far and is the behaviour we are familiar with.

```javascript
function wait(ms) {
  let start = Date.now(),
    now = start;
  while (now - start < ms) {
    now = Date.now();
  }
}
console.log("let's wait for 5 seconds ...");

wait(5000);

console.log("finished"); // Waiting - synchronous code
```

JavaScript itself is a single threaded language so in the traditional sense it is a blocking language.

```
One Thread == One Call Stack == One Thing At A Time
    - Philip Roberts
```

*So why do you think this is an issue?*

When we are running blocking code nothing else can run. Think about this in terms of the browser.
1. Its a bad user experience if a user has to sit and wait for each thing to load in sequence.
2. The browser wants to constantly render (every 6 milli seconds). If we are blocking that then nothing can re-render and looks like the browser has frozen.

*Run this code and look at how the button seems frozen during execution.*

```html
<!DOCTYPE html>
<html>
<head>
</head>
<body>
    <button id="button">Click Me!</button>
    <script>
        function wait(ms) {
            let start = Date.now(),
            now = start;
            while (now - start < ms) {
                now = Date.now();
            }
        }

        document.getElementById("button").addEventListener("click", () => {
            wait(5000);
            alert("Ran!");
        });
    </script>
</body>
</html>
```

As you can see this is a very bad user experience and keeps us from doing else while we wait for our code to finish executing. It also confuses the user when they have interacted multiple times with something on our page, but the response is delayed.

We can make JavaScript act ansynchronously through the callback queue and event loop.

### Asynchronous code execution

Non-Blocking or asynchronous code is when a line of code is executed and the program is able to move on before that line of code has finished.

*Just by reading the code what do you believe is going to print to the screen?*

```javascript
console.log(1);

setTimeout(() => {
    console.log(2);
}, 5000);

console.log(3);
```

So it looks like the code was able to continue to execute while it waited for the timeout to hit 5 seconds.

*If we modify the timeout to 0 seconds what do you believe the order printed to the screen will be?*

```javascript
console.log(1);

setTimeout(() => {
    console.log(2);
}, 0);

console.log(3);
```

It was the same! Even though technically we didn’t need to wait anytime at all before execution. To get a better understanding of what is going on we first need to look to the call stack.

## Call Stack

*What is a call stack?*

The call stack is how JavaScript keeps track of the execution order of its code.
You can either push onto the call stack or pop off the top.

Lets take a look at a [basic example of the call stack](https://gph.is/g/4bW6zYG).

```javascript
let a = 1;

function x () {
    return "here";
}

function y() {
    return x();
}

function z() {
    return y();
}

z();
```

As you could see as the code runs it is placed on the call stack. Once the code has finished executing it pops off the top.


Now lets see what happens when we run a piece of code that is asynchronous.

```javascript
// What happens? 
console.log("Hi!");

setTimeout(function timeout() {
    console.log("Time has passed!");
}, 5000);

console.log("Welcome, friend.");
```

*Use this link to run code and visualise the call stack - https://bit.ly/1Btu0Iy*

As we saw the function was handed to something called Web APIs, then the callback queue, and it was then picked up by the event loop and finally put on stack to be executed.

Let’s break down each of these concepts.

## Web APIs

As mentioned earlier JavaScript is a single threaded programming language so it is blocking by nature, but depending on where JavaScript is run (the browser in this case), we have access to additional features outside of the JavaScript runtime that we can hand off code execution to so that it pops off the call stack. In this case we have access to Web APIs which is a feature specifically for the browser. 

## Callback Queue

Whenever code execution outside of the call stack has finished (in this case, when Web API’s has finished) the callback is pushed into the callback queue, waiting to be put back in the call stack. Callbacks in the callback queue are not placed on the stack until it is completely empty.

## Event Loop

The event loop is constantly checking the call stack. Once the call stack is empty the event loop will check the callback queue. If there is a callback to process, the event loop will grab it from the callback queue and place it into the call stack for execution. If there are multiple callbacks in the callback queue, the event loop will place them in the stack one at a time, and only add the next one when the stack is empty again.

Let's try this example in loupe:

```javascript
console.log("1");

setTimeout(function timer() {
    console.log("3");
    
    setTimeout(function timer() {
        console.log("5");    
    }, 3000);
    
    console.log("4");
}, 4000);

console.log("2");
```

Revisiting this example with a 0 timeout value, console.log("2") still prints to the screen last.  Even though setTimeout does not technically take any time, it is still pushed to the callback queue and cannot be processed until the stack is clear.

```javascript
console.log("1");

setTimeout(function timer() {
   console.log("2");
}, 0);

console.log("3");
```

## Callback Hell

As we have seen when we run asynchronous code one way to continue executing code after the asynchronous call has finished is through the use of callbacks. At the moment we have only used setTimeout which is used in the real world but where we see callbacks used a lot in JavaScript is with event listeners and AJAX, jQuery, or other remote API calls.

Now we are not going to go deep into AJAX calls here (we will cover them in a future section) but just understand that these two asynchronous Web APIs allow us to listen for events in the DOM (a button click) or make a network/API call (AJAX).

As we've seen, this is what a basic event listener looks like:

```html
<!DOCTYPE html>
<html>
<head>
</head>
<body>
    <button id="button">Click Me!</button>
    <script>
        document.querySelector("#button").addEventListener("click", () => {
            console.log("button clicked");
        });
    </script>
</body>
</html>
```

And for our AJAX call in this example we will use the JQuery library since it takes a callback instead of returning a promise like other modern AJAX libraries.

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
</head>
<body>
    <script>
        $.getJSON("https://icanhazdadjoke.com/", (dadJoke) => {
            console.log(dataJoke.joke);
        });
    </script>
</body>
</html>
```

We can use these examples to demonstrate something known as **callback hell.**

### Callback hell example

Let's try to create a button in html that when they click it will retrieve 5 jokes from the api and save those jokes into an array. Have that array log to the console.

Now that you understand how the callback queue and event loop work, can you explain why this code won't do what we want? What will happen?

```javascript
    let jokes = [];
    $.getJSON("https://icanhazdadjoke.com/", (dadJoke) => {
      jokes.push(dadJoke.joke);
      console.log(dadJoke.joke);
    });
    $.getJSON("https://icanhazdadjoke.com/", (dadJoke) => {
      jokes.push(dadJoke.joke);
      console.log(dadJoke.joke);
    });
    $.getJSON("https://icanhazdadjoke.com/", (dadJoke) => {
      jokes.push(dadJoke.joke);
      console.log(dadJoke.joke);
    });
    $.getJSON("https://icanhazdadjoke.com/", (dadJoke) => {
      jokes.push(dadJoke.joke);
      console.log(dadJoke.joke);
    });
    $.getJSON("https://icanhazdadjoke.com/", (dadJoke) => {
      jokes.push(dadJoke.joke);
      console.log(dadJoke.joke);
    });
    console.log("Jokes",jokes)
```
This won't work because of the way that asynchronous javascript works - we won't have executed the callbacks before we try to print out the results.

A common way to implement a solution for something like this is shown in `code/callback_hell.html`. This will work, but it's really hard to read. 

When you get this pyramid looking shape with all of the }); at the end that is what is known as callback hell. It really is just deep nesting of callback functions, and it happens when we try to write JavaScript in a way where execution happens visually from top to bottom. 

### Recursive example

A recursive function would make it look a bit better. It's implemented in `code/recursive.html`.

This is much better, but javascript gives us something even better - Promises.

We'll look at Promises in the next lesson, and see how we can use them to escape callback hell without recursion.

### Code challenge

Let's go for the code challenge to practice a project with an asynchronous functions in `code/Asynchronous JavaScript`.

