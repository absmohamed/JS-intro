# Mongoose

Mongoose is an ODM (object data modelling) node module that we will use to make it easier for our application to interact with the data in MongoDB. This is similar to the way we used ActiveRecord (an ORM - object resource mapping) with our Rails app.

- [Mongoose](#mongoose)
  - [Resources](#resources)
  - [Mongoose model and schema](#mongoose-model-and-schema)
  - [Mongoose queries](#mongoose-queries)
    - [All database operations are asynchronous operations](#all-database-operations-are-asynchronous-operations)
  - [Using Post.find to implement READ](#using-postfind-to-implement-read)
  - [Sorting the results](#sorting-the-results)
  - [Testing asynchronous code](#testing-asynchronous-code)
  - [Setting up test data](#setting-up-test-data)
    - [Connect to test database](#connect-to-test-database)
    - [Setup and tear down for each test](#setup-and-tear-down-for-each-test)
  - [Testing the asynchronous utilities functions](#testing-the-asynchronous-utilities-functions)
  - [Run the test for the new getAllPosts](#run-the-test-for-the-new-getallposts)
  - [Using Post.find to get a specific post by id](#using-postfind-to-get-a-specific-post-by-id)
  - [Test getPost](#test-getpost)
  - [Using new and save or Post.create to implement CREATE](#using-new-and-save-or-postcreate-to-implement-create)
  - [Data validation for create](#data-validation-for-create)
  - [Using post.findbyIdAndRemove for DELETE](#using-postfindbyidandremove-for-delete)
  - [Using Post.findByIdAndUpdate for UPDATE](#using-postfindbyidandupdate-for-update)
  - [Challenges](#challenges)

## Resources

- [Mongoose Guide](https://mongoosejs.com/docs/guide.html)
- [Mongoose validations](https://mongoosejs.com/docs/4.x/docs/validation.html)
- [Mongoose queries](https://mongoosejs.com/docs/queries.html)

Now that we have a handle on MongoDB, we'll use mongoose to integrate it with our blog application so that we can actually persist the data in a database instead of a json file.

Lets install mongoose

```
npm i mongoose
```

Now lets require mongoose in our app.js file and setup the connection to our database.

app.js

```javascript
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const postRouter = require("./routes/posts_routes")

const port = 3000

const app = express()
app.use(cors())
app.use(bodyParser.json())

const dbConn = "mongodb://localhost/blog_app"
// Set three properties to avoid deprecation warnings:
// useNewUrlParser: true
// useUnifiedTopology: true
// useFileAndModify: false
mongoose.connect(
	dbConn,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	},
	err => {
		if (err) {
			console.log("Error connecting to database", err)
		} else {
			console.log("Connected to database!")
		}
	}
)

app.get("/", (req, res) => {
	console.log("get on /")
	res.send("got your request")
})

app.use("/posts", postRouter)

app.listen(port, () => {
	console.log(`Blog express app listening on port ${port}`)
})
```

## Mongoose model and schema

Mongoose creates its models from **schemas**. Schemas allow us to define the fields we are going to store in the database, any validation we would like to apply and default values as well.

We do not have to define all the fields we'll use for a model in the schema - it is optional. A NoSQL database has a **flexible schema**. This means that:
- it can be dynamically changed
- different documents can have different fields in the same collection
- the same field can store different types in a collection

However, we can use a schema definition to help enforce some consistency and validation in our data model and the data stored by our application.

Lets create our first schema for holding information about our blog posts. We need to decide where to store our model definitions. There is no particular code structure we have to follow, or even strong conventions. What's important is that we choose a logical structure that is consistent within a given project.

We will create a directory called models, and store our Post model and schema in a file called post.js. This mimics what we did in Rails.

```
directory
├──app.js
├── controllers
    └── posts_controller.js
├── models
    └── post.js
├── routes
    └── posts_routes.js
└── utils
    └── utilities.js
```

Our Post schema will define fields for the properties we currently define in our .json file, along with their types. The supported [types for mongoose schema](https://mongoosejs.com/docs/schematypes.html) are:

- String
- Number
- Date
- Buffer
- Boolean
- Mixed
- ObjectId
- Array
- Decimal128
- Map

Read more about these types and how they can be used.

For our Post model schema, we will use these types:

- title: String
- create_date: Date
- modified_date: Date
- username: String
- content: String
- category: String

One built-in validation we can specify is which of these is required. We'll make `title`, `create_date`, `modified_date`, `username`, and `content` required. There are some other [built-in validations available, and you can create custom validations as described in the documentation for Mongoose](https://mongoosejs.com/docs/4.x/docs/validation.html).

post.js

```javascript
const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Define Post schema
const Post = new Schema({
	title: {
		type: String,
		required: true
	},
	create_date: {
		type: Date,
		required: true
	},
	modified_date: {
		type: Date,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	category: String
})
```

In order to make the Post model available to other files in our app, we need to export it as a mongoose model:

```javascript
module.exports = mongoose.model("Post", Post)
```

All done! Now we can use the model to do any CRUD methods we want. Lets go back to our controller helper functions in `utilities.js` and use our Post model instead of the json object.

## Mongoose queries

Just as we saw with ActiveRecord model methods, mongoose provides an abstraction on MongoDB that models the data object and it provides a set of static helper functions for querying the database.

The mongoose query documentation lists these [helper functions for CRUD operations](https://mongoosejs.com/docs/queries.html).

### All database operations are asynchronous operations

As we should expect, all of the functions we execute on the database are asynchronous. 

_Why would that be?_

When we're querying a database, we are communicating from one server to another to send and retrieve information. When we're developing, these two servers are running on a single host - our laptop. However, when we deploy, these two servers will be separated geographically. Our MongoDB server will be deployed on mlab, and our server application on heroku, for example. These requests could take some time to complete (or may never complete if there are issues), so it makes sense for them to be executed asynchronously. 

We can pass a callback to any mongoose query, and when it returns, the callback will be passed the result and any error. The pattern for passing this information to the query callback function is callback(error, results). What results is depends on the operation: For findOne() it is a potentially-null single document (object), for find() a list of documents (array), for count() the number of documents (a number), for update() the number of documents affected (a number).


When no callback is passed, the [query](https://mongoosejs.com/docs/api.html#query_Query) that is returned can be executed to access any data or errors with the `exec` function. The `exec` function returns a promise that we could handle with `.then` and `.catch`. Alternatlye, it can be passed a callback function as a parameter, and we can handle the promise resolution in that callback function. We can chain additional operations on the query object to filter or sort the results prior to calling `exec`, as we'll see later.

This is unlike our local file implementation, where we persisted all of our data in memory while our app ran, and therefore it made sense for all data operations to be implemented synchronously. We will have to handle this asynchronicity in our app implementation.

## Using Post.find to implement READ

The GET methods provide the READ functionality for our blog posts as we learned in the last lesson. To implement these, we'll use `find`.

To return all blog posts in the database, we would call:

```javascript
Post.find()
```

So we could change our implementation of `getAllPosts` in `utilities.js` to the following. For the moment, we will not worry about filtering and will add this later:

```javascript
// get all posts
// return a query
const getAllPosts = function(req) {
	return Post.find()
}
```

In the controller, we will execute the query that is retured and pass it a callback function. We'll send any error back as a json object so the client can expect json in either case:

posts_controller.js

```javascript
const getPosts = function (req, res) {
    // execute the query from getAllPosts
    getAllPosts(req).exec((err, posts) => {
        if (err) {
            res.status(500);
            res.json({
                error: err.message
            });
        }
        res.send(posts);
    });
};
```

The only thing that is really different here is that we are sending back the response and status in the callback passed to `exec`, instead of sending it back directly from `getPosts` in utilities.

## Sorting the results

It would make sense to sort the blog posts by last modified, so we see the most recent posts first. We can use the `sort` method on the query, before we call `exec`, to do this.

The sort method is passed an object where the key is the field on which to sort, and we indicate an ascending sort with the number `1` and a descending sort with the number `-1`. To sort by `modified_date` with the most recent first, we would use `sort({modified_date: -1})`:

posts_controller.js
```javascript
const getPosts = function (req, res) {
    // execute the query from getAllPosts
    getAllPosts(req).
    sort({
        modified_date: -1
    }).
    exec((err, posts) => {
        if (err) {
            res.status(500);
            res.json({
                error: err.message
            });
        }
        res.send(posts);
    });
};
```

## Testing asynchronous code

Before we continue altering our queries to use the database, let's look at how our `utilities.test.js` will have to change to handle asynchronous function calls.

## Setting up test data

We still need to keep our tests robust by setting up and tearing down data for each test.

In order to use data in the database for testing, we'll have to do a couple of things:

1. Connect to a test database before the tests run
2. Disconnect from the test database after the tests run

We will define a `before` and `after` hook to do these two things. A `before` hook executes once before any test is run, and `after` executes once after all tests complete.

### Connect to test database

Just like we connect to the development database in `app.js`, we will connect to a test database, `blog_app_test`, in the `before` hook:

utilities.test.js

```javascript
// set up connection for test database
const dbConn = "mongodb://localhost/blog_app_test"

// Use done to deal with asynchronous code - done is called when the hooks completes
before(done => connectToDb(done))

// Connect to the test database
function connectToDb(done) {
	// Connect to the database (same as we do in app.js)
	mongoose.connect(
		dbConn,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		},
		err => {
			if (err) {
				console.log("Error connecting to database", err)
				done()
			} else {
				console.log("Connected to database!")
				done()
			}
		}
	)
}
```

Notice that we passed a callback function to the hook function called `done`. This is used by mocha to determine when tests can proceed.

Once all tests are complete, the `after` hook executes and we can use it to disconnect from the database. We must also use the `done` callback here, or the tests will complete, but mocha will just hang when `npm test` is run:

utilities.test.js

```javascript
// Disconnect from the test database after all tests run. Call done to indicate complete.
after(done => {
	mongoose.disconnect(() => done())
})
```

### Setup and tear down for each test

Our `setupData` will execute before each test from the `beforeEach` hook and will create a blog post with `Post.create`. It will return a promise, and `beforeEach` will wait for it to complete with `await` instead of calling `done` so we can save the `post._id`, which is used by some of the tests:

utilities.test.js

```javascript
// Set up test data before each test
beforeEach(async function() {
	// Load a test record in setupData
	// Use await so we can access the postId, which is used by some tests
	let post = await setupData()
	postId = post._id
})

function setupData() {
	let date = Date.now()
	let testPost = {}
	testPost.title = "Test post 1"
	testPost.username = "tester"
	testPost.create_date = date
	testPost.modified_date = date
	testPost.content = "This is the first test post"
	testPost.category = ""
	return Post.create(testPost)
}
```

In `afterEach`, we will delete all documents from posts. Because it is asynchronous, `afterEach` has to call `done()`:

utilities.test.js

```javascript
// Delete test data after each test
afterEach((done) => {
    // Execute the deleteMany query
    tearDownData().exec(() => done());
});

function tearDownData() {
	return Post.deleteMany()
}
```

## Testing the asynchronous utilities functions

Testing of the utilities functions is mostly the same as what we already have. The big difference is that we will make the callback functions for the tests `async`, so we can `await` the resolution of each function call before we assert the results with `expect`. Here is what we need to do, for example to test `getAllPosts`:

utilities.test.js

```javascript
describe('getAllPosts with one post', () => {
    it('should get a post if one exists', async function () {
        let req = {
            query: {}
        };
        await utilities.getAllPosts(req).exec((err, posts) => {
            expect(Object.keys(posts).length).toBe(1);
        });
    });
    it('username of first post should be tester', async function () {
        let req = {
            query: {}
        };
        await utilities.getAllPosts(req).exec((err, posts) => {
            expect(posts[0].username).toBe('tester');
        });

    });
});
```

## Run the test for the new getAllPosts

[We can use _exclusivity_ to run a single test with mocha](https://mochajs.org/#exclusive-tests). We just add `.only` to the test:

utilities.test.js

```javascript
describe.only('getAllPosts with one post', () => {
    it('should get a post if one exists', async function () {
        let req = {
            query: {}
        };
        await utilities.getAllPosts(req).exec((err, posts) => {
            expect(Object.keys(posts).length).toBe(1);
        });
    });
    it('username of first post should be tester', async function () {
        let req = {
            query: {}
        };
        await utilities.getAllPosts(req).exec((err, posts) => {
            expect(posts[0].username).toBe('tester');
        });

    });
});
```

Try running `npm test` to verify the updated test works, and that our mongoose model is also working as expected.

_How do we need to change the others?_

We'll have to make similar changes to the other tests, using `exec` to execute the queries that are returned from the utilities functions, awaiting their completion, and handling the assertion in the callback function passed to `exec`. 

## Using Post.find to get a specific post by id

In `utilities.js`, what change do we need to make to `getPost` to use our Post model to get the data from MongoDB?

Mongoose provides a helper function called `findById` that is perfect for this case:

utilties.js

```javascript
// get post by id
// returns a query
const getPostById = function(req) {
	return Post.findById(req.params.id)
}
```

_What change do we need to make in `posts_controller.js`?_

We need to move the handling of the response to the exec method:

posts_controller.js

```javascript
const getPost = function (req, res) {
    // execute the query from getPostById
    getPostById(req).exec((err, post) => {
        if (err) {
            res.status(404);
            res.send("Post not found");
        }
        res.send(post);
    });
};
```

---

**The difference between res.status and res.sendStatus**

As a side note, we are using res.status to send the 404 status, and then sending a response with res.send. Alternately we could use res.sendStatus(404) to send both the 404 status and [a default message](https://expressjs.com/en/api.html), 'Not found'.

---

## Test getPost

Move the .only to the updated `describe` block for the `getPost` test in `utilities.test.js` and make sure the changed code works.

utilties.test.js

```javascript
describe.only('getPostById', () => {
    it('username of first post should be tester', async function () {
        // Set up req with postId
        let req = {
            params: {
                id: postId
            }
        }
        await utilities.getPostById(req).exec((err, post) => {
            expect(post.username).toBe('tester');
        });
    });
});
```

## Using new and save or Post.create to implement CREATE

Next we will update our implementation of `addPost` in `utitilies.js`, and `makePost` in `posts_controller.js`.

utilties.js

```javascript
// add post
// returns a new Post object
const addPost = function (req) {
    let date = Date.now();
    // Set dates for this new post
    req.body.create_date = date;
    req.body.modified_date = date;
    return new Post(req.body);
};
```

This is much cleaner than our file-persisted implementation! We set the `create_date` and `modified_date` properties on `req.body` to the current datetime, then just instantiate a new Post with `req.body`. This works because `req.body` is just an object with all of the properties for our blog post document, so we just need to pass that object to the Post class constructor.

You can test `addPost` now by moving the `.only` to the `describe` for the `addPost` test. This test will create a post body to pass in req.body, then save the post that is returned. In the callback it will test that the saved post has the expected title:

utilities.test.js
```javascript
// addPost
describe.only('addPost', () => {
    it('should add a post', async function () {
        // define a req object with expected structure
        const req = {
            body: {
                title: "Another post",
                username: "tester",
                content: "This is another blog post!",
                category: ""
            }
        }
        await utilities.addPost(req).save((err, post) => {
            expect(post.title).toBe(req.body.title);
        });
    });
});
```

Notice that we used `save` instead of `exec`. This is because `addPost` returns a new Post object that was instantiated with `new Post`. To persist the associated document to the database, we use `save`.

Contrast this with [what we are doing in our test setup function](#setup-and-tear-down-for-each-test), where we call `Post.create`. If we call `Post.create`, it executes the `save` and returns a promise.

**What about data validation?**

## Data validation for create

We are doing some very basic validation in our schema, checking that all required fields are provided. We can check on what happens by running our test, and omitting a required field (username) in our test document:

utilties.test.js

```javascript
// addPost
describe.only("addPost", () => {
    it('should add a post', async function () {
        // define a req object with expected structure
        const req = {
            body: {
                title: "Another post",
                // username: "tester",
                content: "This is another blog post!",
                category: ""
            }
        }
        await utilities.addPost(req).save((err, post) => {
            expect(post.title).toBe(req.body.title);
        });
    });
})
```

If we run this, we see:

```
 1) addPost
       should add a post:
     ValidationError: Post validation failed: username: Path `username` is required.
```

Is there any other data validation that we should be doing when adding a blog post? This will be left as a challenge at the end of the lesson.

Undo the change to make the `addPost` test pass again.

**Updating the posts_controller.js for CREATE**

Similar to what we had to do in the test, we need to execute the `save` on the Post object returned by `addPost` in utilities, and handle the response in the callback function we pass to it:

posts_controller.js
```javascript
const makePost = function (req, res) {
    // save the Post instance from addPost
    addPost(req).save((err, post) => {
        if (err) {
            res.status(500);
            res.json({
                error: err.message
            });
        }
        res.status(201);
        res.send(post);
    });
};
```

## Using post.findbyIdAndRemove for DELETE

This implementation is really simple using the `findByIdAndRemove` helper function from mongoose:

utilties.js

```javascript
// delete post
// returns a query
const deletePost = function(id) {
	return Post.findByIdAndRemove(id)
}
```

Move the `.only` to the `describe` for the `deletePost` test and make sure it works.

utilities.test.js

```javascript
// deletePost
describe.only('deletePost', () => {
    it('should delete the specified post', async function () {
        await utilities.deletePost(postId).exec();
        await Post.findById(postId).exec((err, post) => {
            expect(post).toBe(null);
        });
    });
});
```

**Updating the posts_controller for DELETE**

Once again, we just have to make a change to exec the query returned by utilties.js and handle the response in a callback function:

posts_controller.js

```javascript
const removePost = function (req, res) {
    // execute the query from deletePost
    deletePost(req.params.id).exec((err) => {
        if (err) {
            res.status(500);
            res.json({
                error: err.message
            });
        }
        res.sendStatus(204);

    });
};
```

## Using Post.findByIdAndUpdate for UPDATE

Another useful mongoose helper function can be used for update. We need to pass three arguments to `Post.findbyIdAndUpdate`:

- the id of the post document to update (in req.params.id)
- the document object properties (in req.body)
- an option `{new:true}`, which indicates we want the exec function to return the post document with the modifications (by default it returns the document prior to any modification)

_Note that you may decide you want findByIdAndUpdate to return the document prior to modification - it depends on your implementation. If so, just leave out the {new:true} option._

utilities.js
```javascript
// update post
// returns a query
const updatePost = function (req) {
    req.body.modified_date = Date.now();
    // use new:true to return the updated post rather than the original post when the query is executed
    return Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    });
};
```

Test this by moving `.only` to the `describe` for the `updatePost` test in utitilities.test.js:

utilties.test.js

```javascript
// updatePost
describe('updatePost', () => {
    it('should update a post', async function () {
        // set up a req object
        const req = {
            params: {
                id: postId
            },
            body: {
                title: "Updated post",
                username: "tester",
                content: "This is an updated blog post!",
                category: ""
            }
        };
        await utilities.updatePost(req).exec((err, post) => {
            expect(post.title).toBe(req.body.title);
        });
    });
});
```

**Updating the posts_controller for UPDATE**

Finally, update the posts_controller to execute the query returned from `updatePost` in utilities:

posts_controller.js

```javascript
const changePost = function (req, res) {
    // execute the query from updatePost
    updatePost(req).exec((err, post) => {
        if (err) {
            res.status(500);
            res.json({
                error: err.message
            });
        }
        res.status(200);
        res.send(post);
    });
};
```

You can clean up the `utilities.js` and `utilities.test.js` to remove any require and exports that were related to our file-persisted implementation. The completed code can be found in the code-complete folder in this repository if you need some guidance.

You can also remove the `.only` from utilities.test.js and make sure all of the tests are passing.

## Challenges

**Adding Validations**

Validations can and should be added to a model's schema to help ensure that good data is provided by the client, and that appropriate messages are sent when there is a problem with the data.

Look at the [documentation on validation for mongoose models](https://mongoosejs.com/docs/4.x/docs/validation.html), and add the following:

1. Add a minimum length for blog post **content**, **username**, and **title**. Pick values you feel are appropriate.
2. Add a maximum length for blog post **content**. Pick a value you feel is appropriate.
3. Read the documentation to find out how you can customize the message when a built-in validation fails. The message we saw when we didn't include a username in the test for `addPost` was a bit strange: `Path`username`is required`. Specify a custom message for the required validations on the Post schema fields that is more user friendly.
4. Add at least one test to utilities.test.js that tests positively that `addPost` fails when a required field is missing. This is called a negative test case, and they can be just as important as positive test cases. Use the [expect documentation](https://jestjs.io/docs/en/expect.html) if you need help choosing an assertion to do this. (There's an example of one way to do this in code-complete, but try to find a way on your own, or a different way).