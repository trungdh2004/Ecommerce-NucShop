import instance from "@/config/instance";
export const getAllProductSlide = () => {
	const uri = "productSlider/find";
	return instance.get(uri);
};
