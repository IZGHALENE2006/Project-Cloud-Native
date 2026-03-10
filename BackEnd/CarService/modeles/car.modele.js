import mongoose from "mongoose";

const CarSchema = new mongoose.Schema(
{
  AdminId :String,
  brand: {
    type: String,
    required: true,
    trim: true
  },
    image: {
  type: String,
  required: false
},

  model: {
    type: String,
    required: true,
    trim: true
  },

  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },

  color: {
    type: String,
    required: true
  },

  pricePerDay: {
    type: Number,
    required: true
  },

  year: {
    type: Number,
    required: true
  },

  image: {
    type: String,
    required: false
  },

  status: {
    type: String,
    enum: ["Available", "Rented", "Maintenance"],
    default: "Available"
  }

},
{
  timestamps: true
}
);

export default mongoose.model("Cars", CarSchema);