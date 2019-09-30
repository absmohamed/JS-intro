# Mongoose

Mongoose is an ODM (object data modelling) node module that we will use to make it easier for our application to interact with the data in MongoDB. This is similar to the way we used ActiveRecord (an ORM - object resource mapping) with our Rails app.

## Resources

- [Mongoose Guide](https://mongoosejs.com/docs/guide.html)

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

Now mongoose creates its models from **schemas**. Schemas allow us to define the fields we are going to store in the database, any validation we would like to apply and default values as well.

Lets create our first schema for holding information about our contacts. Like Rails I like to organise anything to do with my database inside of database directory. Then inside of that I will have a new directory called schemas.

```
directory
├──app.js
├──routes.js
├── database
    └── schemas
        ├── contact_schema.js
├── controllers
    └── contact_controller.js
└── views
    ├── contact.handlebars
    ├── success.handlebars
    └── layouts
        └── main.handlebars
```

contact_schemas.js

```javascript
const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ContactSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	}
})

module.exports = ContactSchema
```

The only thing left to do is generate a model from our schema. I like to seperate out the model generation from the schema itself in case I want to add any instance, class or query methods to the model. Lets generate a models directory and create a new file to generate our contact model.

directory

```
directory
├──app.js
├──routes.js
├── database
    ├── schemas
        ├── contact_schema.js
    └── models
        ├── contact_model.js
├── controllers
    └── contact_controller.js
└── views
    ├── contact.handlebars
    ├── success.handlebars
    └── layouts
        └── main.handlebars
```

contact_model.js

```javascript
const mongoose = require("mongoose")
const ContactSchema = require("./../schemas/contact_schema")

const ContactModel = mongoose.model("contact", ContactSchema)

module.exports = ContactModel
```

All done! Now we can use the model to do any CRUD methods we want. Lets go back to our controller and use our contact model instead of the array.

contact_controller.js

```javascript
const ContactModel = require("./../database/models/contact_model")

function index(req, res) {
	ContactModel.find()
		.then(contacts => {
			return res.json(contacts)
		})
		.catch(err => {
			return res.status(500).send(`Error: ${err}`)
		})
}

function newResource(req, res) {
	return res.render("contact")
}

function create(req, res) {
	let { name, email } = req.body
	let contact = { name, email }
	ContactModel.create(contact)
		.then(contact => {
			return res.render("success")
		})
		.catch(err => {
			return res.status(500).send(`Error: ${err}`)
		})
}

module.exports = {
	index,
	newResource,
	create
}
```

Easy as that. Now we are persisting our data to the database using mongoose. The amazing thing about this is if we want to add in a new field to our contact form for capturing why someone contacted us today call enquiry.
views/contact.handlebars

```html
<form method="post" action="/contacts">
	<div>
		<label>Email</label>
		<input type="email" name="email" />
	</div>
	<div>
		<label>Name</label>
		<input type="text" name="name" />
	</div>
	<div>
		<label>How can we help?</label>
		<textarea name="enquiry"></textarea>
	</div>
	<div>
		<input type="submit" value="Send Contact Form" />
	</div>
</form>
```

_What other files will we need to change?_

- contact_schema
- contact_controller

contact_schema.js

```javascript
const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ContactSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	enquiry: {
		type: String,
		default: ""
	}
})

module.exports = ContactSchema
```

contact_controller.js

```javascript
function create(req, res) {
	let { name, email, enquiry } = req.body
	let contact = { name, email, enquiry }

	ContactModel.create(contact)
		.then(contact => {
			return res.render("success")
		})
		.catch(err => {
			return res.status(500).send(`Error: ${err}`)
		})
}
```

And thats it we are successfully capturing additional information into our database without all the hassle we faced in Rails using a SQL database.
