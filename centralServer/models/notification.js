const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  from: {
    type: String,
  },
  to: {
    type: String,
  },
  time: {
    type: String,
  },
  issueDate: {
    type: String,
    required: true,
  },
});


const Notification = mongoose.model("notification", NotificationSchema);

module.exports = Notification;
