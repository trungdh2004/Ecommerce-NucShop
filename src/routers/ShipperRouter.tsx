import ShipperLayout from "@/layout/ShipperLayout";
import ShipperAuth from "@/pages/shipper/ShipperAuth";
import ShipperIndex from "@/pages/shipper/ShipperIndex";
import ShipperPending from "@/pages/shipper/ShipperPending";
import ShipperTranSport from "@/pages/shipper/ShipperTranSport";
import PrivateRouterShipper from "./PrivateRouterShipper";
import OrderNewIndex from "@/pages/shipper/OrderNew/OrderNewIndex";
import OrderSusccesIndex from "@/pages/shipper/OrderSuscces/OrderSusccesIndex";
import OrderDashboardIndex from "@/pages/shipper/OrderDashboard/OrderDashboardIndex";
import AccountShipperIndex from "@/pages/shipper/AccountShipper/AccountShipperIndex";

const ShipperRouter = [
	{
		path: "/shipper",
		element: <PrivateRouterShipper><ShipperLayout /></PrivateRouterShipper>,
		children: [
			{
				path:"",
				element:<ShipperIndex />
			},
			{
				path:"orderNew",
				element:<OrderNewIndex />
			},
			{
				path:"orderSuccess",
				element:<OrderSusccesIndex />
			},
			{
				path:"dashboard",
				element:<OrderDashboardIndex />
			},
			{
				path:"account",
				element:<AccountShipperIndex />
			},
		],
	},
	{
		path:"/shipper/auth",
		element:<ShipperAuth />
	},
	{
		path:"/shipper/pending",
		element:<ShipperPending />
	},
	{
		path:"/shipper/transport/:code",
		element:<PrivateRouterShipper><ShipperTranSport /></PrivateRouterShipper>
	}

];
export default ShipperRouter;
