const mongoose = require('mongoose');
const expect = require('expect');
const utilities = require('../utils/post_utilities');
const Post = require('../models/post');
const {
    connectToDb,
    disconnectFromDb
} = require('./config');


let postId = null;


// Use done to deal with asynchronous code - done is called when the hooks completes
before((done) => {
    // Connect to the database (same as we do in app.js)
    connectToDb(done);
});

after((done) => {
    disconnectFromDb(done);
})

// Set up test data before each test
beforeEach(async function () {
    // Load a test record in setupData
    // Use await so we can access the postId, which is used by some tests
    let post = await setupData();
    postId = post._id;
});

// Delete test data after each test
afterEach((done) => {
    // Execute the deleteMany query
    tearDownData().exec(() => done());
});

describe('getAllPosts with one post', (done) => {
    it('should get a post if one exists', function (done) {
        let req = {
            query: {}
        };
        utilities.getAllPosts(req).exec((err, posts) => {
            expect(Object.keys(posts).length).toBe(1);
            done();
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

describe('getPostById', (done) => {
    it('username of first post should be tester', function (done) {
        // Set up req with postId
        let req = {
            params: {
                id: postId
            }
        }
        utilities.getPostById(req).exec((err, post) => {
            expect(post.username).toBe('tester');
            done();
        });
    });
});

// addPost
describe('addPost', (done) => {
    it('should add a post', function (done) {
        // define a req object with expected structure
        const req = {
            body: {
                title: "Another post",
                username: "tester",
                content: "This is another blog post!",
                category: ""
            }
        }
        utilities.addPost(req).save((err, post) => {
            expect(post.title).toBe(req.body.title);
            done();
        });
    });
    it('should fail if a required field is missing', function (done) {
        // define a req object with missing required field (username)
        const req = {
            body: {
                title: "Another post",
                content: "This is another blog post!",
                category: ""
            }
        }
        utilities.addPost(req).save((err, post) => {
            if (err) {
                expect(err.message).toMatch(/validation/);
                done();
            } else {
                expect(true).toBe(false);
                done();
            }
        });
    });
});

// deletePost
describe('deletePost', (done) => {
    it('should delete the specified post', function (done) {
        utilities.deletePost(postId).exec(() => {
            Post.findById(postId).exec((err, post) => {
                expect(post).toBe(null);
                done();
            });
        });
    });
});

// updatePost
describe('updatePost', (done) => {
    it('should update a post', function (done) {
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
        utilities.updatePost(req).exec((err, post) => {
            expect(post.title).toBe(req.body.title);
            done();
        });
    });
});

// addComment
describe('addComment', (done) => {
    it('should add a comment to a post', (done) => {
        const req = {
            params: {
                postId: postId
            },
            body: {
                username: 'tester2',
                comment: 'This is a comment on the post'
            }
        };
        utilities.addComment(req).then((post) => {
            expect(post.comments.length).toBe(1);
            expect(post.comments[0].username).toBe('tester2');
            done();
        })
    });
});

// Using findByCategory when there is a post in the category
describe('get all posts for a particular category', (done) => {
    it('should return a post if it is in the given category', function (done) {
        // Add a post for a category 'code'
        const date = Date.now();
        const req = {
            body: {
                title: "A categorised post",
                username: "tester",
                content: "This is about code!",
                category: "code",
                create_date: date,
                modified_date: date
            }
        };
        Post.create(req.body).then(() => {
            utilities.getAllPosts({
                query: {
                    category: 'code'
                }
            }).exec((err, posts) => {
                // Expect to only get the post we just added with the 'code' category - not the one from setup
                expect(Object.keys(posts).length).toBe(1);
                expect(posts[0].category).toBe('code');
                done();
            });
        });

    });
});

// Using findByCategory when there is no post in the category
describe('get all posts by category with no posts in category', (done) => {
    it('should return no posts if category not found', function (done) {
        // Add a post for a category 'code'
        const date = Date.now();
        const req = {
            body: {
                title: "A categorised post",
                username: "tester",
                content: "This is about code!",
                category: "code",
                create_date: date,
                modified_date: date
            }
        };
        Post.create(req.body).then(() => {
            utilities.getAllPosts({
                query: {
                    category: 'books'
                }
            }).exec((err, posts) => {
                // Expect to get no posts at all
                expect(Object.keys(posts).length).toBe(0);
                done();
            });
        });
    });
});

// Setup and tear down functions
function setupData() {
    let date = Date.now();
    let testPost = {};
    testPost.title = 'Test post 1';
    testPost.username = 'tester';
    testPost.create_date = date;
    testPost.modified_date = date;
    testPost.content = 'This is the first test post';
    testPost.category = '';
    return Post.create(testPost);
}

function tearDownData() {
    return Post.deleteMany();
}