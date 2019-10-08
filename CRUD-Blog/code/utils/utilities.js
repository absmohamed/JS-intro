let dataFile = "../data/blog_posts.json"
let blogPosts = require(dataFile)

const fs = require('fs');

const getAllPosts = function(req) {
	return blogPosts
}

const getPostById = function(req) {
	let post = blogPosts[req.params.id]
	if (post) return post
	else req.error = "Post not found"
}

// Allows flexibility for testing
const setDataFile = function(fileName) {
	dataFile = fileName
	loadData()
}

// Loads data from dataFile
function loadData() {
	blogPosts = require(dataFile)
}

const getDataFileRelativeToApp = function(file) {
	// Remove the ../ from the dataFile path for writing
	// because the writeFile looks for path relative to the app, not utilities.js
	return file.substring(file.lastIndexOf("../") + 3, file.length)
}

const addPost = function(req) {
	try {
		let id = getNextId()
		// set create and modified date to now for a new post
		let date = Date.now()
		blogPosts[id] = {}
		blogPosts[id].title = req.body.title
		blogPosts[id].create_date = date
		blogPosts[id].modified_date = date
		blogPosts[id].username = req.body.username
		blogPosts[id].content = req.body.content
		blogPosts[id].category = req.body.category || ""
		writePosts()
		return blogPosts[id]
	} catch (error) {
		// Pass any errors back to the route handler
		req.error = error
		return null
	}
}

// Returns the next available id for a blog post
function getNextId() {
	let ids = Object.keys(blogPosts)
	let nextId = 1
	if (ids.length != 0) nextId = ids[0]
	for (let i = 1; i < ids.length; i++) {
		if (ids[i] > nextId) nextId = ids[i]
	}

	nextId++
	return nextId
}

// Writes blogPosts to the data file (synchronously)
function writePosts() {
	fs.writeFileSync(getDataFileRelativeToApp(dataFile), JSON.stringify(blogPosts))
}

const deletePost = function(id) {
	if (Object.keys(blogPosts).includes(id)) delete blogPosts[id]
	writePosts()
	return blogPosts
}

const updatePost = function(req) {
	try {
		let id = req.params.id
		if (!blogPosts[id]) throw "Post not found"
        blogPosts[id].title = req.body.title
        blogPosts[id].username = req.body.username
		blogPosts[id].content = req.body.content
		blogPosts[id].modified_date = Date.now()
		writePosts()
		return blogPosts[id]
	} catch (error) {
		req.error = error
		return null
	}
}

module.exports = {
	getAllPosts,
	getPostById,
	setDataFile,
    getDataFileRelativeToApp,
    addPost,
    deletePost,
    updatePost
}