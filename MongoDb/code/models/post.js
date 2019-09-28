const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Post schema
const Post = new Schema({
    title: String,
    create_date: {
        type: Date,
        default: Date.now
    },
    modified_date: {
        type: Date,
        default: Date.now
    },
    user: String,
    content: String,
    category: String
});

module.exports = mongoose.model('Post', Post);