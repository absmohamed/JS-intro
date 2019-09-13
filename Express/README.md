# Express.js

## Resources
[express.js](https://expressjs.com/)
[HTTP status dogs](https://httpstatusdogs.com/)

- [Express.js](#expressjs)
  - [Resources](#resources)
  - [Express](#express)
    - [Why use express.js?](#why-use-expressjs)
  - [Setup our environment](#setup-our-environment)
  - [Updating our routes using express](#updating-our-routes-using-express)
  - [Processing the POST data with express](#processing-the-post-data-with-express)
  - [Middleware](#middleware)
    - [body-parser](#body-parser)
    - [Using body-parser to parse form-urlencoded content](#using-body-parser-to-parse-form-urlencoded-content)
  - [Defining our own middleware](#defining-our-own-middleware)
    - [Using next() in middleware functions](#using-next-in-middleware-functions)
  - [JavaScript Templating Engines](#javascript-templating-engines)

## Express
Express is a fast, unopinionated, minimalist web framework for Node.js

### Why use express.js?

Our node.js http server works, and we kept it pretty clean, but there are some issues:

* Gets messy (unorganised) the more routes we add - it isn't very modular.
* Hard to do dynamic routes
* No where to properly put our validation
* No easy way to get the body of our request
* Cumbersome to put together a proper response (need to write our own headers)

Express.js gives us a mucheasier way to manage our web server. 

Let's take a look at how we can setup our web server using Express instead of the HTTP module that comes packaged with Node. First we need to `npm init` install express, and create our `script` alias.

## Setup our environment
Remember this part? 
```
npm init
```

Install express:
```
npm i express
```

Lets create a new file to create our express server in called express.js

express.js

```javascript
const express = require("express");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
```

To get all the goodness from `forever` and `nodemon` we will also have to update our scripts in `package.json`. Lets create a new script and name it `express-server`.

package.json

```javascript
{
    "name": "app",
    "version": "1.0.0",
    "description": "",
    "main": "app.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "express-server": "forever -c \"nodemon --exitcrash -L\" express.js"
    },
    "author": "",
    "license": "ISC",
    "devDependencies": {
        "nodemon": "^1.18.6”,
        "forever": "^0.15.3"
    }
}
```

There we go we now have an express server running.

## Updating our routes using express
Now we can implement our student app routes using express.

express.js

```javascript
const express = require("express");

const app = express();
const port = 3000;

function randomPair() {
  let s1Ind = Math.floor(Math.random() * students.length);
  let s2Ind = Math.floor(Math.random() * students.length);
  return `${students[s1Ind]} ${students[s2Ind]}`;
}

let students = ['Carlie', 'Tony', 'Sam', 'Carl', 'Sherine', 'Lelani', 'Aidan', 'Jack', 'Mark', 'Rachel'];

app.get("/", (req, res) => {
    res.send(randomPair());
});

app.get("/students", (req, res) => {
    res.send(students);
});

app.post("/students", (req, res) => {
    // Still need to add code to add the student that is sent
    res.send(students);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
```

Look at how clean express has made our code! Also we did not have to handle the 404 no route found because express automatically comes with a default error handling middleware.

## Processing the POST data with express
Remember how mess it was to process the stream data from the POST request with the http module in the node.js lesson? This is one of the big wins we get with express.js. Let's look again at the request that comes to the server when we send a student from Postman.

express.js

```javascript
app.post("/students", (req, res) => {
    // Log the request
    console.log(req);
    // Still need to add code to add the student that is sent
    res.send(students);
});
```
There is a piece of middleware we can use with express.js that will parse the request body for us, as json or a url encoded string. 

What is middleware?

## Middleware

To put it simply middleware is code that runs in the ‘middle’. Now this can get a little confusing because we can run our middleware really at any point. If we take a look at our code as it stands right now all the code is synchronous meaning the application is going to read in order so if want to add in some middleware before or after the routes we can literally place that code before or after all of the route calls using **app.use()**.

A commonly used middleware and one we are going to need to complete our POST route is **body-parser**. 

### body-parser

```
npm i body-parser
```

Now lets import this module into our code use it.

express.js

```javascript
const express = require("express");
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Use body-parser to parse application/json
app.use(bodyParser.json());
```

Now we can parse data coming into our server as json. 

This middleware parses the data and saves it to the request as a **body** property, which we can now view using `req.body`. 

Notice how this middleware had to be defined before the routes because we need it to run before we access the request object on any particular route. If we defined this middleware after the routes it would not have run in time.

---
### Using body-parser to parse form-urlencoded content
If we expect form-urlencoded content from the client, we would also include this middleware from body-parser:
```javascript
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());
```
---

Let's log the req.body so we can see what's there:

```javascript
app.post("/students", (req, res) => {
  console.log(req.body);
  // Still need to add code to add the student that is sent
  res.send(students);
});
```
![express req.body](img/express-req-body.png)

OMG! Magic!

Lets use this data now to complete the functionality for our /student POST route.

express.js

```javascript
// Take the name from the req.body property and add it the end of the students array. 
//The route should respond with a 201 status and the modified array
app.post("/students", (req, res) => {
    students.push(req.body.name);
    res.status(201);
    res.send(students);
});
```

Note that we use the `status` method on the result to send the status code. When we create a resource, we should send back the 201 status code. You can remind yourself of the proper status codes using [HTTP status dogs](https://httpstatusdogs.com/).

We send the data back with the `send` method.

Test it! Make sure our POST request is updating the list of students.

## Defining our own middleware
One more note about middleware before we move on is that we can define it for a specific route as well. Lets add some custom middleware to our /students POST route that will always log the req.body.

express.js

```javascript
// Custom logging middleware
function logReqBody(req, res, next) {
    console.log(req.body);
    next();
}
app.post("/students", logReqBody, 
    (req, res) => {
        students.push(req.body.name);
        res.status(201)
        res.send(students);
    }
);
```

We define the middleware function `logReqBody`, which just logs the req.body. 

Now we can include that middleware function where we like, such as for the `post /students` route as shown above. To include it, we just pass it as an argument before the callback function that executes on the request.

We can use as many middleware functions as we like in this way, just chaining them one after the other in a comma-separated list, in the order we want them to be executed. 

### Using next() in middleware functions

If we want to execute multiple functions (middleware) before we complete our response to a request, we need to use the `next()` function to indicate to express that we are not done, and the request and response should be passed on to the next function in the response chain. If we ever need to pass an argument from middleware we simply give it as an argument to the next() method.

To demonstrate the syntax, we'll pass a message from our middleware to the response function:

```javascript
// custom middleware with a message
function logReqBody(req, res, next) {
  console.log(req.body);
  next("message from middleware");
}

app.post("/students", logReqBody, (req, res, message) => {
  console.log(message);
  students.push(req.body.name);
  res.status(201)
  res.send(students);
});
```

