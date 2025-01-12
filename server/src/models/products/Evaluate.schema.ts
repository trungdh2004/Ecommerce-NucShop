import { number, required } from "joi";
import mongoose from "mongoose";

const EvaluateSchema = new mongoose.Schema(
  {
    product:{
      type:mongoose.Types.ObjectId,
      ref:"Product",
      required:true,
    },
    rating:{
      type:Number,
      required:true,
    },
    user:{
      type:mongoose.Types.ObjectId,
      ref:"User",
      required:true,
    },
    attribute:{
      type:String,
      required:true,
    },
    content:{
      type:String,
      default:""
    },
    isDelete:{
      type:Boolean,
      default:false,
    }
  },
  {
    timestamps: true,
  }
);

const EvaluateModel = mongoose.model("Evaluate", EvaluateSchema);

export default EvaluateModel;
