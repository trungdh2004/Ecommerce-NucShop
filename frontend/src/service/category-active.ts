import instance from "@/config/instance";
export const getAllCateActive = () => {
	const uri = "/categoryActive/find";
	return instance.get(uri);
};
