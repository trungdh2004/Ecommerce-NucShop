import { useEffect } from "react";
import Banner from "./Banner";
import DealProductSection from "./DealProductSection";
import LatestNewsBlog from "./LatestNewsBlog";
import ListCoupon from "./ListCoupon";
import ListProductHot from "./ListProductHot";
import ProductByCategory from "./ProductByCategory";
import ProductsList from "./ProductsList";
const HomePage = () => {
	useEffect(() => {
		document.title = "Trang chủ NucShop";
	}, []);

	return (
		<div className="">
			{/* <Sliderv2 /> */}
			<Banner />
			{/* <Carousel /> */}
			<ListCoupon />
			<ListProductHot />
			<div className="w-full">
				<img
					src="./bannerHome1.webp"
					alt=""
					className="object-cover min-h-[100px]"
				/>
			</div>
			<ProductByCategory />

			<div className="w-full mt-10 padding">
				<img
					src="./bannerHome2.webp"
					alt=""
					className="object-cover min-h-[100px]"
				/>
			</div>
			<ProductsList />
			<DealProductSection />
			<LatestNewsBlog />
		</div>
	);
};

export default HomePage;
