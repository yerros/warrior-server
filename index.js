const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");

const connectDB = require("./config/database");

connectDB();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json()); //Make sure u have added this line
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan("dev"));
app.use(cors());

// router
app.use("/v1", require("./routes"));
app.use("/v1/user", require("./routes/user"));
app.use("/v1/merpati", require("./routes/merpati"));

// running the server
app.listen(PORT, () => {
  console.log(`🚀 Server Running on port ${PORT}`);
});
