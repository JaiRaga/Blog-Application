const mongoose = require("mongoose");
const { Schema } = mongoose;

const blogsSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    required: true,
    trim: true
  },
  category: [{ type: String, required: true, trim: true }],
  readtime: {
    type: Number
  }
});

const Blog = mongoose.model("Blog", blogsSchema);

module.exports = Blog;
