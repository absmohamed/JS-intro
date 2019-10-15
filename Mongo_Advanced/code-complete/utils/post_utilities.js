const Post = require('../models/post');

// Exported functions

// get all posts
// return a query
const getAllPosts = function (req) {
    // If we're passed a category in the query, filter on that category
    if (req.query.category) return Post.findByCategory(req.query.category);
    else return Post.find();
};

// get post by id
// returns a query
const getPostById = function (req) {
    return Post.findById(req.params.id);
};

// add post
// returns a Post object
const addPost = function (req) {
    let date = Date.now();
    // Set dates for this new post
    req.body.create_date = date;
    req.body.modified_date = date;
    return new Post(req.body)
};

// delete post
// returns a query
const deletePost = function (id) {
    return Post.findByIdAndRemove(id);
};

// update post
// returns a query
const updatePost = function (req) {
    req.body.modified_date = Date.now();
    // use new:true to return the updated post rather than the original post
    return Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    });
};

// Add a comment to a post
// returns a promise (because it is async)
const addComment = async function (req) {
    let post = await Post.findById(req.params.postId);

    let newComment = {
        username: req.body.username,
        comment: req.body.comment
    };
    post.comments.push(newComment);
    return Post.findByIdAndUpdate(req.params.postId, post, {
        new: true
    });
}

module.exports = {
    getAllPosts,
    getPostById,
    addPost,
    deletePost,
    updatePost,
    addComment
}