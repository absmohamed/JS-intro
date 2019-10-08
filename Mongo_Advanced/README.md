# Document database design and model best practices

When we are using a noSQL or non-relational database like the document database we get with MongoDB, we have to rethink our choices for database design and when to normalise data. In many cases it is better to use a denormalised design. In this lesson we will discuss the data modeling considerations and choices for implementing relations in MongoDB.

In this lesson we will also look at best practices for data model implementations, including the use of the fat controller/skinny model paradigm we learned about with Rails.

- [Document database design and model best practices](#document-database-design-and-model-best-practices)
  - [References](#references)
  - [Normalised vs denormalised data design](#normalised-vs-denormalised-data-design)
    - [Some additional considerations:](#some-additional-considerations)
  - [Adding more relations to our data model](#adding-more-relations-to-our-data-model)
  - [Adding comments to the blog app](#adding-comments-to-the-blog-app)
  - [Adding comments - embedded data vs references](#adding-comments---embedded-data-vs-references)
  - [User by reference](#user-by-reference)
  - [Indexing](#indexing)
  - [Adding comments](#adding-comments)
  - [Schema instance methods and static methods](#schema-instance-methods-and-static-methods)
  - [Implementing findByCategory](#implementing-findbycategory)

## References
- [MongoDB data modeling introduction](https://docs.mongodb.com/manual/core/data-modeling-introduction/)
- [MongoDB data model design - embedded vs references](https://docs.mongodb.com/manual/core/data-model-design/)
- [Indexes in MongoDB](https://docs.mongodb.com/manual/indexes/)


## Normalised vs denormalised data design
We learned about normalisation with Rails and PostgresSQL. In general for relational (SQL) databases, normalisation is preferable because the reduction of duplication makes it easier to maintain data, and requires less storage space. SQL databases are designed to support normalisation, providing atomicity (transactional) writes of connected data in different tables, and performant joining implementations that make lookups across multiple tables fast.

When we are working with a noSQL (non-relational) database like MongoDB, it is often a good practice to denormalise in many cases. MongoDB provides two choices when representing relations between data entities: **embedded data** (denormalised) and **references** (normalised).

In general, it is best to used embedded data when:
- You have [one-to-one relationships between entities](https://docs.mongodb.com/manual/tutorial/model-embedded-one-to-one-relationships-between-documents/#data-modeling-example-one-to-one). 
- You have [one-to-many relationships between entities](https://docs.mongodb.com/manual/tutorial/model-embedded-one-to-many-relationships-between-documents/#data-modeling-example-one-to-many). In these relationships the “many” or child documents always appear with or are viewed in the context of the “one” or parent documents.
- The repeated, embedded data is read more than written, because read performace is faster with embedded documents (only requires a single lookup), but writing the same change to multiple documents, where embedded duplicated data is updated, is slower that writing it to a single document in a separate collection.

### Some additional considerations:
- *Size of data* - The data size limit for a single document in MongoDB is the maximum BSON document size, which is **16 MB**. This has to be considered for embedded data documents. 
- *Atomicity of write operations*. In MongoDB, a single document write is atomic (this means that the write completes for all fields, or no fields are updated). **Embedded data** combines all related data in a single document. Writing multiple documents connected through **references** is not atomic (which means that some documents may be updated and others may not be updated, if for example, some error interrupts the update - which can lead to data inconsistencies).
  - Multi-document transactions are possible, but has a greater performance cost

## Adding more relations to our data model
Our current data model looks like this:

![ERD with posts and users](img/crud-blog-app-erd.png)

We have blog posts and users, and they are related to each other with the username field. A post belongs to a user and one user can have many posts, so we have a one to many relation between the two collections.

## Adding comments to the blog app

If we allow users to make comments on other user's posts, we introduce another one to many relation between post and comments (a comment belongs to a post and a post can have many comments). We also introduce a one to many relation between user and comments (a comment belongs to a user, and a user can make many comments). It also creates a many to many relation between users and posts through comments (a user can comment on many posts, and a post can be commented on by many users).

![ERD with comments](img/crud-blog-app-erd-comments.png)

## Adding comments - embedded data vs references
We need to consider how we will use the data in our application. We need to consider the user stories, when we are writing duplicated data, and when we are reading related data. In these stories (W) indicates write is required, and (R) indicates read is required:

1.  (W) As a user, I can add a blog post
2.  (R) As a user, I can view a single post
3.  (W) As a user, I can update my blog post
4.  (W) As a user, I can delete my blog post
5.  (R) As a user, I can view my blog posts
6.  (R) As a user, I can view all blog posts
7.  (R) As a user, I can view all blog posts by category
8.  (R) As a user, I can view all blog posts by another user
9.  (W) As a user, I can comment on another user's post
10. (R) As a user, I can view a single comment
11. (W) As a user, I can update my comment on a post
12. (W) As a user, I can delete my comment on a post
13. (R) As a user, I can read all comments on a post
14. (W) As an admin, I can delete any post
15. (W) As an admin, I can delete any comment
16. (W) As an admin, I can block/unblock a user
17. (R) As an blocked user, I cannot create, update, or delete posts or comments.

In the cases where we are writing comments(#8,10,11), since each comment on a post is unique, there is no duplicated data, so it makes sense to embed comments in posts:

![Comments embedded in posts](img/crud-blog-app-embedded-comments.png)

## User by reference

We have implemented the relation between posts and users (post creator) and comments and users (comment creator) as references. We refer to the username in the post or comment, and if we needed more information about that user, we would have to look it up. Fortunately, the only user stories that require looking up user data is #15 and #16. Neither require cross-referencing users and specific posts or comments.

For user story #5, a user can view all of their own posts. If we tried to store all posts made by a user as embedded data (and all of the post comments), we would probably extend the single document size limit, and it would only benefit that one case.  Using a relation means that we will have to do a lookup on the posts collection where username matches that of the currently logged in user. This is OK, because it's still just a lookup on a single table. We can imrove performance on that lookup by making the username field on posts an [indexed field](#indexing).

We don't have a user story to view all comments made by a single user, because that isn't a very useful feature. If it were, we would have to consider the difficulty of finding embedded comments made by a single user for every blog post, and we might rethink our design.

## Indexing
There are a lot of indexing options with MongoDB. [Read more about them here](https://docs.mongodb.com/manual/indexes/). We will create a couple of simple indexes on the posts collection to speed up lookups for these user stories:
- (R) As a user, I can view my blog posts
- (R) As a user, I can view all blog posts by another user
- (R) As a user, I can view blog posts by category

This would be faster if we add indexes for `username` and `category`. Let's also assume that we will want to sort these entries by most recently modified first. We could add the following [compound indexes](https://docs.mongodb.com/manual/core/index-compound/):

mongo shell
```javascript
use blog_app
db.posts.createIndex({username: 1, modified_date: -1})
db.posts.createIndex({category: 1, modified_date: -1})
```

The 1 is used when we sort on the indexed field and indicates to sort ascending. To indicate to sort descending, use -1 (like to show the most recent posts first).

These indexes will be used to find posts by `username` or `category`, and also to sort by `modified_date`.

Note that compound indexes should list the field that matches on equality (the field we use in the `find`) first, and the field that is used for sort second to result in the best query optimization results.

## Adding comments
Because a document database has a [flexible schema](https://docs.mongodb.com/manual/core/data-modeling-introduction/), we don't have to do anything to add comments to the posts collection up front. When a comment is added to a post, we can just add it to an array on the post document where the comment is added.

## Schema instance methods and static methods

## Implementing findByCategory

We still haven't implemented support to find posts by category. First let's write a test for it.

When we pass in a query string with `category=name`, we expect that getAllPosts will only return posts for which the category is specified. How can we test that?

We could add a blog post with a specific category, then test that if we call with a query string for that category, we get the expected post.

We could test that if we use a query string for a category that isn't represented, we get back nothing.

Let's add those tests.

utilties.test.js

```javascript
```
