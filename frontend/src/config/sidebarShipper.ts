import { BsClipboard2Pulse } from "react-icons/bs";
import { FaArrowLeftLong, FaTruckRampBox } from "react-icons/fa6";
import { FiHome } from "react-icons/fi";
import { HiOutlineInboxArrowDown } from "react-icons/hi2";
import { RiAccountPinCircleLine } from "react-icons/ri";

const sidebarShipper: any[] = [
	{
		path: "/shipper",
		icon: FiHome,
		isVisible: true,
		isAdmin: false,
		label: "Trang chủ",
	},
  {
		path: "/shipper/for-shippers",
		icon: BsClipboard2Pulse ,
		isVisible: true,
		isAdmin: false,
		label: "Đơn hàng mới",
	},
	{
		path: "/shipper/orderNew",
		icon: HiOutlineInboxArrowDown,
		isVisible: true,
		isAdmin: false,
		label: "Đơn hàng cần giao",
	},
  
	{
		path: "/shipper/orderSuccess",
		icon: FaTruckRampBox,
		isVisible: true,
		isAdmin: false,
		label: "Đơn hàng đã giao",
	},
	{
		path: "/shipper/account",
		icon: RiAccountPinCircleLine,
		isVisible: true,
		isAdmin: false,
		label: "Tài khoản",
	},
	{
		path: "/",
		icon: FaArrowLeftLong,
		isVisible: true,
		isAdmin: false,
		label: "Quay lại trang chủ",
	},
];

export default sidebarShipper;
