let dataFile = "../data/blog_posts.json";
let blogPosts = require(dataFile);
const fs = require('fs');
const path = require('path');

// Exported functions

// get all posts
const getAllPosts = function (req) {
  return filter(req.query);;
};

// get post by id
const getPostById = function (req) {
  let post = blogPosts[req.params.id];
  if (post) return post;
  else req.error = 'Post not found';
};

// add post
const addPost = function (req) {
  try {
    let id = getNextId();
    let date = Date.now();
    blogPosts[id] = {};
    blogPosts[id].title = req.body.title;
    blogPosts[id].create_date = date;
    blogPosts[id].modified_date = date;
    blogPosts[id].username = req.body.username;
    blogPosts[id].content = req.body.content;
    blogPosts[id].category = req.body.category || "";
    writePosts();
    return blogPosts[id];
  } catch (error) {
    req.error = error;
    return null;
  }
};

// delete post
const deletePost = function (id) {
  if (Object.keys(blogPosts).includes(id)) delete blogPosts[id];
  writePosts();
  return blogPosts;
};

// update post
const updatePost = function (req) {
  try {
    let id = req.params.id;
    if (!blogPosts[id]) throw 'Post not found';
    blogPosts[id].title = req.body.title;
    blogPosts[id].content = req.body.content;
    blogPosts[id].modified_date = Date.now();
    writePosts();
    return blogPosts[id];
  } catch (error) {
    req.error = error;
    return null;
  }
};

// These exported functions allow flexibility for testing
const setDataFile = function (fileName) {
  dataFile = fileName;
  loadData();
};

const getDataFileRelativeToApp = function (file) {
  // Remove the ../ from the dataFile path for writing
  // because the writeFile looks for path relative to the app, not utilities.js
  return file.substring(file.lastIndexOf('../') + 3, file.length);
};

// Local helper functions

// Returns the next available id for a blog post
function getNextId() {
  let ids = Object.keys(blogPosts);
  let nextId = 1;
  if (ids.length != 0) nextId = ids[0];
  for (let i = 1; i < ids.length; i++) {
    if (ids[i] > nextId) nextId = ids[i];
  }

  nextId++;
  return nextId;
}

// Loads data from dataFile
function loadData() {
  blogPosts = require(dataFile);
}

// Writes blogPosts to the data file (synchronously)
function writePosts() {
  fs.writeFileSync(getDataFileRelativeToApp(dataFile), JSON.stringify(blogPosts));
}

function filter(queryParams) {
  let filteredPosts = {};
  if (queryParams.category && queryParams.category.length > 0) {
    for (let post in blogPosts) {
      if (blogPosts[post].category === queryParams.category)
        Object.assign(filteredPosts, blogPosts[post]);
    }
  } else filteredPosts = blogPosts;

  return filteredPosts;
}

module.exports = {
  getAllPosts,
  getPostById,
  addPost,
  deletePost,
  updatePost,
  setDataFile,
  getDataFileRelativeToApp
}