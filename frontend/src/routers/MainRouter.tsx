import AccountLayout from "@/layout/AcountLayout";
import MainLayout from "@/layout/MainLayout";
import UserIndex from "@/pages/admin/users/UserIndex";
import AccountIndex from "@/pages/clients/account/AccountIndex";
import ChangePassword from "@/pages/clients/account/ChangePassword";
import PaymentIndex from "@/pages/clients/account/PaymentIndex";
import OrderManagements from "@/pages/clients/account/Purchase";
import PurchaseOrder from "@/pages/clients/account/PurchaseOrder";
import Address from "@/pages/clients/address/Address";
import AddressIndex from "@/pages/clients/address/AddressIndex";
import BlogDetail from "@/pages/clients/blogs/BlogDetail";
import BlogPage from "@/pages/clients/blogs/BLogPage";
import CartPage from "@/pages/clients/cart/CartPage";
import ContactIndex from "@/pages/clients/contact/ContactIndex";
import DetailProduct from "@/pages/clients/detail-home/page";
import HomePage from "@/pages/clients/home/page";
import IntroducePage from "@/pages/clients/introduce/IntroducePage";
import OrderProcessing from "@/pages/clients/order/OrderProcessing";
import OrderProcessingV2 from "@/pages/clients/order/OrderProcessingV2";
import WrapperSearch from "@/pages/clients/search/WrapperSearch";
import ShopProduct from "@/pages/clients/shop/ShopProduct";
import VoucherIndex from "@/pages/clients/vouchers/VoucherIndex";
import NotFound from "@/pages/NotFound";
import { Navigate } from "react-router-dom";
import ProtectedRouter from "./ProtectedRouter";

const MainRouter = [
	{
		path: "/",
		element: <MainLayout />,
		children: [
			{ path: "", element: <HomePage /> },
			{ path: "/shop/detail/:slug", element: <DetailProduct /> },
			{ path: "address", element: <Address /> },
			{ path: "blogs", element: <BlogPage /> },
			{ path: "blogDetail/:id", element: <BlogDetail /> },
			{ path: "table", element: <UserIndex /> },
			{ path: "cart", element: <CartPage /> },
			{ path: "shop", element: <ShopProduct /> },
			{ path: "introduce", element: <IntroducePage /> },
			{
				path: "search",
				element: <WrapperSearch />,
			},
			{ path: "vouchers", element: <VoucherIndex /> },
			{
				path: "contacts",
				element: <ContactIndex />,
			},
			{ path: "introduce", element: <IntroducePage /> },

			{
				path: "/account",
				element: (
					<ProtectedRouter>
						<AccountLayout />
					</ProtectedRouter>
				),
				children: [
					{
						path: "",
						element: <Navigate to={"/account/profile"} />,
					},
					{
						path: "profile",
						element: <AccountIndex />,
					},
					{
						path: "purchase",
						element: <OrderManagements />,
					},
					{
						path: "purchase/order/:id",
						element: <PurchaseOrder />,
					},
					{
						path: "payment",
						element: <PaymentIndex />,
					},
					{ path: "address", element: <AddressIndex /> },
					{
						path: "password",
						element: <ChangePassword />,
					},
				],
			},
		],
	},
	{ path: "/orderprocessing", element: <OrderProcessing /> },
	{ path: "/orderprocessingv2", element: <OrderProcessingV2 /> },
	{ path: "/orderprocessingv3", element: <OrderProcessing /> },
	{ path: "*", element: <NotFound /> },
];
export default MainRouter;
