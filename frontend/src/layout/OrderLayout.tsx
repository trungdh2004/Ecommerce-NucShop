import FooterV2 from "@/components/client/FooterV2";
import HeaderOrder from "@/pages/clients/order/HeaderOrder";
import { Outlet, ScrollRestoration } from "react-router-dom";

const OrderLayout = () => {
	return (
		<>
			<HeaderOrder />
			<Outlet />
			<div className="hidden lg:block md:block">
				<FooterV2 />
			</div>
			<ScrollRestoration />
		</>
	);
};

export default OrderLayout;
