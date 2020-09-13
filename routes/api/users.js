const express = require("express");
const User = require("../../models/User");
const auth = require("../../middleware/auth");
const router = express.Router();

router.post("/register", async (req, res) => {
  const user = new User(req.body);
  console.log(req.body, user);
  try {
    await user.save();

    const token = await user.generateAuthToken();

    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send("Unable to Login!");
  }
});

// Get my profile
router.get("/user/me", auth, async (req, res) => {
  res.send(req.user);
});

// Get User Profile
router.get("/user/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("No User Found!");
    res.send(user);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Update User Profile
router.patch("/user", auth, async (req, res) => {
  try {
    const { username, handle, email, avatar } = req.body;
    const user = await req.user.updateUser(username, handle, email, avatar);
    res.send(user);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Logout user
router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();
    res.send("Success..");
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Delete User
router.delete("/user/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
