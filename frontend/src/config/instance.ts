import { ResponseData } from './../types/ObjectCheckoutOrder';
import axios from "axios";


const instance = axios.create({
	baseURL: process.env.SERVER_URL,
	timeout: 5000,
	headers: { "X-Custom-Header": "foobar" },
});

const refreshToken = async () => {
	const response = await axios.post(
		`${process.env.SERVER_URL}/auth/refreshToken`,
		{},
		{
			withCredentials: true,
		},
	);
	return response?.data?.accessToken;
};

instance.interceptors.request.use(
	async function (config) {
		config.withCredentials = true;

		return config;
	},
	function (error) {
		console.log("error", error);

		return Promise.reject(error);
	},
);

instance.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		const originalRequest = error.config;

		if (error.response.status === 401) {
			originalRequest._retry = true;
			try {
				const newToken = await refreshToken();
				instance.defaults.headers.common["Authorization"] =
					`Bearer ${newToken}`;
				originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
				return instance(originalRequest);
			} catch (refreshError) {
				console.error("Refresh token failed", refreshError);
				
				return Promise.reject(refreshError);
			}
		}

		if(error.response.status === 413) {
			instance.defaults.headers.common["Authorization"] = null;
			window.location.href = "/auth/login";
		}

		return Promise.reject(error);
	},
);

export default instance;
