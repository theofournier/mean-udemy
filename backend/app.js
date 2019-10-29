const express = require("express");
const bodeyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Connected to DB"))
  .catch(() => console.log("Connection failed"));

app.use(bodeyParser.json());
app.use(bodeyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS, PUT"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
