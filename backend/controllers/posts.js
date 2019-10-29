const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully",
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed"
      });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then(document => {
      if (!document) {
        res.status(404).json({ message: "Post not found" });
      } else {
        res.status(200).json({
          message: "Post fetched successfully",
          post: document
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching post failed"
      });
    });
};

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creatorId: req.userData.id
  });
  post
    .save()
    .then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          id: createdPost._id,
          title: createdPost.title,
          content: createdPost.title,
          imagePath: createdPost.imagePath,
          creatorId: createdPost.creatorId
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a post failed"
      });
    });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath,
    creatorId: req.userData.id
  });
  Post.updateOne({ _id: req.params.id, creatorId: req.userData.id }, post)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Post updated successfully" });
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Updating a post failed"
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creatorId: req.userData.id })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Post deleted" });
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting a post failed"
      });
    });
};
