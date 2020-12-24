const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../key");
const { Validator } = require("node-input-validator"); 

// router.get("/", (req, res) => {
//   res.send("hello");
// });

router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    res.status(422).json({ error: "please add all the fields" });
  }
  User.findOne({ email: email })
    .then((saveUser) => {
      if (saveUser) {
        return res
          .status(422)
          .json({ error: "User already exists with that email" });
      }
      bcrypt.hash(password, 12).then((hashedpassword) => {
        const user = new User({
          name,
          email,
          password: hashedpassword,
        });
        user
          .save()
          .then((user) => {
            res.json({ message: "User Save Successfully" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  const v = new Validator(req.body, {
    email: "required|email",
    password: "required",
  });

  v.check().then((matched) => {
    if (!matched) {
     return res.status(422).send(v.errors);
    }
  });
  // if (!email || !password) {
  //   res.status(422).json({ error: "please add all the fields" });
  // }
  User.findOne({ email: email }).then((saveUser) => {
    if (!saveUser) {
      return res.status(422).json({ error: "Invalid email or password" });
    }
    bcrypt
      .compare(password, saveUser.password)
      .then((domatch) => {
        if (domatch) {
          // res.json({ message: "successfully sign in" });
          const token = jwt.sign({ _id: saveUser._id }, JWT_SECRET);
          const{_id,name,email,followers,following} = saveUser
          res.json({ token,user:{_id,name,email,followers,following} });
        } else {
          return res.status(422).json({ error: "Invalid email or password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

module.exports = router;
