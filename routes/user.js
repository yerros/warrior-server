const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { adminMiddleware } = require("../middlewares");
require("dotenv").config();
const UserModel = require("../models/user");
const router = express.Router();

// @route        GET /user
// @desc         Show list of user
// @access       private
router.get("/", adminMiddleware, async (req, res) => {
  try {
    const user = await UserModel.find();
    if (user) {
      res.send(user);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route        GET /user/auth
// @desc         auth if user loggedIn
// @access       public
router.get("/auth", adminMiddleware, async (req, res) => {
  try {
    const user = await UserModel.find({ id: req.user.user });
    console.log(user);
    if (user) {
      res.send(user);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route        GET /user/:id
// @desc         Show list of user
// @access       private
router.get("/:id", async (req, res) => {
  try {
    const user = await UserModel.findById({ _id: req.params.id }).populate(
      "orders"
    );
    if (user) {
      res.send(user);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route        POST /user/register
// @desc         Register new user
// @access       public
router.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    let user = await UserModel.findOne({
      email,
    });
    if (user) {
      return res.status(400).json({
        message: "Email address already use",
      });
    }

    user = new UserModel({
      fullName,
      email,
      password,
    });

    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.secretJWT,
      { expiresIn: "24h" },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          status: 200,
          message: "User added succefully",
          token,
          user,
        });
      }
    );
  } catch (error) {
    console.log(req.body);
    res.status(500).json({
      error: "Something error found",
    });
  }
});

// @route        POST /admin/login
// @desc         Login new admin
// @access       public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  //check user
  try {
    let user = await UserModel.findOne({
      email,
    });
    if (!user) {
      return res.status(400).json({
        message: "Email yang anda masukkan salah",
      });
    }
    // check password
    let checkPassword = await bcryptjs.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({
        message: "Password yang anda masukkan salah!",
      });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      process.env.secretJWT,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user,
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "something error found",
    });
  }
});

module.exports = router;
