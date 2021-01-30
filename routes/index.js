const express = require("express");
const router = express.Router();
const { adminMiddleware } = require("../middlewares");

router.get("/", (req, res) => {
  res.send("Hello World");
});

router.get("/status", adminMiddleware, (req, res) => {
  res.send({
    status: "live",
    uptime: "99%",
    date: Date.now(),
  });
});

module.exports = router;
