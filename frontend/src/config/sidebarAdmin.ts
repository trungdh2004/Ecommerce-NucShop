import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { CiDeliveryTruck, CiShoppingTag, CiStopwatch } from "react-icons/ci";
import { FaBox } from "react-icons/fa";
import { FaTruckFast } from "react-icons/fa6";
import { FcBullish, FcCurrencyExchange, FcDoughnutChart } from "react-icons/fc";
import { GoClockFill } from "react-icons/go";
import { GrBlog } from "react-icons/gr";
import {
  HiOutlineCheckCircle,
  HiOutlineClipboardDocumentCheck,
  HiOutlineInboxArrowDown,
  HiOutlineInboxStack,
  HiOutlineNewspaper,
  HiOutlineSquaresPlus,
  HiOutlineTicket,
} from "react-icons/hi2";
import { IoColorPaletteOutline } from "react-icons/io5";
import {
  LiaShippingFastSolid,
  LiaTruckLoadingSolid,
  LiaUserAstronautSolid,
} from "react-icons/lia";
import { LuLayoutDashboard, LuUserCircle } from "react-icons/lu";
import { MdCurrencyExchange, MdOutlinePostAdd } from "react-icons/md";
import { PiResizeLight } from "react-icons/pi";
import { TbBasketCancel } from "react-icons/tb";
import { VscAccount } from "react-icons/vsc";
const sidebarConfig: any[] = [
	{
		path: "",
		icon: FcDoughnutChart  ,
		isVisible: true,
		isAdmin: false,
		label: "Thống kê",
	},

	{
		path: "/users",
		isVisible: true,
		icon: LuUserCircle,
		label: "Người dùng",
		isAdmin: false,
		children: [
			{
				path: "",
				icon: VscAccount,
				isVisible: true,
				label: "Tài khoản",
			},
			{
				path: "/shipper",
				icon: LiaShippingFastSolid,
				isVisible: true,
				label: "Giao hàng",
			},
			{
				path: "/client",
				icon: AiOutlineUsergroupAdd,
				isVisible: true,
				label: "Khách hàng",
			},
			// {
			// 	path: "/staff",
			// 	icon: LiaUserAstronautSolid,
			// 	isVisible: true,
			// 	label: "Nhân viên",
			// },
		],
	},
	{
		path: "/chat",
		isVisible: true,
		label: "Trò chuyện",
	},
	{
		path: "/product",
		isVisible: true,
		label: "Sản phẩm",
		isAdmin: false,
		children: [
			{
				path: "/category",
				icon: HiOutlineSquaresPlus,
				isVisible: true,
				isAdmin: false,
				label: "Danh mục",
			},
			{
				path: "/voucher",
				icon: HiOutlineTicket,
				isVisible: true,
				isAdmin: false,
				label: "Mã giảm giá",
			},
			{
				path: "/",
				icon: HiOutlineInboxStack,
				isVisible: true,
				label: "Danh sách sản phẩm",
			},
			{
				path: "/add",
				icon: HiOutlineInboxArrowDown,
				isVisible: true,
				label: "Thêm sản phẩm",
			},
			{
				path: "/coming",
				icon: GoClockFill,
				isVisible: true,
				label: "Sản phẩm chờ",
			},
		],
	},
	{
		path: "/variant",
		isVisible: true,
		label: "Biến thể",
		isAdmin: false,
		children: [
			{
				path: "/color",
				icon: IoColorPaletteOutline,
				isVisible: true,
				label: "Màu sắc",
				isAdmin: false,
			},
			{
				path: "/size",
				icon: PiResizeLight,
				isVisible: true,
				label: "Kích thước",
				isAdmin: false,
			},
		],
	},

	{
		path: "/blogs",
		isVisible: true,
		label: "Bài viết",
		isAdmin: false,
		children: [
			{
				icon: CiShoppingTag,
				path: "/tags",
				isVisible: true,
				label: "Nhãn",
				isAdmin: false,
			},
			{
				path: "/",
				icon: HiOutlineNewspaper,
				isVisible: true,
				label: "Danh sách bài viết",
			},
			{
				path: "/new-blog",
				icon: MdOutlinePostAdd,
				isVisible: true,
				label: "Tạo bài viết",
			},
			{
				path: "/my-blogs",
				icon: GrBlog,
				isVisible: true,
				label: "Bài viết của tôi",
			},
		],
	},
	{
		path: "/order",
		icon: FaBox,
		isVisible: true,
		label: "Đơn hàng",
		isAdmin: false,
		children: [
			{
				path: "",
				icon: CiStopwatch,
				isVisible: true,
				label: "Đơn hàng chờ xác nhận",
			},
			{
				path: "/orderconfirm",
				icon: HiOutlineClipboardDocumentCheck,
				isVisible: true,
				label: "Đơn hàng xác nhận",
			},
			{
				path: "/orderconfirmShipper",
				icon: CiDeliveryTruck,
				isVisible: true,
				label: "Đơn hàng chọn vận chuyển",
			},
			{
				path: "/ordership",
				icon: FaTruckFast,
				isVisible: true,
				label: "Đơn giao hàng ",
			},
			{
				path: "/ordershipsuccess",
				icon: LiaTruckLoadingSolid,
				isVisible: true,
				label: "Đơn giao hàng thành công",
			},
			{
				path: "/orderreceived",
				icon: HiOutlineCheckCircle,
				isVisible: true,
				label: "Đơn đã nhận",
			},
			{
				path: "/ordercancel",
				icon: TbBasketCancel,
				isVisible: true,
				label: "Đơn đã hủy",
			},
		],
	},
	{
		path: "/payment",
		icon: MdCurrencyExchange,
		isVisible: true,
		label: "Giao dịch",
		isAdmin: true,
	},
	{
		path: "/revenue",
		icon: FcBullish ,
		isVisible: true,
		label: "Doanh thu",
		isAdmin: true,
	},
	{
		path: "/location",
		isVisible: true,
		label: "Vị trí cửa hàng",
		isAdmin: false,
	},
];

export default sidebarConfig;
