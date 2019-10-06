const {
    getAllPosts,
    getPostById,
    addPost,
    deletePost,
    updatePost
} = require('../utils/utilities');

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

module.exports = {
    getPosts,
    getPost,
    makePost,
    removePost,
    changePost
};