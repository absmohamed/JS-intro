# Modularity

- [Modularity](#modularity)
  - [Resources](#resources)
  - [Making our server code modular](#making-our-server-code-modular)
  - [CommonJS](#commonjs)
  - [Structuring our app](#structuring-our-app)
  - [Creating the middleware module](#creating-the-middleware-module)
  - [Creating the utils module](#creating-the-utils-module)
  - [Creating the controllers module](#creating-the-controllers-module)
  - [Express Router](#express-router)

## Resources
[CommonJS](https://nodejs.org/docs/latest/api/modules.html)
[Express.Router](https://expressjs.com/en/guide/routing.html)

## Making our server code modular
Our http server looks pretty good, but we can't continue on this way, putting all of our code into a single file. It's madness.

Making our code modular means separating it into different files in a way that is organised, and that makes it easy for us to test, maintain, and reuse our code.

What are some of the problems we will encounter if we don't make our code modular?

## CommonJS

Node.js uses the CommonJS module specification as the standard for working with modules. This is different from the ES Modules specification that is used for client-side javascript, although support for the ES Modules standard in Node.js is listed under experimental features. We will see what the import/export syntax of ES Modules is like when we study React.

CommonJS provides a way for us to define our code in separate files when we're working with server code that runs outside of the browser.

## Structuring our app
Right now everything is in one file. How could we structure our app?

We will create the following files, with the indicated purpose:
- middleware.js: stores any middleware functions for our route handling:
  - logReqBody
  - randomPair
- utils.js: stores any utility functions:
  - readStudentData
  - persistStudentData
- controllers.js: stores the logic for our route handlers. We will implement new functions and use those as callbacks for our routes:
  - getStudents
  - addStudent
  - getPair
- routes.js: stores our route handlers (using Express.Router)

In a larger application, we would create directories for each of these categories and have files for each part or feature of our application. We'll see some examples like this soon.

## Creating the middleware module
We already have two pieces of middleware, so we could put those into a file called middleware.js: 

middleware.js
```javascript
const logReqBody = (req, res, next) => {
  console.log(req.body);
  next();
}

const randomPair = (req, res, next) => {
  let s1Ind = Math.floor(Math.random() * students.length);
  let s2Ind = Math.floor(Math.random() * students.length);
  req.pair = {
    pair: [students[s1Ind], students[s2Ind]]
  };
  next();
}
```

To make use of this middleware, we just have to export the functions. One way to do that is using module.exports:

middleware.js
```javascript
module.exports = { logReqBody, randomPair }
```

Now in express.js, we will require the middleware:

express.js
```javascript
const { logReqBody, randomPair } = require('./middleware');
```

Notice that we need to pass the students array to the randomPair middleware because we can't refer to the global variable, so how do we manage that? 

Middleware functions are just functions, so we can pass additional parameters, but the way we use the middleware will be a little different:

```javascript
app.get("/", (req, res, next) => {
  randomPair(req, res, next, students);
  res.send(req.pair);
});
```
What did we change here? Instead of just including the function name in the argument list in front of the callback that defines the route, we include `next` in the arguments to the route callback, and then invoke the randomPair function with the arguments it needs from the route callback function.

Now we'll test and make sure this works. Remember to run `npm i` to install the dependencies if you haven't already in this directory.

## Creating the utils module
The utils module will contain the utility functions we are using to store and retrieve our data. We can copy this code directly from express.js without any changes, and add the exports. We can also move the require for 'fs' here since this is where we will use it:

utils.js
```javascript
const fs = require('fs');

// Read student data from a file
const readStudentData = file => {
  let students = fs.readFileSync(file, 'utf8').split('\n');
  return students;
};

// Write student data to a file
const persistStudentData = (file, students) => {
  fs.writeFileSync(file, students.join('\n'));
  return students;
};

module.exports = {
  readStudentData,
  persistStudentData
}
```
Now that we've moved this code around, we'll test again.

## Creating the controllers module
The controllers module will hold the logic of our route handling, similar to the controller actions we saw in rails. This requires that we name and define some functions that will be used for route handling. We will create the following functions, and just copy the current anonymous function code directly into these:

controllers.js
```javascript
// Gets a random pair of students using the randomPair middleware
const getPair = (req, res, next) => {
  randomPair(req, res, next, students);
  res.send(req.pair);
}

// Adds a student to the array and persists it in the file
const addStudent = (req, res) => {
  // Add the student to the array, save to the file,  and send back the updated list of students
  students.push(req.body.name);
  persistStudentData('students.txt', students);
  res.status(201)
  res.send(students);
}

// Returns the list of students
const getStudents = (req, res) => {
  res.send(students);
}
```

We'll have to do a few things if we move this code here:
- require randomPair from middleware
- keep track of the students array from here (and initially populate it)
- export the three callback functions needed by our routes

controllers.js
```javascript
const { randomPair } = require('./middleware');

// Initialise our array of students
let students = [];
students = readStudentData('students.txt');

module.exports = {
  addStudent,
  getPair,
  getStudents
};
```

With this done, we can alter our route handlers in express.js to something much simpler:

express.js
```javascript
const { logReqBody } = require('./middleware');
const {
  addStudent,
  getPair,
  getStudents
} = require('./controllers');

app.get("/", getPair);
app.get("/students", getStudents);
app.post("/students", logReqBody, addStudent);
```

Let's test again.

## Express Router
To create our router module, we will use an express class called Router.

To use Router in router.js, we will require express and express.Router():

router.js
```javascript
const express = require('express');
const router = express.Router();
```

The syntax to define a route handler using express.Router is exactly the same as what we've already seen. We can literally copy the code from express.js, and just use `router` instead of `app` to define the route handlers:

router.js
```javascript
const { logReqBody } = require('./middleware');
const {
  addStudent,
  getPair,
  getStudents
} = require('./controllers');

router.get("/", getPair);
router.get("/students", getStudents);
router.post("/students", logReqBody, addStudent);
```
Finally, to make this router available to our express.js app, we'll export it:

router.js
```javascript
module.exports = router;
```

Now we can modify our express.js file to remove all that code, and replace it with these two lines:

express.js
```javascript
const router = require('./router');
app.use('/', router);
```

Or alternately, **with this single line**:

express.js
```javascript
app.use('/', require('./router'));
```

This works because the return value of `express.Router()`, which we have declared as `router` and are exporting from our `router.js` **is a function**. When we specify it in the `app.use` line in our express.js, it provides the route handling callback function that is appropriate for the method and url that are in the request, based on the definitions we have provided in `router.js`. 

So, for example, if our express.js receives a GET request on '/', it is passed to `router`, and it executes the callback function provided for that method and URL.

Our application is simple and it may appear we didn't gain much by moving our route handling to another file, but if we had a lot of different routes for different application features, we could easily define them in different files, using different router instances for each feature of our application. We'll see this in practice a bit later when we develop a more interesting application.

Now our express.js should look like this:

express.js
```javascript
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const router = require("./router");
app.use("/", router);

app.listen(port, () => console.log(`Express app listening on port ${port}!`));
```
We'll test again to make sure everything is working.
