const express = require("express");
const { adminMiddleware } = require("../middlewares");
const router = express.Router();
const shortid = require("shortid");
const Pigeon = require("../models/pigeon");

// @route        GET /merpati
// @desc         get all data pigeon
// @access       public
router.get("/", async (req, res) => {
  const merpati = await Pigeon.find()
    .populate("ownedBy", "-password")
    .populate("parrents");
  res.send(merpati);
});

// @route        GET /merpati/:shortid
// @desc         get all data pigeon
// @access       public
router.get("/:shortid", async (req, res) => {
  const id = req.params.shortid;
  const merpati = await Pigeon.findOne({ shortid: id })
    .populate("ownedBy", "-password")
    .populate({
      path: "parrents",
      populate: {
        path: "parrents",
      },
    });
  res.send(merpati);
});

// @route        POST /merpati
// @desc         get all data pigeon
// @access       private
router.post("/", adminMiddleware, async (req, res) => {
  let body = req.body;
  body["ownedBy"] = req.user.id;
  body["shortid"] = shortid.generate();
  const merpati = new Pigeon(body);
  await merpati.save();
  res.send(merpati);
});

// @route        PUT /merpati/:shortid
// @desc         edit data pigeon
// @access       private
router.put("/:shortid", adminMiddleware, async (req, res) => {
  const id = req.params.shortid;
  const body = req.body;
  try {
    if (body) {
      let merpati = await Pigeon.findOneAndUpdate(
        { shortid: id },
        { $set: body }
      );
      res.send(merpati);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route        DELETE /merpati/:shortid
// @desc         Delete Pigeon
// @access       private
router.delete("/:shortid", adminMiddleware, async (req, res) => {
  try {
    const deleted = await Pigeon.findOneAndDelete({
      shortid: req.params.shortid,
    });
    if (!deleted) {
      return res.status(404).json({
        message: "property not found",
      });
    }
    res.status(200).json({
      msg: "Delete Success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error 2");
  }
});

module.exports = router;
