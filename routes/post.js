const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const { Validator } = require("node-input-validator");
const bodyParser = require("body-parser");
const Post = mongoose.model("Post");
const User = mongoose.model("User");

router.post("/allpost", requireLogin, async (req, res) => {
  const query1 = await User.find({ followers: req.user._id })
    .select("_id")
    .distinct("_id");
     

  query1.push(req.user._id);
  const query2 = await Post.find({ "comments.postedBy": req.user._id })
    .select("_id")
    .distinct("_id");
  const query = await Post.find({ likes: req.user._id })
    .select("postedBy -_id")
    .distinct("postedBy");

  // const queryw = await Post.find().where('title').all(['user','user2','user3']);
  const query3 = query1.concat(query);
  const query5 = query3.concat(query2);

  Post.find()
    .where("postedBy")
    .in(query1)
    .sort({ createdAt: -1 })
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy", "_id name pic")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/getsubpost", requireLogin, async (req, res) => {
  try {
    await Post.find({ postedBy: { $in: req.user.following } })
      .sort({ _id: -1 })
      .populate("postedBy", "_id name pic")
      .populate("comments.postedBy", "_id name pic")
      .then((posts) => {
        res.json({ posts });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    res.json({ error: error });
  }
});

router.post("/createpost", requireLogin, async (req, res, next) => {
  const { title, body, pic } = req.body;
  if (!title || !body || !pic) {
    return res.status(422).json({ error: "please add all the fields" });
  }
  try {
    const post = await new Post({
      title,
      body,
      photo: pic,
      postedBy: req.user,
    });
    post
      .save()
      .then((result) => {
        return res.json({ post: result });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    res.json({ error: error });
  }
});

router.post("/mypost", requireLogin, async (req, res) => {
  try {
    await Post.find({ postedBy: req.user._id })
      .sort({ _id: -1 })
      .populate("postedBy", "_id name")
      .then((mypost) => {
        res.json({ mypost });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    res.json({ error: error });
  }
});

router.put("/like", requireLogin, async (req, res) => {
  try {
    await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { likes: req.user._id },
      },
      {
        new: true,
      }
    ).exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        return res.json(result);
      }
    });
  } catch (error) {
    res.json({ error: error });
  }
});

router.put("/unlike", requireLogin, async (req, res) => {
  try {
    await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { likes: req.user._id },
      },
      {
        new: true,
      }
    ).exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        return res.json(result);
      }
    });
  } catch (error) {
    res.json({ error: error });
  }
});

router.put("/comment", requireLogin, async (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
    createdAt: Date.now(),
  };
  try {
    await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { comments: comment },
      },
      {
        new: true,
      }
    )
      .populate("postedBy.postedBy", "_id name")
      .populate("comments.postedBy", "_id name")
      .exec((err, result) => {
        if (err) {
          console.log(err);
          return res.status(422).json({ error: err });
        } else {
          return res.json(result);
        }
      });
  } catch (error) {
    res.json({ error: error });
  }
});

router.delete("/deletepost/:postId", requireLogin, async (req, res) => {
  try {
    await Post.findOne({ _id: req.params.postId })
      .populate("postedBy", "_id")
      .exec((err, post) => {
        if (err || !post) {
          return res.status(422).json({ error: err });
        }
        if (post.postedBy._id.toString() === req.user._id.toString()) {
          post
            .remove()
            .then((result) => {
              res.json(result);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
  } catch (error) {
    res.json({ error: error });
  }
});

module.exports = router;
