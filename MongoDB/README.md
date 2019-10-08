# MongoDB

- [MongoDB](#mongodb)
  - [Resources](#resources)
  - [Document Databases vs Relational Databases](#document-databases-vs-relational-databases)
  - [Installing and running MongoDB](#installing-and-running-mongodb)
  - [Mongo shell](#mongo-shell)
    - [use <db>](#use-db)
    - [insert](#insert)
    - [find](#find)
    - [update](#update)
    - [remove](#remove)
  - [Challenge](#challenge)

We will use MongoDB to store data for our Express apps - it's the 'M' in 'MERN'!

MongoDB is a document database, which is unlike the relational database we've learned about in a lot of ways. We'll explore those differences in this lesson, and learn how to use MongoDB and Mongoose to store data for our blog app.

## Resources

- [MongoDB](https://docs.mongodb.com/)
- [Mongo shell](https://docs.mongodb.com/manual/reference/mongo-shell/)
- [MongoDB CRUD operations](https://docs.mongodb.com/manual/crud/)
- [MongoDB documents](https://docs.mongodb.com/manual/core/document/#bson-document-format)

## Document Databases vs Relational Databases

A document database is a type of NoSQL database. Like all things, there are advantages and disadvantages to consider.

One property of a SQL or relational database is that it has a rigid structure. We define the schema explicitly, and if we want to change it (the tables, columns, data types, etc.), we have to migrate the schema. Do you remember this with PostgresSQL and Rails? All those migrations? It could be considered a disadvantage because it does create a lot of extra work when we are developing our solution and making lots of changes, or post release, when we realise we need to make a change, and roll that migration out to all of our customers.

One advantage of defining this structure, however, is how we can easily avoid data duplication through normalisation. We can have a separate table for separate entities in our application, and relate them to each other with foreign keys and associations. This can make it easier and cheaper to store and maintain our data. It also makes it easier to ensure compliance, consistency, and durability.

There are a number of NoSQL database types, including:

- **Document databases** - pair each key with a complex data structure known as a document. Documents can contain many different key-value pairs, or key-array pairs, or even nested documents. (mongoDB)
- **Graph stores** - used to store information about networks of data (think social networks). (Giraph)
- **Key-value stores** - the simplest NoSQL database. Every single item in the database is stored as a key, together with its value. (Redis)
- **Wide-column stores** - optimized for queries over large datasets, and store columns of data together, instead of rows. (Cassandra)

The NoSQL data model addresses several issues that the relational model is not designed to address:

- Large volumes of rapidly changing data and data structures
- Agile sprints, quick schema iteration
- Easy to use Object-oriented programming
- (Usually) better performance.
- Simple scaling

NoSQL databases are built to allow the insertion of data without a predefined schema. Today we will learn about a NoSQL document database called MongoDB.

## Installing and running MongoDB

Just like Postgres before we can start using MongoDB we need to install it on our machines. We will be running the database server on our laptops, just like we did with Postgres.

MAC OSX using Hombrew

https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/

```
brew update
brew install mongodb
```

If this command doesn't work take a look to the link and write its commands

Ubuntu

https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/

Start MongoDB by running

```
//homebrew users
mongod --config /usr/local/etc/mongod.conf

//ubuntu
mongod

//If there was permissions error when just running mongod make sure that there is a directory /data/db and that directory has permission to read & write for the current user


sudo mkdir -p /data/db
sudo chmod 777 /data/db
```

## Mongo shell

Ok now that the mongo database is running we can fire up the MongoDB shell by by opening a new tab in our terminal and running this command. This is similar to running `psql` for Postgres. It provides a command line interface to our database server.

```
mongo
```

To see all of our current databases we can run

```
show dbs
```

If this is the first time you're using your mongoDB instance, you shoudn't see any databases yet. It's easy to create one with `use`.

### use <db>

The `use` command switches the current database to the one specified. If the database doesn't exist, it is created the first time you store data to it!

We will select a database named `coder_academy`.

```javascript
use coder_academy
```

### insert

Lets create our first entry in our database by using the insert() method. We'll create a collection called `students` at the same time.

In a document database, instead of tables with rows, we have _collections_ with _documents_.

```javascript
db.students.insert({ name: "Bobby Jones" })
```

You can think of a document in MongDB as just one big object and a collection as a grouping of those documents. If the collection does not already exist MongoDB will just create one for us. The same goes for all the properties in the document. We don’t need to specify a schema in NoSQL so it allows you to add any property you would like without having to do any pre-setup like we had to in SQL.

Lets insert another student.

```javascript
db.students.insert({ name: "Sally Smith" })
```

### find

Now to get all of our documents from the students collection we can use the find() method.

```javascript
db.students.find()
```

There is a pretty print option in mongo shell, just like we saw in rails db console:

```javascript
db.student.find().pretty()
```

Find if called with no arguments will bring back every document in the collection. We can also give find an object with properties and it will bring back records that have those properties that match the given value.

```javascript
db.students.find({ name: "Sally Smith" })
```

This brings back only one record because that was the only one that matched the query. Lets add another document to the students collection but give it some different properties.

```javascript
db.students.insert({ name: "Jerry Rice", age: 50 })
```

Now if we take a look at all the documents in the students collection we can see that the two we created earlier still have just a name property and the newest document has both name and age and there was no complaints from the database. That's different!

We can even add in more complex data types then just strings and numbers.

```javascript
db.students.insert({ name: "Mary Lamb", sheep: ["Ed Sheeran", "Hops"] })
```

### update

We use update to update a document in a collection. The first required argument to `update` is the query or selection criteria for the document to update. The second required argument is the update to perform. `$set` is the most common, but there are other options. You can read about them [here](https://docs.mongodb.com/manual/reference/method/db.collection.update/)

_!!! **Warning**: The \_id field below will be different for your record._

```javascript
db.students.update({ _id: ObjectId("5bfdc6fe224fa2cf8ef9642e") }, { $set: { name: "Bob Ross" } })
```

### remove

Use `remove` to delete a document. The only required argument is the selection criteria. Optionally you can specify a few different options, the most commonly used of which is `justOne`. The default for `justOne` is false, which results in all documents matching the criteria being deleted.

_!!! **Warning**: The \_id field below will be different for your record._

```javascript
db.students.remove({ _id: ObjectId("5bfddca1224fa2cf8ef96431") })
```

## Challenge

1. Familiarise yourself with the [documentation on MongoDB documents](https://docs.mongodb.com/manual/core/document/#bson-document-format). Make sure you can answer these questions:
   1. What is a BSON object?
   2. What is the primary key for any document?
2. Read the information about [BSON types](https://docs.mongodb.com/manual/reference/bson-types/). Follow the steps under `Timestamps` and `Date`, copying the code shown and pasting into the mongo shell, to learn how to deal with dates and times in MongoDB.
3. Read the documentation for [query selectors](https://docs.mongodb.com/manual/reference/operator/query/). Get familiar with the query selectors available, then look at the documentation on [query documents](https://docs.mongodb.com/manual/tutorial/query-documents/). Follow the example there in the mongo shell. Make sure you understand how to use query selectors to get documents from MongoDB.
