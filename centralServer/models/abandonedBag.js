const mongoose = require("mongoose");

const AbandonedBagSchema = new mongoose.Schema({
  camId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'camurl'
  },
  url:{
    type:String,
  }
});

const AbandonedBag = mongoose.model("AbandonedBag", AbandonedBagSchema);

module.exports = AbandonedBag;