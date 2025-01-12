import { IUser } from "./models";

export interface IAddress {
  username: string;
  phone: string;
  city: {
    name: string;
    idProvince: string;
  };
  district: {
    name: string;
    idDistrict: String;
  };
  commune: {
    name: string;
    idCommune: string;
  };
  user: IUser;
  address: string;
  detailAddress: string;
  location: number[];
}
