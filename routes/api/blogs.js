const express = require("express");
const Blog = require("../../models/Blog");
const router = express.Router();

router.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find();
    if (!blogs) return res.status(404).send("No blogs found!");
    res.send(blogs);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

router.post("/blogs", async (req, res) => {
  const blog = new Blog({ ...req.body });

  try {
    await blog.save();
    res.status(201).send(blog);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
