import OrderLayout from "@/layout/OrderLayout";
import OrderPage from "@/pages/clients/order/OrderPage";
import OrderSuccess from "@/pages/clients/order/OrderSuccess";
import ProtectedRouter from "./ProtectedRouter";

const OrderRouter = [
	{
		path: "/order",
		element: (
			<ProtectedRouter>
				<OrderLayout />
			</ProtectedRouter>
		),
		children: [
			{
				path: "",
				element: <OrderPage />,
			},
			{
				path: "success",
				element: <OrderSuccess />,
			},
			// {
			// 	path: "v2",
			// 	element: <OrderPageV2 />,
			// },
		],
	},
];
export default OrderRouter;
