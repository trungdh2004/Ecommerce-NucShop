import { FaTruckRampBox } from "react-icons/fa6";
import { FcComboChart } from "react-icons/fc";
import { FiHome } from "react-icons/fi";
import { HiOutlineInboxArrowDown } from "react-icons/hi2";
import { LuLayoutDashboard } from "react-icons/lu";
import { RiAccountPinCircleLine } from "react-icons/ri";

const sidebarShipper: any[] = [
	{
		path: "/shipper",
		icon: FiHome ,
		isVisible: true,
		isAdmin: false,
		label: "Trang chủ",
	},
	{
		path: "/shipper/orderNew",
		icon: HiOutlineInboxArrowDown  ,
		isVisible: true,
		isAdmin: false,
		label: "Đơn hàng",
	},
	{
		path: "/shipper/orderSuccess",
		icon: FaTruckRampBox,
		isVisible: true,
		isAdmin: false,
		label: "Đơn hàng đã giao",
	},
	{
		path: "/shipper/dashboard",
		icon: FcComboChart ,
		isVisible: true,
		isAdmin: false,
		label: "Thống kê",
	},
	{
		path: "/shipper/account",
		icon: RiAccountPinCircleLine ,
		isVisible: true,
		isAdmin: false,
		label: "Tài khoản",
	},
];


export default sidebarShipper;
