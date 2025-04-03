const express = require("express");
const router = express.Router();
const multer = require('multer');
const {
  handleCamUrl,
  handleGetCamUrl,
  handleNotification,
  handlePersonDetection,
  registerUser,
  registerAuthority,
  handleLogin,
  updateFCMToken,
  handleUpdateLocation,
  handleNotifyNearByOfficers,
} = require("../controllers/user");

const {
  missingReport,
  renderReport,
  handleGetReport,
  handleResolveReport,
  handleListOfUnResolvedReports,
  handleGetMissingPersons,
  handleUserReportList,
} = require("../controllers/report");

const {
  handleAbandonedBag,
  handleGetAbandonedBag,
} = require("../controllers/abandonedBag")

const {
  handlePotentialThreat,
  handleGetPotentialThreat,
} = require("../controllers/potentialThreat")

const storage = multer.diskStorage({});
const upload = multer({storage});

router.route("/login").post(handleLogin)
router.route("/listReport").get(handleGetReport)
router.route("/updateFCMToken").post(updateFCMToken)
router.route("/unResolvedReports").get(handleListOfUnResolvedReports)
router.route("/resolveReport").post(handleResolveReport) // route to resolve report
router.route("/report").post(upload.single('photo'), missingReport)
router.route("/signupWeb").post(registerAuthority);
router.route("/signupApp").post(registerUser);
router.route("/camUrl").post(handleCamUrl);
router.route("/camUrl").get(handleGetCamUrl);
router.route("/notify").post(handleNotification)
router.route("/personDetected").post(handlePersonDetection) // route to receive django request and send notification to super admin
router.route("/locationUpdate").post(handleUpdateLocation)
router.route("/notifyNearByOfficers").post(handleNotifyNearByOfficers)
router.route("/getMissingPersons").get(handleGetMissingPersons) // function to send all reports whose status.isResolved is false
router.route("/abandonedBag").post(handleAbandonedBag)
router.route("/potentialThreat").post(handlePotentialThreat)
router.route("/getBag").get(handleGetAbandonedBag)
router.route("/getPotentialThreat").get(handleGetPotentialThreat)
router.route("/userReportList").get(handleUserReportList)

// router.route("/abandonedBag").post(handleAbandonedBag)

module.exports = router;
