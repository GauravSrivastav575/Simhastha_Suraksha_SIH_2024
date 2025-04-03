const User = require("../models/user");
const axios = require("axios");
const CamUrl = require("../models/camurl");
const Report = require("../models/report");
const Location = require("../models/location");
const cloudinary = require("../config/cloudinaryConfig");
const bcrypt = require("bcrypt");
const admin = require("firebase-admin");

async function handleGetCamUrl(req, res) {
  const ipIds = await CamUrl.find().select("url");
  return res.json({ ipIds, success: true });
}

async function handleNotification(req, res){
  const { token, title, body, data } = req.body;
  console.log(req.body, 1111);
  const message = {
    notification: {
      title,
      body,
    },
    // data,
    token, // Target device FCM token
  };
  try {
    const response = await admin.messaging().send(message);
    res
      .status(200)
      .json({ message: "Notification sent successfully!", response });
  } catch (error) {
    console.error("Error sending notification:", error);
    res
      .status(500)
      .json({ error: "Failed to send notification", details: error });
  }
}

async function handleCamUrl(req, res){
  try{
    const { name, url, lat, long } = req.body;
    const camUrl = new CamUrl({
      name,
      url,
      lat,
      long,
    });
    await camUrl.save();
    const payload = {
      name: name,
      url: url,
      camId: camUrl._id, // sending camera id it will help when a person is recognized
    };
    // Send the POST request to the Django server
    try {
      const djangoResponse = await axios.post(
        "http://192.168.123.222:8000/api/add-cam/",
        // "http://192.168.45.222:8000/api/add-cam/",
        payload
      );
      if (djangoResponse.status === 200) {
        res.status(200).json({
          message: "Camera saved and sent to Django server successfully!",
          success: true,
          djangoResponse: djangoResponse.data,
        });
      } else {
        res.status(djangoResponse.status).json({
          message:
            "Camera saved but Failed to get success response from Django server.",
          success: false,
          djangoResponse: djangoResponse.data,
        });
      }
    } catch (e) {
      res.status(500).json({
        message: "Camera saved and can't sent to Django server ",
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Camera can't be added. An error occurred while processing the request.",
      error: error.message,
    });
  }
}

async function registerUser(req, res) {
  console.log(req.body);
  try {
    const {
      name,
      firebaseToken,
      isLocationPermissionGranted,
      isBackgroundLocationPermissionGranted,
      isNotificationPermissionGranted,
      contact,
      password,
    } = req.body;
    const user = new User({
      name: name,
      firebaseToken,
      isLocationPermissionGranted,
      isBackgroundLocationPermissionGranted,
      isNotificationPermissionGranted,
      contact,
      password,
    });
    await user.save();
    res.status(200).json({
      Success: "true",
      userId: user._id,
      role: user.isAuthority,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ Success: "false", message: e });
  }
}

async function registerAuthority(req, res) {
  try {
    const { name, uniqueId, contact, password } = req.body;
    const user = new User({
      name: name,
      uniqueId: uniqueId,
      contact: contact,
      password: password,
      isAuthority: true,
    });
    await user.save();
    res.status(200).json({ Success: "true" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ Success: "false" });
  }
}

async function handleLogin(req, res) {
  console.log(req.body);
  try {
    const {
      contact,
      firebaseToken,
      isLocationPermissionGranted,
      isBackgroundLocationPermissionGranted,
      isNotificationPermissionGranted,
      password,
    } = req.body;
    const user = await User.findOne({ contact });
    if (user) {
      if (user.password === password) {
        await User.findByIdAndUpdate(
          user._id,
          {
            $set: {
              isLocationPermissionGranted,
              isNotificationPermissionGranted,
              isBackgroundLocationPermissionGranted,
              firebaseToken,
            },
          },
          { new: true }
        );
        res.status(200).json({
          Success: true,
          userId: user._id,
          isAuthority: user.isAuthority,
        });
      } else {
        res
          .status(401)
          .json({ Success: false, message: "Invalid number or password" });
      }
    } else {
      res.status(404).json({ Success: false, message: "User not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ Success: false, message: "Some error occured!!" });
  }
}

async function updateFCMToken(req, res) {
  const { userId, firebaseToken } = req.body;
  console.log(req.body);
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { firebaseToken } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ message: "FCM token updated successfully.", user });
  } catch (error) {
    console.error("Error updating FCM token:", error);
    res.status(500).json({ message: "Internal Server Error.", error });
  }
}
async function handleUpdateLocation(req, res) {
  console.log(req.body);
  const { userId, location } = req.body;
  try {
    const user = await Location.findOne({ userId: userId });
    if (!user) {
      const loc = new Location({
        userId,
        location,
      });
      await loc.save();
    } else {
      await Location.updateOne(
        { userId: userId },
        { $set: { location: location } },
        { new: true }
      );
    }
    res.status(200).json({ success: true });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: e.message });
  }
}

async function handlePersonDetection(req, res){
  // this function handle the request from django and send request for verification to react
  const token = "";  // fcm token of super admin
  try {
    const { reportId, camId, url } = req.body;
    if (!reportId || !camId || !url) {
      return res.status(400).json({ error: "reportId, camId, and url are required" });
    }
    let report = await Report.findById(reportId);
    if (!report){
      return res.status(404).json({ error: "Report not found" });
    }
    // Add history entry
    report.history.push({
      camId,
      url,
      detectedAt: new Date(),
    });
    await report.save();
    // console.log(report);
    reportt = await Report.findById(reportId);
   
    const notificationPayload2 = {
      "token":token,
      "title": "Person detected",
      "body": "at CAM1",
    };
   
    await handleNotification(
      { body: notificationPayload2 }, // Mock req object for testing
      { status: () => ({ json: console.log }) } // Mock res object for testing
    );
    res.status(200).json({ message: "History added successfully", report });
  } catch (error) {
    console.error("Error adding history:", error);
    res.status(500).json({ error: "An error occurred while adding history" });
  }
}

async function handleNotifyNearByOfficers(req,res){
  const{reportId} = req.body
  const report = await Report.findByIdAndUpdate(reportId, { isNotify: true }, { new: true }); 
  const lastHistory = report.history[report.history.length - 1]
  const cam = await CamUrl.findById(lastHistory.camId);
  const lat = cam.lat;
  const long = cam.long;
  const RADIUS_IN_METERS = 75; // Define the radius
  try {
    const officers = await Location.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [long, lat], // GeoJSON format requires [longitude, latitude]
          },
          $maxDistance: RADIUS_IN_METERS, // Specify radius in meters
        },
      },
    });
    console.log(officers)
    if (!officers){
      res
        .status(404)
        .json({ message: "No officers found in the specified location." });
    } else{
      // console.log(report);
      const title = "Person Detected";
      const body = "Person Detected at --camera";
      // console.log(reportedBy)
      const result = notifyNearbyOfficers(officers, title, body, report);
      if (result) {
        res.status(200).json({ success: true });
      } else {
        res.status(500).json({ success: false });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }

}

async function notifyNearbyOfficers(officers, title, body, report){
  try {
    const reportedBy = report.reportedBy
    const user = await User.findById(reportedBy);
    // console.log(reportedBy);
    if (!user.isAuthority){
      const token = await getTokenByUserId(reportedBy); // Fetch FCM token for the officer
      if (token) {
        const notificationPayload = {
          token,
          title,
          body,
          report,
        };
        await handleNotification(
          { body: notificationPayload }, 
          { status: () => ({ json: console.log }) }
        );
      } else {
        console.log(`No token found for userId: ${reportedBy}`);
      }
    }
    for (const officer of officers) {
      const token = await getTokenByUserId(officer.userId); // Fetch FCM token for the officer
      if (token) {
        const notificationPayload = {
          token,
          title,
          body,
          report,
        };
        await handleNotification(
          { body: notificationPayload }, 
          { status: () => ({ json: console.log }) }
        );
      } else {
        console.log(`No token found for userId: ${officer.userId}`);
      }
    }

    console.log("All notifications sent successfully!");
    return true;
  } catch (err) {
    console.error("Error while sending notifications:", err);
    return false;
  }
}

async function getTokenByUserId(userId) {
  try {
    const user = await User.findById(userId).select("firebaseToken"); // Fetch only the firebaseToken field
    return user ? user.firebaseToken : null;
  } catch (err) {
    console.error(`Error fetching token for userId: ${userId}`, err);
    return null;
  }
}

module.exports = {
  handleCamUrl,
  handleGetCamUrl,
  handleNotification,
  handlePersonDetection,
  registerUser,
  registerAuthority,
  updateFCMToken,
  handleLogin,
  handleUpdateLocation,
  handleNotifyNearByOfficers,
};
