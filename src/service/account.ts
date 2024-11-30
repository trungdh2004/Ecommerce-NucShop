import instance from "@/config/instance";
import { IPassword } from "@/types/auth";
import axios from "axios";

export const createAccount = (data: any) => {
	const uri = "/auth/register";
	return instance.post(uri, data);
};
export const loginAccount = (data: any) => {
	const uri = "/auth/login";
	return axios.post((process.env.SERVER_URL + uri) as string, data, {
		withCredentials: true,
	});
};
export const findEmail = (data: any) => {
	const uri = "/auth/forgotPassword";
	return instance.post(uri, data);
};
export const verifyOTP = (data: any) => {
	const uri = "/auth/compareOtp";
	return instance.post(uri, data);
};
export const updateForgotPassword = (data: any) => {
	const uri = "/auth/updateForgotPassword";
	return instance.post(uri, data);
};
export const currentAccount = () => {
	const uri = "/auth/current-user";
	return instance.get(uri);
};
export const socialUser = (data: any) => {
	const uri = "/auth/social-user";
	return instance.post(uri, data);
};
export const logOut = () => {
	const uri = "/auth/logout";
	return instance.post(uri);
};
export const changePassword = (data: IPassword) => {
	const uri = "/auth/changePassword";
	return instance.put(uri, data);
};
