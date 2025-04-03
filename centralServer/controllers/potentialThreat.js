const PotentialThreat = require('../models/potentialThreat');
const admin = require("firebase-admin");

async function handleThreatNotification(){
    const message = {
      notification: {
       "title":"WARNING!!",
        "body":"Potential Threat Detected",
      },
      "token":"", // fcm token of super admin
    };
    try {
      const response = await admin.messaging().send(message);
      console.log(response);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  }
async function handlePotentialThreat(req,res){
    console.log(req.body)
    const{camId, url} = req.body;
    const potentialThreat = new PotentialThreat({
        camId: camId,
        url: url,
    })
    await potentialThreat.save();
    await handleThreatNotification();
    res.json({"sucess":true}).status(200);
}

async function handleGetPotentialThreat(req,res){
    const potentialThreat = await PotentialThreat.find();
    res.json({"success":true, "data": potentialThreat}).status(200);
}
module.exports = {
    handlePotentialThreat,
    handleGetPotentialThreat,
};