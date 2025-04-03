const mongoose = require("mongoose");

const PotentialThreatSchema = new mongoose.Schema({
  camId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'camurl'
  },
  url:{
    type:String,
  }
});

const PotentialThreat = mongoose.model("PotentialThreat", PotentialThreatSchema);

module.exports = PotentialThreat;