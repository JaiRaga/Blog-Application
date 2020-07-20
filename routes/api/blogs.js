const express = require("express");
const Blog = require("../../models/Blog");
const router = express.Router();

// Get blogs from all categories
router.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find();
    if (!blogs) return res.status(404).send("No blogs found!");
    res.send(blogs);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Create a blog
router.post("/blogs", async (req, res) => {
  let { title, body, category } = req.body;
  let readtime = Math.round(body.length / 4);

  category = category.replace(" ", "").split(",");

  const blog = new Blog({ title, body, category, readtime });

  try {
    await blog.save();
    res.status(201).send(blog);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Get blog by id
router.get("/blog/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const blog = await Blog.findById(id);
    console.log(blog);

    if (!blog) return res.status(404).send("No such blog exists!");

    res.send(blog);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
