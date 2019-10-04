const {
    getAllPosts,
    getPostById,
    addPost,
    deletePost,
    updatePost
} = require('../utils/utilities');

const getPosts = function (req, res) {
    // getAllPosts returns a promise
    getAllPosts(req).then((posts) => {
        res.send(posts);
    }).catch((err) => {
        // Errors are passed back from mongodb
        res.status(500);
        res.json({
            error: err.message
        });
    });
};

const getPost = function (req, res) {
    // getPostById returns a promise
    getPostById(req).then((post) => {
        res.send(post);
    }).catch((err) => {
        res.status(404);
        res.send("Post not found");
    });
};

const makePost = function (req, res) {
    // addPost returns a promise
    addPost(req).then((post) => {
        res.status(201);
        res.send(post);
    }).catch((err) => {
        res.status(500);
        res.json({
            error: err.message
        });
    });
};

const removePost = function (req, res) {
    // deletePost returns a promise
    deletePost(req.params.id).then(() => res.sendStatus(204))
        .catch((err) => {
            res.status(500);
            res.json({
                error: err.message
            })
        });
};

const changePost = function (req, res) {
    // updatePost returns a promise
    updatePost(req).then((post) => {
        res.status(200);
        res.send(post);
    }).catch((err) => {
        res.status(500);
        res.json({
            error: err.message
        })
    });
};

module.exports = {
    getPosts,
    getPost,
    makePost,
    removePost,
    changePost
};