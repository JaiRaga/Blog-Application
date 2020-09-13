const mongoose = require("mongoose");
const { Schema } = mongoose;

const blogsSchema = new Schema(
  {
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
    },
    stars: {
      type: Number
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

blogsSchema.pre("save", async function (next) {
  const blog = this;

  blog.isModified("body")
    ? (blog.readtime = Math.round(blog.body.length / 200))
    : null;

  next();
});

const Blog = mongoose.model("Blog", blogsSchema);

module.exports = Blog;
