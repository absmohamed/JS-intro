const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Post schema
const Post = new Schema({
    title: String,
    create_date: {
        type: Date
    },
    modified_date: {
        type: Date
    },
    user: String,
    content: String,
    category: String
});

Post.statics.findByCategory = function (category) {
    return this.find({
        category: category
    });
}

module.exports = mongoose.model('Post', Post);