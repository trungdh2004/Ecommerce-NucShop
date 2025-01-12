import axios from "axios";

export const uploadFileService = (
	data: FormData,
	width?: number,
	height?: number,
) => {
	const uri = `/upload/singleImage${width || height ? `?${width ? `width=${width}` : ""}${width && height ? "&" : ""}${height ? `height=${height}` : ""}` : ""}`;
	return axios.post(process.env.SERVER_URL + uri, data, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};
export const uploadMultipleFileService = (
	data: FormData,
	width?: number,
	height?: number,
) => {
	const uri = `/upload/multipleImage${width || height ? `?${width ? `width=${width}` : ""}${width && height ? "&" : ""}${height ? `height=${height}` : ""}` : ""}`;
	return axios.post(process.env.SERVER_URL + uri, data, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};
