import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema(
  {
    createdBy:{
  type: String,
      required: true,
},
    fullName: {
      type: String,
      required: true,
      trim: true
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true
    },

    drivingLicenseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    nationalId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    address: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Clients", ClientSchema);