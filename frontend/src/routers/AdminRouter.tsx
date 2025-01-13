import AdminLayout from "@/layout/AdminLayout";
import BlogDetail from "@/pages/admin/Blogs/BlogDetail";
import BlogList from "@/pages/admin/Blogs/BlogList";
import EditBlog from "@/pages/admin/Blogs/EditBlog";
import NewBlog from "@/pages/admin/Blogs/NewBlog";
import CategoryIndex from "@/pages/admin/category/CategoryIndex";
import ColorList from "@/pages/admin/color/ColorList";
import Dashboard from "@/pages/admin/Dashboard/Dashboard";

import MyBlogs from "@/pages/admin/Blogs/MyBlog";
import LocationIndex from "@/pages/admin/Location/LocationIndex";
import OrderById from "@/pages/admin/order/OrderById";
import OrderCancel from "@/pages/admin/order/OrderCancel";
import OrderConfirm from "@/pages/admin/order/OrderConfirm";
import OrderConfirmShipper from "@/pages/admin/order/OrderConfirmShipper";
import OrderNeedConfirm from "@/pages/admin/order/OrderNeedConfirm";
import OrderReceived from "@/pages/admin/order/OrderReceived";
import OrderShip from "@/pages/admin/order/OrderShip";
import OrderShipSuccess from "@/pages/admin/order/OrderShipSuccess";
import ProductAddPage from "@/pages/admin/product/ProductAdd";
import ProductIndex from "@/pages/admin/product/ProductIndex";
import ProductUpdate from "@/pages/admin/product/ProductUpdate";
import SizeIndex from "@/pages/admin/size/SizeIndex";
import TagIndex from "@/pages/admin/tags/TagIndex";
import UserDetail from "@/pages/admin/users/UserDetail";
import UserIndex from "@/pages/admin/users/UserIndex";
import VoucherForm from "@/pages/admin/Vouchers/VoucherForm";
import VoucherList from "@/pages/admin/Vouchers/VoucherList";
import PrivateRouter from "./PrivateRouter";
import UserShipper from "@/pages/admin/users/shipper/UserShipper";
import UserShipperDetail from "@/pages/admin/users/shipper/ShipperDetail";
import ChatIndex from "../pages/admin/Chat/ChatIndex";
import LayoutChat from "@/pages/admin/Chat/LayoutChat";
import ChatInit from "@/pages/admin/Chat/ChatInit";
import ChatContent from "@/pages/admin/Chat/components/ChatContent";
import CustomerList from "@/pages/admin/users/customer/CustomerList";
import ProductComing from "@/pages/admin/product/productComing/ProductComing";
import StaffIndex from "@/pages/admin/users/staff/StaffIndex";
import RevenueChart from "@/pages/admin/Revanue/RevenueChart";
import PaymentIndex from "@/pages/admin/payment/PaymentIndex";

const AdminRouter = [
	{
		path: "/admin",
		element: (
			<PrivateRouter>
				<AdminLayout />
			</PrivateRouter>
		),
		children: [
			{
				path: "",
				element: <Dashboard />,
			},
			{
				path: "add",
				element: <Dashboard />,
			},
			//Quản lý người dùng, vận chuyển, khách hàng, nhân viên
			{
				path: "users",
				element: <UserIndex />,
			},
			{
				path: "users/detail",
				element: <UserDetail />,
			},
			{
				path: "users/shipper",
				element: <UserShipper />,
			},
			{
				path: "users/shipper/:id/detail",
				element: <UserShipperDetail />,
			},
			{
				path: "users/client",
				element: <CustomerList />,
			},
			{
				path: "users/staff",
				element: <StaffIndex />,
			},
			// Quản lý sản phẩm
			{
				path: "product/update/:id",
				element: <ProductUpdate />,
			},
			{
				path: "product",
				element: <ProductIndex />,
			},
			{
				path: "product/category",
				element: <CategoryIndex />,
			},
			{
				path: "product/voucher",
				element: <VoucherList />,
			},
			{
				path: "product/voucher/add",
				element: <VoucherForm />,
			},
			{
				path: "product/voucher",
				element: <VoucherList />,
			},
			{
				path: "product/voucher/add",
				element: <VoucherForm />,
			},
			{
				path: "product/voucher/:id/edit",
				element: <VoucherForm />,
			},
			{
				path: "product/voucher/:id/edit",
				element: <VoucherForm />,
			},
			{
				path: "product/add",
				element: <ProductAddPage />,
			},
			{
				path: "product/coming",
				element: <ProductComing />,
			},
			// Quản lý biến thể
			{
				path: "variant/size",
				element: <SizeIndex />,
			},

			{
				path: "variant/color",
				element: <ColorList />,
			},
			// Quản lý blogs
			{
				path: "blogs",
				element: <BlogList />,
			},
			{
				path: "blogs/tags",
				element: <TagIndex />,
			},
			{
				path: "blogs/new-blog",
				element: <NewBlog />,
			},
			{
				path: "blogs/:id/edit",
				element: <EditBlog />,
			},
			{
				path: "blogs/my-blogs",
				element: <MyBlogs />,
			},
			{
				path: "blogs",
				element: <BlogList />,
			},
			{
				path: "blogs/:id/",
				element: <BlogDetail />,
			},
			//order
			{
				path: "order",
				element: <OrderNeedConfirm />,
			},
			{
				path: "order/orderconfirm",
				element: <OrderConfirm />,
			},
			{
				path: "order/ordership",
				element: <OrderShip />,
			},
			{
				path: "order/ordershipsuccess",
				element: <OrderShipSuccess />,
			},
			{
				path: "order/orderreceived",
				element: <OrderReceived />,
			},
			{
				path: "order/ordercancel",
				element: <OrderCancel />,
			},
			{
				path: "order/:id",
				element: <OrderById />,
			},
			{
				path: "order/orderconfirmShipper",
				element: <OrderConfirmShipper />,
			},
			// Thống kê
			{
				path: "revenue",
				element: <RevenueChart />,
			},
			// location
			{
				path: "location",
				element: <LocationIndex />,
			},
			//payment
			{
				path: "payment",
				element: <PaymentIndex />,
			},
			// chat
			{
				path: "chat",
				element: <LayoutChat></LayoutChat>,
				children: [
					{
						path: "",
						element: <ChatInit />,
					},
					{
						path: ":id",
						element: <ChatContent />,
					},
				],
			},
			{
				path: "chatAdmin",
				element: <ChatIndex />,
			},
		],
	},
];
export default AdminRouter;
