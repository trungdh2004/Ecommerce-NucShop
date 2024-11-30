import instance from "@/config/instance";
import axios from "axios";
import { IoMdDisc } from "react-icons/io";

export const callDistrict = async (idProvince : string) =>{
  const data = await axios.get(
		`https://api-tinh-thanh-git-main-toiyours-projects.vercel.app/district?idProvince=${idProvince}`,
  );
  return data
}

export const callCommune = async (idDistrict: string) => {
  const data = await axios.get(
    `https://api-tinh-thanh-git-main-toiyours-projects.vercel.app/commune?idDistrict=${idDistrict}`,
  );
  return data
}

export const callCity = async () => {
  const data = await axios.get(
		"https://api-tinh-thanh-git-main-toiyours-projects.vercel.app/province",
  );
  return data
}
 
export const addAddress = async (dataNew : any) => {
  const data = instance.post(`/address/addAddress`, dataNew);
  return data
}

export const deleteAddress = async (id : any) => {
  const data = instance.delete(`address/deleteAddress/${id}`);
  return data
}

export const editAddress = async ({id,dataNew}:any) => {
  const data = await instance.put(`address/updateAddress/${id}`, dataNew);	
  return data
}

export const getAddressById = async (id : any) => {
  const data = instance.get(`/address/${id}`);
  return data
}

export const fetchAddress = async (page: any) => {
	const response = await instance.post(`address/paddingAddress`, {
    pageIndex: page,
    pageSize:4,
	});
	return response.data;
};

export const editAddressMain = async (id : any) => {
  const data = await instance.put(`address/updateMain/${id}`, {});
  return data
}