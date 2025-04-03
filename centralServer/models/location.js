const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
});

LocationSchema.index({ location: '2dsphere' });
const Report = mongoose.model("location", LocationSchema);

module.exports = Report;
