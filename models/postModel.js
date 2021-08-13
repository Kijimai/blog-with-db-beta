const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema ({
  title: {
    type: String,
    required: true
  },
  postContent: {
    type: String,
    required: true
  },
  datePosted: {
    type: String,
  }
})

module.exports = mongoose.model('Post', PostSchema) 