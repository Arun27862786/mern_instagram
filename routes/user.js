const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const { Validator } = require("node-input-validator");
const bodyParser = require("body-parser");
const Post = mongoose.model("Post");
const User = mongoose.model("User");

router.get("/user/:id", requireLogin, async (req, res) => {
  try {
    await User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          res.json({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: "User not found" });
    });
  } catch (error) {
    res.json({ error: error }); 
  }

});

router.get("/following", requireLogin, async (req, res) => {
  try {
    await User.findOne({ _id: req.user._id })
      .populate("following", "_id name pic").select("-email -followers -name -password")
      .then((following) => {
        res.json({ following });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    res.json({ error: error });
  }
});

router.put("/follow", requireLogin, async (req, res) => {
  try {
      User.findByIdAndUpdate(
      req.body.followId,
      {
        $push: { followers: req.user._id },
      },
      {
        new: true,
      },
      (err, result) => {
        if (err) {
          return res.status(422).json({ error: err });
        }
         User.findByIdAndUpdate(
          req.user._id,
          {
            $push: { following: req.body.followId },
          },
          { new: true }
        )
          .select("-password")
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            return res.status(422).json({ error: err });
          });
      }
    );
  } catch (error) {
    res.json({ error: error });     
  }
 
});

router.put("/unfollow", requireLogin, async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.body.unfollowId,
      {
        $pull: { followers: req.user._id },
      },
      {
        new: true,
      },
      (err, result) => {
        if (err) {
          return res.status(422).json({ error: err });
        }
         User.findByIdAndUpdate(
          req.user._id,
          {
            $pull: { following: req.body.unfollowId },
          },
          { new: true }
        )
          .select("-password")
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            return res.status(422).json({ error: err });
          });
      }
    );
  } catch (error) {
    res.json({ error: error });   
  }
 
});

router.put('/updatepic',requireLogin, async (req,res)=>{
  try {
    await User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true},
      (err,result)=>{
       if(err){
           return res.status(422).json({error:"pic cannot post"})
       }
       res.json(result)
  })
  } catch (error) {
    res.json({ error: error });   
  }

})

router.post('/search-users',  async (req,res)=>{
  let userPattern = new RegExp("^"+req.body.query)
  try {
    User.find({email:{$regex:userPattern}})
    .select("_id email")
    .then(user=>{
        res.json({user})
    }).catch(err=>{
        console.log(err)
    })
  } catch (error) {
    res.json({ error: error }); 
  }
 

})

module.exports = router;
