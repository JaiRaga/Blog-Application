const mongoose = require("mongoose");
const { Schema } = mongoose;

const blogsSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
});

const Blog = mongoose.model("Blog", blogsSchema);

module.exports = Blog;
