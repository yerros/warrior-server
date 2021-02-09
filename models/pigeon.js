const mongoose = require("mongoose");
const mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");

const pigeonSchema = mongoose.Schema({
  createAt: {
    type: Date,
    default: Date.now(),
  },
  name: {
    type: String,
  },
  achievement: {
    type: Array,
  },
  picture: {
    type: String,
  },
  dob: {
    type: Date,
  },
  ring: {
    type: String,
  },
  ppmbsi: {
    type: String,
  },
  color: {
    type: String,
  },
  gender: {
    type: String,
  },
  shortid: {
    type: String,
  },
  parrents: [
    {
      type: mongoose.Types.ObjectId,
      ref: "pigeon",
    },
  ],
  ownedBy: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
});

pigeonSchema.index({ name: "text", ring: "text" });

pigeonSchema.plugin(mongoose_fuzzy_searching, { fields: ["ring", "name"] });

module.exports = mongoose.model("pigeon", pigeonSchema);
