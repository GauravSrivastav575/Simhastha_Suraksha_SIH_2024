const Report = require('../models/report');
const cloudinary = require('../config/cloudinaryConfig');
const axios = require('axios')

async function missingReport(req,res){
    try {
      if (!req.file) {
          return res.status(400).json({ message: 'No file provided' });
      }
      const result = await cloudinary.uploader.upload(req.file.path, {
          folder: '', // Optional folder name in Cloudinary
          use_filename: true,
      });
      // console.log(req.body);
      const {name,reportedBy,isAdmin} = req.body;
      const report = new Report({ name, url: result.secure_url, reportedBy,isAdmin });
      await report.save();
      const payload = {
        "name": name,
        "url": result.secure_url,
        "reportId":report._id // sending report id it will help when a person is recognized
      };
      // Send the POST request to the Django server
      const djangoResponse = await axios.post(
        "http://192.168.137.206:8000/api/add-face/", // link to Django server end point
        payload
      );
      // Handle success response from Django
      if (djangoResponse.status === 200) {
        res.status(200).json({
          message: "Report Registered and sent to Django server successfully!",
          success: true,
          djangoResponse: djangoResponse.data,
        });
      } else {
        res.status(djangoResponse.status).json({
          message: "Report Registered but Failed to get success response from Django server.",
          success: false,
          djangoResponse: djangoResponse.data,
        });
      }
    } catch (error) {
      console.error('Error registering report', error);
      res.status(500).json({ message: 'Error registering report', error });
    }
  }
  

  async function handleGetReport(req,res){
    try {
        const reports = await Report.find({}, "_id name url")
            .sort({ _id: -1 })
            .exec();
        console.log(reports);
        res.status(200).json({
            success: true,
            data: reports,
        });

    } catch (error) {
        // Handle potential errors
        console.error("Error fetching reports:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching reports.",
            error: error.message,
        });
    }
  }
  async function handleListOfUnResolvedReports(req,res){
    try {
        const reports = await Report.find({ "status.isResolved": false, "history": { $exists: true, $ne: [] }})
            .sort({ _id: -1 })
            .exec();
        console.log(reports);
        res.status(200).json({
            success: true,
            data: reports,
        });

    } catch (error) {
        // Handle potential errors
        console.error("Error fetching reports:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching reports.",
            error: error.message,
        });
    }
  }
  async function handleGetMissingPersons(req,res){
    try {
        const reports = await Report.find({ "status.isResolved": false})
            .sort({ _id: -1 })
            .exec();
        console.log(reports);
        res.status(200).json({
            success: true,
            data: reports,
        });

    } catch (error) {
        // Handle potential errors
        console.error("Error fetching reports:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching reports.",
            error: error.message,
        });
    }
  }

  async function handleResolveReport(req, res){
    // function to resolve the report
    try {
      const { reportId } = req.body;
      if (!reportId) {
        return res.status(400).json({ error: "Report ID is required" });
      }
      const updatedReport = await Report.findByIdAndUpdate(
        reportId,
        {
          $set: { 
            "status.isResolved": true, 
            "status.resolvedAt": new Date() 
          } 
        },
        { new: true }
      );
      if (!updatedReport){
        return res.status(404).json({ error: "Report not found" });
      }
      res.status(200).json({ status: true, message: "Report status updated successfully", report: updatedReport });
    } catch (error) {
      console.error("Error updating report status:", error);
      res.status(500).json({ error: "An error occurred while updating the report" });
    }
  }
  
async function handleUserReportList(req,res){
  let id = req.query.id;
  const reports = await Report.find({ reportedBy: id }).sort({ uploadedAt: -1 });
  res.status(200).send({reports,"success":true});
}

module.exports = {
    missingReport,
    handleListOfUnResolvedReports,
    handleGetReport,
    handleResolveReport,
    handleGetMissingPersons,
    handleUserReportList,
};