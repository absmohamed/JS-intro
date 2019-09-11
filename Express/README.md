## Express.js

Ok lets get back to finishing up the functionality of our web server. If we take a look at how it stands now its isn’t too bad but lets think about how this might all go wrong.

What issues do you think we are going to run into as we continue to develop our web server and API?

* Get very messy (unorganised) the more routes we add - it isn't very modular.
* Hard to do dynamic routes
* No where to properly put our validation
* No easy way to get the body of our request
* Cumbersome to put together a proper response (need to write our own headers)

So what if there was an easier way to manage our web server? Good news for us there is and its called Express.js!

Express describes itself as a Fast, unopinionated, minimalist web framework for Node.js. So lets take a look at how we can setup our web server using Express instead of the HTTP module that comes packaged with Node. First we need to install express.

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

To get all the goodness from `forever` and `nodemon` will will also have to update our scripts in `package.json`. Lets create a new script and name it `express-server`.

package.json

```javascript
{
    "name": "app",
    "version": "1.0.0",
    "description": "",
    "main": "app.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "node-server": "forever -c \"nodemon --exitcrash -L\” app.js",
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
Now we can implement our student-app routes using express.

express.js

```javascript
const express = require("express");

const app = express();
const port = 3000;

const students = ["Natasha", "Shakti", "Santosh", "Allen", "James", "Blake"];

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/students", (req, res) => {
    res.send(students);
});

app.post("/students", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
```

Look at how clean express has made our code! Also we did not have to handle the 404 no route found because express automatically comes with a default error handling middleware.

## Middleware

To put it simply middleware is code that runs in the ‘middle’. Now this can get a little confusing because we can run our middleware really at any point. If we take a look at our code as it stands right now all the code is synchronous meaning the application is going to read in order so if want to add in some middleware before or after the routes we can literally place that code before or after all of the route calls using **app.use()**.

A commonly used middleware and one we are going to need to complete our POST route is **body-parser**. Lets log out the req in our POST route. Using Postman we'll send through the name of a new student we would like to add using Postman.

express.js

```javascript
app.post("/students", (req, res) => {
    console.log(req);
    res.send(req.body);
});
```
---

### Sending data through Postman
We can send JSON data through Postman to our APIs. To do this, we specify a body to our request, with a type of JSON:
![postman post settings](img/postman-post-body-settings.png)

In the text area provided in Postman, we can specify some strigified JSON. We will use a property 'name' to identify the student name we are sending:
![postman body example](img/postman-body-content.png)

If we search through the output in the terminal window there is no property holding the name we sent through to add a student. That is because at the moment the body information of the request is in the form of a stream. Now if we really wanted to we could convert this stream to actual usable data ourselves but with express’ concept of middleware we don’t have to!

---

Lets install the body-parser middleware.

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

// parse application/json
app.use(bodyParser.json());

// Initial data in students array
const students = ["Natasha", "Shakti", "Santosh", "Allen", "James", "Blake"];

app.get("/", (req, res) => {
    // Send "Hello world!" to the client
    res.send("Hello World!");
});

app.get("/students", (req, res) => {
    // Send the list of students to the client
    res.send(students);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
```

Now we can parse data coming into our server as json. 

This middleware parses the data and saves it to the request as a body property, which we can now view using req.body. Notice how this middleware had to be defined before the routes because we need it to run before we access the request object on any particular route. If we defined this middleware after the routes it would not have run in time.

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
    res.send("Hello world!");
});
```

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

Note that we use the `status` method on the result to send the status code. We send the data back with the `send` method.

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

## JavaScript Templating Engines

Express is unopinionated meaning it doesn’t care which packages you use within its ecosystem and it doesn’t care how you layout your file structure. You must hook everything up for it to work, nothing really comes working right out of the box like we had with Rails magic. Although this can be a good thing since we know exactly how our code is working it can also lead to some confusion about setting up new features inside of express since the developer is the one who needs to wire it all together.

One of those confusing things we need to wire together is how exactly we serve html files from our express server. If we just want to serve an html string we can do so using the same send method on res

express.js

```javascript
app.get("/", (req, res) => {
    res.send(`<h1>My Header</h1>`);
});
```

We can see that this sends successfully but if we wanted to do anything more complex we wouldn’t be able to. In comes in the power of a templating engine. In this lesson we are going to be using Handlebars as our JavaScript templating engine but there are many different ones out there that express supports.

https://github.com/expressjs/express/wiki#template-engines

Lets install the express-handlebars view engine

https://github.com/ericf/express-handlebars

```
npm i express-handlebars
```

According to the express-handlebars documentation we need to create a new directory called view and place some files within it like so.

```
└── views
    ├── home.handlebars
    └── layouts
        └── main.handlebars
```

Within those files lets put some content.

views/layouts/main.handlebars

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Example App</title>
</head>
<body>

    {{{body}}}

</body>
</html>
```

views/home.handlebars

```html
<h1>It’s working!</h1>
```

Last but not least we need to include this package in express.js and instead of using **res.send()** to send our response back we will use res.render()

express.js

```javascript
const express = require("express");
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();
const port = 3000;

const students = ["Natasha", "Shakti", "Santosh", "Allen", "James", "Blake"];

app.engine('handlebars', exphbs({defaultLayout: 'main'}));

app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.render('home');
});

app.get("/students", (req, res) => {
    res.send(students);
});

app.post("/students",(req, res, next) => {
    console.log(req.body);
    next();
}, (req, res) => {
    students.push(req.body.name);
    res.status(201).send(students);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
```

There we go, now its all working! Lets use handlebars to generate a webpage that will show us a random paring for students to eat lunch together.

views/home.handlebars

```html
<h1>Lunch Pair</h1>
<p>{{ student1 }} & {{ student2 }}</p>
```

express.js

```javascript
app.get("/", (req, res) => {
    let randomIndex1 = Math.floor(Math.random() * students.length);
    let randomIndex2 = Math.floor(Math.random() * students.length);
    res.render('home', { student1: students[randomIndex1], student2: students[randomIndex2]});
});
```
Alright! We have our webpage working now but something still just doesn’t feel right to me the way we have done this.

*Ask the class what we could improve (think about MVC).*

* seperate our routes out into a different file
* seperate our logic from our routes into a controller

*We will answer these questions in the next lesson.*












So what exactly is Node.js?

*Who here has heard of Node.js before?*

*Ok and who here can tell me exactly what Node.js is or for what purpose it was created?*

JavaScript has been used mainly for client-side scripting inside **< script >** tags executing in web browsers. This limitation meant that developers were often working in many different languages and frameworks between the front-end (client-side) and backend (server-side) aspects of a web application.  

Although there were other projects to bring JavaScript to server-side applications, the functionality took off with the launch of Node.js

Node allows developers to write JavaScript code that runs directly in a computer process itself instead of in a browser. Node can, therefore, be used to write server-side applications with access to the operating system, file system, and everything else required to build fully-functional applications.

In a nutshell Node.js allows JavaScript to be run on the machine and not just in a browser which opens up a world of possibilities.

*All of the below examples will work using Node.js version 8.10 - 10.13*

Lets create our first node script.

*Create a new directory and in that directory a file called app.js and place all of our JavaScript within it.*

app.js

```javascript
let a = 1;
let b = 2;

console.log(a + b);
```

Now lets run this script using node.

```
node app.js
```

We see the number 3! This may not seem too impressive because we were able to do this already with Ruby but as mentioned before JavaScript has not traditionally been able to run on a computer outside the browser. Also if you were paying attention when we were talking about JavaScript in the browser one of these lines of code may be a little confusing.

*Can anyone guess what I am talking about?*

It’s the console.log()! Technically we don’t have a console do we? Console.log() is a HTML DOM method, it is not a method that comes with the JavaScript language so how do we have it in our Node application? Well the smart people who developed Node understood that there was a lot of methods that JavaScript developers use all the time and to avoid confusion they made them available in Node with similar functionality. Another one of those methods is setTimeout().

app.js

```javascript
setTimeout(() => { console.log("async")}, 1000);
```

We know setTimeout is part of the Web API and when it executes it is handed to that Web API to avoid blocking the JavaScript call stack but we were able to use it in Node as well. What gives? Well Node also has the ability to run asynchronous code but instead of it handing it asynchronous calls to the Web API instead it hands them off to something else that functions in a very similar way (C++).

However you will find that there are methods we can use in the browser that are not available inside of Node.

app.js

```javascript
let name = prompt("What is your name?");

console.log(name);
```
If we were to run this code in the browser we would get a nice little pop up box asking us for our name but when we run this code in Node we get an error saying that prompt() is not defined. Now there are some npm packages we could include in our project to mimic this functionality but just to reiterate Node does not have it out of the box.

For a list of all the different modules that come with Node lets take a look at the docs.

https://nodejs.org/dist/v10.13.0/docs/api/

One module that catches my eye is the file system. Let’s take a look at how we could use this.

Now even though Node comes with a bunch of different modules not all of them make their code available through global variables. We will need to import this one. Node uses the CommonJS syntax for import and exporting modules.

```javascript
const fs = require("fs");
```
 
Now we have access to the file system modules through our fs variable. Lets create a new file.

```javascript
const fs = require("fs");

fs.appendFile('node.txt', 'Hello content!', function (err) {
    if (err) throw err;
    console.log('Saved!');
});
```

The appendFile method looks for a file to open and if it does not exist, it will create a new file and add the give string to the end. We can read this file using:

```javascript
const fs = require("fs");

const contents = fs.readFileSync("node.txt", "utf8");

console.log(contents);
```

**CommonJS**

Node.js has a different way it handles modularising our code then what we have learned about in the past. It currently does not support ES6 import and export statements (though this may be coming to node soon, at the moment it is in Node under experimental features) but instead using the import / export syntax of CommonJS.

Lets create another file and name it lodash.js and put some utility functions within it.

lodash.js

```javascript
function random() {
    console.log("My random function");    

    return Math.random();
}

function times(num, callback) {
    console.log("my times function");

    for (let i = 0; i < num; i++) {
        callback(i);
    }
}
```

Just like in ES6 exports we need to declare what we would like to export but CommonJS syntax is a little different. We use **module.exports** instead of just export.

```javascript
function random() {
    console.log("My random function");
    
    return Math.random();
}

function times(num, callback) {
    console.log("my times function");

    for (let i = 0; i < num; i++) {
        callback(i);
    }
}

module.exports = {
    random,
    times
}
```

Now to import our code we use the **require** statement.

app.js

```javascript
const myLodash = require("lodash");

console.log(myLodash.random());

myLodash.times(2, i => {
    console.log(i);
});
```

When we run this code we get an error! That is because if we are trying to import a file that is not a node_module or a Node.js module we must give  it a relative path.

app.js

```javascript
const myLodash = require("./lodash");

console.log(myLodash.random());

myLodash.times(2, i => {
    console.log(i);
});
```

Now it works. Lets also install the 3rd party lodash library using npm.

```
npm init
//Hit enter until it is done setting up
npm install lodash --save
```

The lodash library should be installed so lets import it into our app.

app.js

```javascript
const myLodash = require('./lodash');
const npmLodash = require('lodash');

console.log(myLodash.random());

myLodash.times(2, i => {
    console.log(i);
});

console.log(npmLodash.random(200));

let build = npmLodash.times(2, i => {
    return i;
});

console.log(build);
```

We can see that myLodash is importing code from the file we created and npmLodash is using the lodash package we just installed using npm. One big difference between CommonJS modules and ES6 modules are that CommonJS modules are loaded synchronously. We can take advantage of this behaviour by using the require statement to split out we want to run before our current code executes but not necessarily import anything. To understand what I mean lets create another new file called setup.js

setup.js

```javascript
console.log("We can run code here we need for setup or to maybe set a global variable like below");

global.myFavNumber = 3;
```

app.js

```javascript
require("./setup");

console.log("code after setup");
console.log(global.myFavNumber);
```

When we run this code setup.js runs first logs to the console and sets a global variable. After that the rest of app.js runs which prints out to the console another string and the value of the global variable we set.

**Node.js As A CLI**

Lets build a CLI using JavaScript and Node! We are going to create a very simple CLI that receives the users name, their favourite colour and then prints their name to the screen in that colour. Sounds easy right!

Well…..actually its not so easy in Node.js. In Ruby we have a really easy method built right into the language.
What was that method called?

That right is was **gets()** but in Node we don’t have such an easy method. Actually Node uses **stdin** to process input typed into the command line but thats a little to low level for us at the moment.

*So how can we solve this problem?*

Exactly, I’m sure there is an npm package we can use! Let’s take a look at the inquirer library.

https://www.npmjs.com/package/inquirer

*Ask if they think that this npm package is a good one and why*

* Lots of downloads
* Updated recently
* Active community
* Good docs

Remember that we are downloading code to our project that was created by someone on the internet. These people could go away tomorrow and no longer maintain the code base so it is always better to investigate a package before making our application depend on it.

Amazing this looks exactly like what we need. Lets install it and import it into app.js.

```
npm install inquirer —save
```

*Have the students import inquirer into app.js (answer below).*

app.js

```javascript
const inquirer = require("inquirer");
```

*Have the students read the inquirer document and ask the users name and fav colour. Then print those answers to the terminal window. (answer below, this may take some students a little while).*

app.js

```javascript
const inquirer = require("inquirer");

inquirer.prompt([
    {
        type: 'input',
        name: 'name',
        message: "What's your name?"
    },
    {
        type: 'input',
        name: 'color',
        message: "What's your favourite color?"
    },
])
    .then(answers => {
        console.log(answers);
    })
    .catch(error => console.log(error));
```

Awesome now we need to colour the text output with the users color. To do this lets install another JavaScript library called Chalk.

https://www.npmjs.com/package/chalk

Looks good. Lets install it.

```
npm install chalk —save
```

*Have the students incorporate the Chalk package into their CLI. (answer below).*

app.js

```javascript
const inquirer = require("inquirer");
const chalk = require("chalk");

inquirer.prompt([
    {
        type: 'input',
        name: 'name',
        message: "What's your name?"
    },
    {
        type: 'input',
        name: 'color',
        message: "What's your favourite color?"
    },
])
    .then(answers => {
        let {name, color} = answers;
        color = color.toLowerCase();
        if (!chalk[color]) {
            throw "Sorry I don't know that color";
        }
        console.log(chalk[color](name));
    })
    .catch(error => console.log(error));
```

This is working well but the user doesn’t know which colours we can use and we can’t. We should probably just them a selection of what’s available that they can choose from.

*Have students look through the Chalk and Inquirer documentation to see if they can figure out a solution to our problem.*

*Below is only one possible solution limiting the user selection to colours that Chalk has direct methods for but there are many other solutions like making the user type in a hex instead of the name of a colour or continuing asking the user for a colour until we get one that we can use…….*

app.js

```javascript
const inquirer = require("inquirer");
const chalk = require("chalk");

inquirer.prompt([
    {
        type: 'input',
        name: 'name',
        message: "What's your name?"
    },
    {
        type: 'list',
        name: 'color',
        message: 'What is your favourite color?',
        choices: [
            "black",
            "red",
            "green",
            "yellow",
            "blue",
            "magenta",
            "cyan",
            "white",
            "gray"
        ]
    }
])
    .then(answers => {
        let {name, color} = answers;
        color = color.toLowerCase();
        if (!chalk[color]) {
            throw "Sorry I don't know that color";
        }
        console.log(chalk[color](name));
    })
    .catch(error => console.log(error));
```

