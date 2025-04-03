const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
      type: String,  
    },
    uniqueId:{
      type:String,
    },
    firebaseToken:{
      type:String,
    },
    contact:{
      type:String,
      required:true,
      unique:true
    },
    isLocationPermissionGranted:{
      type:Boolean,
      default:false
    },
    isBackgroundLocationPermissionGranted:{
      type:Boolean,
      default:false
    },
    isNotificationPermissionGranted:{
      type:Boolean,
      default:false
    },
    isAuthority:{
      type:Boolean,
      default:false
    },
    password:{
      type:String,
      required:true,
    },
});


module.exports = mongoose.model('User',UserSchema);