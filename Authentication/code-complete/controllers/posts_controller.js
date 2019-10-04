const {
    getAllPosts,
    getPostById,
    addPost,
    deletePost,
    updatePost
} = require('../utils/utilties');


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
    // add the username from req.user
    req.body.username = req.user.username;
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
    // Check for error from middleware
    if (req.error) {
        res.status(req.error.status);
        res.send(req.error.message);
    } else {
        // deletePost returns a promise
        deletePost(req.params.id).then(() => res.sendStatus(204))
            .catch((err) => {
                res.status(500);
                res.json({
                    error: err.message
                })
            });
    }
};

const changePost = function (req, res) {
    // Check for error from middleware
    if (req.error) {
        res.status(req.error.status);
        res.send(req.error.message);
    } else {
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
    }
};

// middleware functions
const userAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.sendStatus(403);
    }
}

const verifyOwner = function (req, res, next) {
    // If post owner isn't currently logged in user, send forbidden

    if (req.user.role === 'admin') {
        next();
    } else {
        getPostById(req).then((post) => {
                if (req.user.username !== post.username) {
                    req.error = {
                        message: 'You do not have permission to modify this post',
                        status: 403
                    };
                }
                next();
            })
            .catch((err) => {
                req.error = {
                    message: 'Post not found',
                    status: 404
                }
                next();
            });
    }
}

module.exports = {
    getPosts,
    getPost,
    makePost,
    removePost,
    changePost,
    userAuthenticated,
    verifyOwner
};