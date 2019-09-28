const Post = require('../models/post');

// Exported functions

// get all posts
const getAllPosts = async function (req) {
    return filter(req.query);
};

// get post by id
const getPostById = function (req) {
    return Post.findById(req.params.id);
};

// add post
const addPost = function (req) {
    let date = Date.now();
    req.body.create_date = date;
    req.body.modified_date = date;
    return Post.create(req.body)
};

// delete post
const deletePost = function (id) {
    return Post.findOneAndRemove(id);
};

// update post
const updatePost = function (req) {
    req.body.modified_date = Date.now();
    return Post.findOneAndUpdate(req.params.id, req.body, {
        new: true
    });
};

// Local helper functions

// filters data based on category
async function filter(queryParams) {
    let filteredPosts = {};
    let query = {};
    if (queryParams.category && queryParams.category.length > 0) {
        query = {
            category: queryParams.category
        };
    }
    filteredPosts = await Post.find(query);
    return filteredPosts;
}

module.exports = {
    getAllPosts,
    getPostById,
    addPost,
    deletePost,
    updatePost
}