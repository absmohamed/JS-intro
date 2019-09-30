const {
  getAllPosts,
  getPostById,
  addPost,
  deletePost,
  updatePost
} = require('../utils/utilities');

const getPosts = function (req, res) {
  res.send(getAllPosts(req));
};

const getPost = function (req, res) {
  let post = getPostById(req);
  if (post) res.send(post);
  else {
    res.status(404);
    res.send(req.error);
  }
};

const makePost = function (req, res) {
  let post = addPost(req);
  if (post) {
    res.status(201);
    res.send(post);
  } else {
    res.status(500);
    res.send(`Error occurred: ${req.error}`);
  }
};

const removePost = function (req, res) {
  let blogPosts = deletePost(req.params.id);
  res.send(blogPosts);
};

const changePost = function (req, res) {
  let post = updatePost(req);
  if (post) {
    res.status(200);
    res.send(post);
  } else {
    res.status(500);
    res.send(`Error occurred: ${req.error}`);
  }
};

module.exports = {
  getPosts,
  getPost,
  makePost,
  removePost,
  changePost
};