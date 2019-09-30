const mongoose = require('mongoose');
const expect = require('expect');
const utilities = require('../utils/utilities');
const Post = require('../models/post');


let postId = null;

// set up connection for test database
const dbConn = 'mongodb://localhost/blog_app_test'

// Use done to deal with asynchronous code - done is called when the hooks completes
before((done) => {
    // Connect to the database (same as we do in app.js)
    mongoose.connect(dbConn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        },
        (err) => {
            if (err) {
                console.log('Error connecting to database', err);
                done();
            } else {
                console.log('Connected to database!');
                done();
            }
        });
});

after((done) => {
    mongoose.disconnect(() => done())
})

beforeEach(async function () {
    // Load a test record in setupData
    // Use await so we can access the postId, which is used by some tests
    let post = await setupData();
    postId = post._id;
});
afterEach((done) => {
    //   // Empty test file data
    tearDownData().then(() => done());
});

describe('getAllPosts with one post', () => {
    it('should get a post if one exists', async function () {
        let req = {
            query: {}
        };
        let posts = await utilities.getAllPosts(req);
        expect(Object.keys(posts).length).toBe(1);
    });
    it('username of first post should be tester', async function () {
        let req = {
            query: {}
        };
        let posts = await utilities.getAllPosts(req);
        expect(posts[0].user).toBe('tester');
    });
});

describe('getPostById', () => {
    it('username of first post should be tester', async function () {
        // Set up req with postId
        let req = {
            params: {
                id: postId
            }
        }
        let post = await utilities.getPostById(req);
        expect(post.user).toBe('tester');
    });
});

// addPost
describe('addPost', () => {
    it('should add a post', async function () {
        // define a req object with expected structure
        const req = {
            body: {
                title: "Another post",
                user: "tester",
                content: "This is another blog post!",
                category: ""
            }
        }
        let post = await utilities.addPost(req);
        expect(post.title).toBe(req.body.title);
    });
});

// deletePost
describe('deletePost', () => {
    it('should delete the specified post', async function () {
        await utilities.deletePost(postId);
        let post = await Post.findById(postId);
        expect(post).toBe(null);
    });
});

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
                user: "tester",
                content: "This is an updated blog post!",
                category: ""
            }
        };
        let post = await utilities.updatePost(req);
        expect(post.title).toBe(req.body.title);
    });
});

// Setup and tear down functions
function setupData() {
    let date = Date.now();
    let testPost = {};
    testPost.title = 'Test post 1';
    testPost.user = 'tester';
    testPost.create_date = date;
    testPost.modified_date = date;
    testPost.content = 'This is the first test post';
    testPost.category = '';
    return Post.create(testPost);
}

function tearDownData() {
    return Post.deleteMany();
}