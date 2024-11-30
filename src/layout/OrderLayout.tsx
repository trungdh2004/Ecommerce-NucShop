import Footer from "@/components/client/Footer";
import HeaderOrder from "@/pages/clients/order/HeaderOrder";
import React from "react";
import { Outlet } from "react-router-dom";

const OrderLayout = () => {
	return (
		<>
			<HeaderOrder />
			<Outlet />
			<div className="lg:block md:block hidden">
				<Footer />
			</div>
		</>
	);
};

export default OrderLayout;
