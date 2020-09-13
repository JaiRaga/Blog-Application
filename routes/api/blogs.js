const express = require("express");
const Blog = require("../../models/Blog");
const router = express.Router();

// Create a blog
router.post("/blogs", async (req, res) => {
  let { title, body, category, stars } = req.body;
  let readtime = Math.round(body.length / 200);
  if (!stars) stars = 4;

  category = category.toLowerCase().replace(" ", "").split(",");

  const blog = new Blog({ title, body, category, readtime, stars });

  try {
    await blog.save();
    res.status(201).send(blog);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Get blogs from all categories
router.get("/blogs", async (req, res) => {
  let category = [],
    sort = {},
    limit = parseInt(req.query.limit),
    skip = parseInt(req.query.skip),
    page = parseInt(req.query.page);

  if (req.query.category) {
    // console.log(match);
    category = req.query.category.toLowerCase().split(",");
    console.log(category);
  }
  if (req.query.sortBy) {
    const chunk = req.query.sortBy.split(":");
    sort[chunk[0]] = chunk[1];
    console.log(chunk, sort);
  }

  try {
    console.log(1);
    const blogs = await Blog.find({ category: { $all: category } })
      .limit(limit)
      .skip(page * skip)
      .sort({
        ...sort
      });

    console.log(2);
    console.log("Blogs", blogs);
    if (!blogs) return res.status(404).send("No blogs found!");
    res.send(blogs);
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
