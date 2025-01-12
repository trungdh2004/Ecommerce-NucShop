import mongoose from "mongoose";
import { generateSlugs } from "../middlewares/generateSlug";
import { ITags } from "../interface/blogs";

interface ILocation {
    long:number;
    lat:number;
    name:string
}

const LocationSchema = new mongoose.Schema(
  {
    long: {
      type: Number,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    name:{
        type: String,
        default:"Nuc Shop"
    }
  },
  {
    timestamps: true,
  }
);


const LocationModel = mongoose.model<ILocation>("Location", LocationSchema);

export default LocationModel;
