
import { IUser } from "./models";

export interface IVoucher {
    _id: string;
    name: string,
    description: string,
    code: string,
    startDate: Date,
    endDate: Date,
    discountType: number,
    discountValue:number,
    minimumOrderValue:number,
    usageLimit:number,
    usageCount: number,
    status: number,
    version: number,
    modifiedDate: Date,
    modifiedBy: string | IUser,
    user: string | IUser,
    createdBy:Date,
    updatedBy:Date,
    type:"1" | "2",
    listUseProduct:string[],
    maxAmount:number,
    isHome:boolean
}