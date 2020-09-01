console.log("sarvamum Krishnan Arpanam");

const express = require("express");
const app = express();

require("./mongoose/mongoose");
const usersRouter = require("./routes/api/users");
const blogsRouter = require("./routes/api/blogs");

app.use(express.json());

const port = process.env.PORT || 9008;

app.use("/api", usersRouter);
app.use("/api", blogsRouter);

app.listen(port, console.log(`Running on Port ${port}`));
