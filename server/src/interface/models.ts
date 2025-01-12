import { Request } from "express";
import { Document, Types } from "mongoose";
import { ObjectId } from "mongodb";

interface MongooseDocument extends Document<Types.ObjectId> {
  _doc: any;
}

export interface IUser extends MongooseDocument {
  userName: string;
  email: string;
  password: string;
  avatarUrl: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_admin: boolean;
  is_staff:boolean;
  blocked_at: boolean;
  comment_blocked_at: boolean;
  phone: string;
  birthDay: string;
  bio: string;
  uid: string;
  provider: string;
  point:number
  is_shipper:boolean;
}

export interface RequestModel extends Request {
  user?: {
    id: ObjectId;
    is_admin: boolean;
    email: string;
    is_staff: boolean;
  };
}


export interface RequestShipper extends Request {
  shipper?: {
    id: ObjectId;
    email: string;
    id_user: ObjectId;
    phone:string;
    fullName: string;
  }
}