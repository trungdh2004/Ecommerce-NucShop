import { FaRegUser } from "react-icons/fa6";
import { RiLockPasswordLine } from "react-icons/ri";
import { CgMenuBoxed } from "react-icons/cg";
import { RiSecurePaymentFill } from "react-icons/ri";
import { GrLocation } from "react-icons/gr";

const sidebarAccount = [
	{
		name: "Hồ sơ",
		path: "/account/profile",
		icon: FaRegUser,
	},
	{
		name: "Đổi mật khẩu",
		path: "/account/password",
		icon: RiLockPasswordLine,
	},
	{
		name: "Địa chỉ",
		path: "/account/address",
		icon: GrLocation,
	},
	{
		name: "Đơn hàng",
		path: "/account/purchase",
		icon: CgMenuBoxed,
	},
	{
		name: "Giao dịch",
		path: "/account/payment",
		icon: RiSecurePaymentFill,
	},
];
export default sidebarAccount;
