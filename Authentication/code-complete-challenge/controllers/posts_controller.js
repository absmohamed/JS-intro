const {
    getAllPosts,
    getPostById,
    addPost,
    deletePost,
    updatePost
} = require('../utils/post_utilities');
const {
    userAuthenticated
} = require('../utils/common_utilities');


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
    // Check for error from middleware
    if (req.error) {
        res.status(req.error.status);
        res.send(req.error.message);
    } else {
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
    }
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



const verifyOwner = function (req, res, next) {
    // If post owner isn't currently logged in user, send forbidden
    if (req.user.role === 'admin') {
        console.log('have admin user in middleware')
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

const validUser = function (req, res, next) {
    // If user is blocked, send back an error
    if (req.user.blocked) {
        req.error = {
            message: 'User is blocked',
            status: 403
        };
    }
    next();
}

module.exports = {
    getPosts,
    getPost,
    makePost,
    removePost,
    changePost,
    verifyOwner,
    validUser
};