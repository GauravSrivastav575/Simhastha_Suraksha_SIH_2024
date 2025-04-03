const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  reportedBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isAdmin:{
    type:Boolean,
    default:false
  },
  status:{
    isResolved:{
      type:Boolean,
      default:false
    },
    resolvedAt:{
      type: Date
    }
  },
  isNotify:{
    type:Boolean,
    default:false
  },
  history:[{
    camId:{
      type:String
    },
    url:{
      type:String
    },
    detectedAt:{
      type:Date
    }
  }],
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  
});


const Report = mongoose.model("report", ReportSchema);

module.exports = Report;
