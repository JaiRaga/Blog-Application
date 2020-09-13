const express = require("express");
const Blog = require("../../models/Blog");
const auth = require("../../middleware/auth");
const router = express.Router();

// Create a blog
router.post("/blogs", auth, async (req, res) => {
  let { title, body, category, stars } = req.body;
  const owner = req.user._id;
  // let readtime = Math.round(body.length / 200);
  if (!stars) stars = 4;

  category = category.toLowerCase().replace(" ", "").split(",");

  const blog = new Blog({ title, body, category, stars, owner });

  try {
    await blog.save();
    res.status(201).send(blog);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Get blogs from all categories
router.get("/blogs", auth, async (req, res) => {
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
router.get("/blog/:id", auth, async (req, res) => {
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

// Update blog
router.patch("/blog/:id", auth, async (req, res) => {
  const incomingUpdates = Object.keys(req.body),
    allowedUpdates = ["title", "body", "category", "stars"];

  let approvedUpdates = [],
    disapprovedUpdates = [];

  incomingUpdates.forEach((update) =>
    allowedUpdates.indexOf(update) !== -1
      ? approvedUpdates.push(update)
      : disapprovedUpdates.push(update)
  );

  console.log("Approved", approvedUpdates);
  console.log("Disapproved", disapprovedUpdates);

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).send("No Such Blog Exists!");

    req.body.category = req.body.category
      .toLowerCase()
      .replace(" ", "")
      .split(",");

    approvedUpdates.forEach((update) => (blog[update] = req.body[update]));
    await blog.save();

    res.send(blog);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Delete a Blog
router.delete("/blog/:id", auth, async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!blog) return res.status(404).send("No Blog Found!");

    res.send(blog);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
