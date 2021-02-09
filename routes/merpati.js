const express = require("express");
const { adminMiddleware } = require("../middlewares");
const router = express.Router();
const shortid = require("shortid");
const Pigeon = require("../models/pigeon");
const { text } = require("body-parser");

// @route        GET /merpati
// @desc         get all data pigeon
// @access       public
router.get("/", async (req, res) => {
  const currentPage = req.query.page || 1;
  const perPage = req.query.perPage || 10;
  let totalItems;
  Pigeon.countDocuments()
    .then(async (count) => {
      totalItems = count;
      const totalPage = Math.ceil(count / perPage);
      const merpati = await Pigeon.find({})
        .populate("ownedBy", "-password")
        .populate("parrents")
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
      res.status(200).json({
        totalItems,
        totalPage,
        merpati,
      });
    })
    .catch((err) => console.log(err));
  // const merpati = await Pigeon.find({})
  //   .populate("ownedBy", "-password")
  //   .populate("parrents")
  //   .sort({ createAt: -1 })
  //   .limit(5)
  //   .skip(page * pageLimit - pageLimit);
  // res.status(200).json({
  //   total: merpati.length,
  //   merpati,
  // });
});

// @route        GET /merpati/search
// @desc         get all data pigeon
// @access       public

router.get("/search", async (req, res) => {
  const gender = req.query.gender;
  const q = req.query.q;
  if (gender) {
    const merpati = await Pigeon.find({ gender: gender })
      .populate("ownedBy", "-password")
      .populate("parrents");
    return res.send(merpati);
  }
  if (q) {
    const regex = new RegExp(escapeRegex(q), "gi");
    const merpati = await Pigeon.find({ ring: regex });
    // .populate("ownedBy", "-password")
    // .populate("parrents");
    return res.send(merpati);
  } else {
    const merpati = await Pigeon.find();
    // .populate("ownedBy", "-password")
    // .populate("parrents");
    res.send(merpati);
  }
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
  console.log(body);
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

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;
