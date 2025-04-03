const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");

const CamUrlSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  url: {
    type: String,
    required:true,
  },
  lat:{
    type: Number,
  },
  long:{
    type: Number,
  },
});

// CamUrlSchema.pre("save", async function (next) {
//   try {
//     this.url = await bcrypt.hash(this.url, 12);
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

const CamUrl = mongoose.model("camurl", CamUrlSchema);

module.exports = CamUrl;
