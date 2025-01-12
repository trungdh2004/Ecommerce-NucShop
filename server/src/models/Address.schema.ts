import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    is_main: {
      type: Boolean,
      required: true,
      default: false,
    },
    phone: {
      type: String,
      min: 10,
      required: true,
    },
    city: {
      type: {
        name: {
          type: String,
        },
        idProvince: String,
      },
      required: true,
    },
    district: {
      type: {
        name: String,
        idProvince: String,
        idDistrict: String,
      },
      required: true,
    },
    commune: {
      type: {
        name: String,
        idCommune: String,
        idDistrict: String,
      },
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    detailAddress: {
      type: String,
      required: true,
    },
    location: {
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true }
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

AddressSchema.index({ location: '2dsphere' });


const AddressModel = mongoose.model("address", AddressSchema);

export default AddressModel;
