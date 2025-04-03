const AbandonedBag = require('../models/abandonedBag');
const admin = require("firebase-admin");

async function handleBagNotification(){
    const message = {
      notification: {
       "title":"WARNING!!",
        "body":"Abandoned Bag Detected",
      },
      "token":"",
    };
    try {
      const response = await admin.messaging().send(message);
      console.log(response);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  }
async function handleAbandonedBag(req,res){
    console.log(req.body)
    const{camId, url} = req.body;
    console.log(camId);
    console.log(url);
    const abandonedBag = new AbandonedBag({
        camId: camId,
        url: url,
    })
    await abandonedBag.save();
    await handleBagNotification();
    res.json({"sucess":true}).status(200);
}

async function handleGetAbandonedBag(req,res){
    const abandonedBags = await AbandonedBag.find();
    res.json({"success":true, "data": abandonedBags}).status(200);
}
module.exports = {
    handleAbandonedBag,
    handleGetAbandonedBag,
};