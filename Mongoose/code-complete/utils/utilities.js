const Post = require('../models/post');

// Exported functions

// get all posts
// return a promise
const getAllPosts = async function (req) {
    return Post.find();
};

// get post by id
// returns a promise
const getPostById = function (req) {
    return Post.findById(req.params.id);
};

// add post
// returns a promise
const addPost = function (req) {
    let date = Date.now();
    // Set dates for this new post
    req.body.create_date = date;
    req.body.modified_date = date;
    return Post.create(req.body)
};

// delete post
// returns a promise
const deletePost = function (id) {
    return Post.findByIdAndRemove(id);
};

// update post
// returns a promise
const updatePost = function (req) {
    req.body.modified_date = Date.now();
    // use new:true to return the updated post rather than the original post
    return Post.findOneAndUpdate(req.params.id, req.body, {
        new: true
    });
};

// Local helper functions

// filters data based on category
async function filter(queryParams) {
    if (queryParams.category && queryParams.category.length > 0) {
        return await Post.findByCategory(queryParams.category);
    } else return await Post.find({});
}

module.exports = {
    getAllPosts,
    getPostById,
    addPost,
    deletePost,
    updatePost
}