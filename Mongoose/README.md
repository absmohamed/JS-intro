# Mongoose

Mongoose is an ODM (object data modelling) node module that we will use to make it easier for our application to interact with the data in MongoDB. This is similar to the way we used ActiveRecord (an ORM - object resource mapping) with our Rails app.

- [Mongoose](#mongoose)
  - [Resources](#resources)
  - [Mongoose model and schema](#mongoose-model-and-schema)
  - [Mongoose queries](#mongoose-queries)
    - [All database operations are asynchronous operations](#all-database-operations-are-asynchronous-operations)
  - [Using Post.find to implement READ](#using-postfind-to-implement-read)
  - [Testing asynchronous code](#testing-asynchronous-code)
  - [Setting up test data](#setting-up-test-data)
    - [Connect to test database](#connect-to-test-database)
    - [Setup and tear down for each test](#setup-and-tear-down-for-each-test)
  - [Testing the asynchronous utilities functions](#testing-the-asynchronous-utilities-functions)
  - [Run the test for the new getAllPosts](#run-the-test-for-the-new-getallposts)
  - [Using Post.find to get a specific post by id](#using-postfind-to-get-a-specific-post-by-id)
  - [Test getPost](#test-getpost)
  - [Using Post.create to implement CREATE](#using-postcreate-to-implement-create)
  - [Data validation for create](#data-validation-for-create)
  - [Using post.findbyIdAndRemove for DELETE](#using-postfindbyidandremove-for-delete)
  - [Using Post.findOneAndUpdate for UPDATE](#using-postfindoneandupdate-for-update)

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

One built-in validation we can specify is which of these is required. We'll make `title`, `create_date`, `modified_date`, `username`, and `content` required.

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

As we should expect, all of the functions we execute on the database are asynchronous and return a promise.

_Why would that be?_

When we're querying a database, we are communicating from one server to another to send and retrieve information. When we're developing, these two servers are running on a single host - our laptop. However, when we deploy, these two servers will be separated geographically. Our MongoDB server will be deployed on mlab, and our server application on heroku, for example. These requests could take some time to complete (or may never complete if there are issues), so it makes sense for them to be executed asynchronously. When they return, their promises resolve, and we can handle the data that is returned in `then`. If there is an issue, we can handle the errors in `catch`.

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
// return a promise
const getAllPosts = async function(req) {
	return Post.find()
}
```

In the controller, we will have to handle the promise that is returned, or the error. We'll send the error back as a json object so the client can expect json in either case:

posts_controller.js

```javascript
const getPosts = function(req, res) {
	// getAllPosts returns a promise, or an error
	getAllPosts(req)
		.then(posts => {
			res.send(posts)
		})
		.catch(err => {
			// Errors are passed back from mongodb
			res.status(500)
			res.json({
				error: err.message
			})
		})
}
```

The only thing that is really different here is that we are sending back the response and status in `then` or `done` when the promise settles, instead of sending it back directly from `getPosts`.

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
afterEach(done => {
	//   // Empty test file data
	tearDownData()
		.then(() => done())
		.catch(() => done())
})

function tearDownData() {
	return Post.deleteMany()
}
```

## Testing the asynchronous utilities functions

Testing of the utilities functions is mostly the same as what we already have. The big difference is that we will make the callback functions for the tests `async`, so we can `await` the resolution of each function call before we assert the results with `expect`. Here is what we need to do, for example to test `getAllPosts`:

utilities.test.js

```javascript
describe("getAllPosts with one post", () => {
	it("should get a post if one exists", async function() {
		let req = {
			query: {}
		}
		let posts = await utilities.getAllPosts(req)
		expect(Object.keys(posts).length).toBe(1)
	})
	it("username of first post should be tester", async function() {
		let req = {
			query: {}
		}
		let posts = await utilities.getAllPosts(req)
		expect(posts[0].username).toBe("tester")
	})
})
```

## Run the test for the new getAllPosts

[We can use _exclusivity_ to run a single test with mocha](https://mochajs.org/#exclusive-tests). We just add `.only` to the test:

utilities.test.js

```javascript
describe.only("getAllPosts with one post", () => {
	it("should get a post if one exists", async function() {
		let req = {
			query: {}
		}
		let posts = await utilities.getAllPosts(req)
		expect(Object.keys(posts).length).toBe(1)
	})
	it("username of first post should be tester", async function() {
		let req = {
			query: {}
		}
		let posts = await utilities.getAllPosts(req)
		expect(posts[0].username).toBe("tester")
	})
})
```

Try running `npm test` to verify the updated test works, and that our mongoose model is also working as expected.

_How do we need to change the others?_

Try to make those changes now so we can test as we change the other CRUD implementations.

## Using Post.find to get a specific post by id

In `utilities.js`, what change do we need to make to `getPost` to use our Post model to get the data from MongoDB?

Mongoose provides a helper function called `findById` that is perfect for this case:

utilties.js

```javascript
// get post by id
// returns a promise
const getPostById = function(req) {
	return Post.findById(req.params.id)
}
```

_What change do we need to make in `posts_controller.js`?_

We need to move the handling of the response to the promise resolution methods (`then` and `catch`):

posts_controller.js

```javascript
const getPost = function(req, res) {
	// getPostById returns a promise
	getPostById(req)
		.then(post => {
			res.send(post)
		})
		.catch(err => {
			res.status(404)
			res.send("Post not found")
		})
}
```

---

**The difference between res.status and res.sendStatus**

As a side note, we are using res.status to send the 404 status, and then sending a response with res.send. Alternately we could use res.sendStatus(404) to send both the 404 status and [a default message](https://expressjs.com/en/api.html), 'Not found'.

---

## Test getPost

Move the .only to the updated `describe` block for the `getPost` test in `utilities.test.js` and make sure the changed code works.

utilties.test.js

```javascript
describe.only("getPostById", () => {
	it("username of first post should be tester", async function() {
		// Set up req with postId
		let req = {
			params: {
				id: postId
			}
		}
		let post = await utilities.getPostById(req)
		expect(post.username).toBe("tester")
	})
})
```

## Using Post.create to implement CREATE

Next we will update our implementation of `addPost` in `utitilies.js`, and `makePost` in `posts_controller.js`.

utilties.js

```javascript
// add post
// returns a promise
const addPost = function(req) {
	let date = Date.now()
	// Set dates for this new post
	req.body.create_date = date
	req.body.modified_date = date
	return Post.create(req.body)
}
```

This is much cleaner than our file-persisted implementation! We set the `create_date` and `modified_date` properties on `req.body` to the current datetime, then just call `Post.create` with `req.body`. This works because `req.body` is just an object with all of the properties for our blog post document, so we just need to pass that object to `Post.create`.

You can test `addPost` now by moving the `.only` to the `describe` for the `addPost` test.

**What about data validation?**

## Data validation for create

We are doing some very basic validation in our schema, checking that all required fields are provided. We can check on what happens by running our test, and omitting a required field in our test document:

utilties.test.js

```javascript
// addPost
describe.only("addPost", () => {
	it("should add a post", async function() {
		// define a req object with expected structure
		const req = {
			body: {
				title: "Another post",
				// username: "tester",
				content: "This is another blog post!",
				category: ""
			}
		}
		let post = await utilities.addPost(req)
		expect(post.title).toBe(req.body.title)
	})
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

Similar to what we had to do for the READ routes, we need to handle the response in the promise resolution for the promise returned by the `addPost` function in utilities:

posts_controller.js

```javascript
const makePost = function(req, res) {
	// addPost returns a promise
	addPost(req)
		.then(post => {
			res.status(201)
			res.send(post)
		})
		.catch(err => {
			res.status(500)
			res.json({
				error: err.message
			})
		})
}
```

## Using post.findbyIdAndRemove for DELETE

This implementation is really simple using the `findByIdAndRemove` helper function from mongoose:

utilties.js

```javascript
// delete post
// returns a promise
const deletePost = function(id) {
	return Post.findByIdAndRemove(id)
}
```

Move the `.only` to the `describe` for the `deletePost` test and make sure it works.

utilities.test.js

```javascript
// deletePost
describe.only("deletePost", () => {
	it("should delete the specified post", async function() {
		await utilities.deletePost(postId)
		let post = await Post.findById(postId)
		expect(post).toBe(null)
	})
})
```

**Updating the posts_controller for DELETE**

Once again, we just have to make a change to handle the promise returned by utilties.js:

posts_controller.js

```javascript
const removePost = function(req, res) {
	// deletePost returns a promise
	deletePost(req.params.id)
		.then(() => res.status(204))
		.catch(err => {
			res.status(500)
			res.json({
				error: err.message
			})
		})
}
```

## Using Post.findOneAndUpdate for UPDATE

Another useful mongoose helper function can be used for update. We need to pass three arguments to `Post.findOneAndUpdate`:

- the id of the post document to update (in req.params.id)
- the document object properties (in req.body)
- an option `{new:true}`, which indicates we want the function to return the post document with the modifications (by default it returns the document prior to any modification)

_Note that you may decide you want findOneAndUpdate to return the document prior to modification - it depends on your implementation. If so, just leave out the {new:true} option._

utilities.js

```javascript
// update post
// returns a promise
const updatePost = function(req) {
	// Set the modified_date to now on req.body
	req.body.modified_date = Date.now()
	// use new:true to return the updated post rather than the original post
	return Post.findOneAndUpdate(req.params.id, req.body, {
		new: true
	})
}
```

Test this by moving `.only` to the `describe` for the `updatePost` test in utitilities.test.js:

utilties.test.js

```javascript
// updatePost
describe.only("updatePost", () => {
	it("should update a post", async function() {
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
		}
		let post = await utilities.updatePost(req)
		expect(post.title).toBe(req.body.title)
	})
})
```

**Updating the posts_controller for UPDATE**

Finally, update the posts_controller to handle the promise returned from `updatePost` in utilities:

posts_controller.js

```javascript
const changePost = function(req, res) {
	// updatePost returns a promise
	updatePost(req)
		.then(post => {
			res.status(200)
			res.send(post)
		})
		.catch(err => {
			res.status(500)
			res.json({
				error: err.message
			})
		})
}
```

You can clean up the `utilities.js` and `utilities.test.js` to remove any require and exports that were related to our file-persisted implementation. The completed code can be found in the code-complete folder in this repository if you need some guidance.

You can also remove the `.only` from utilities.test.js and make sure all of the tests are passing.
