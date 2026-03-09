import mongoose from "mongoose";

const agencySchema = new mongoose.Schema(
{
  agencyName: {
    type: String,
    required: true,
  },

  managerName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  phoneNumber: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true
  },

  city: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  }

},
{
  timestamps: true
}
);

export default mongoose.model("Admins", agencySchema);