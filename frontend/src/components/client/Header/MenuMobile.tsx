import { optimizeCloudinaryUrl } from "@/common/localFunction";
import { removeItemLocal } from "@/common/localStorage";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import app from "@/config/initializeFirebase";
import instance from "@/config/instance";
import { useAuth } from "@/hooks/auth";
import { cn } from "@/lib/utils";
import { logOut } from "@/service/account";
import useCart from "@/store/cart.store";
import { AxiosError } from "axios";
import { getAuth, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { IoMenu } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";
import SearchMobile from "./SearchMobile";
const MenuMobile = () => {
	const { isLoggedIn, authUser, setAuthUser, setIsLoggedIn } = useAuth();
	const { clearStateCart } = useCart();
	const matches = useMediaQuery("(min-width: 768px)");
	const [isOpen, setClose] = useState(false);
	useEffect(() => {
		if (matches) {
			setClose(false);
		}
	}, [matches]);
	const handleLogout = async () => {
		try {
			await logOut();
			delete instance.defaults.headers.common.Authorization;
			setAuthUser?.(undefined);
			setIsLoggedIn?.(false);
			removeItemLocal("token");
			signOut(getAuth(app));
			clearStateCart();
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error.response?.data?.message);
			}
		}
	};
	return (
		<Sheet open={isOpen} onOpenChange={() => setClose(false)}>
			{/* <SheetTrigger asChild> */}
			<IoMenu
				onClick={() => setClose(true)}
				className="text-2xl cursor-pointer"
			/>
			{/* </SheetTrigger> */}
			<SheetContent side={"left"} className="flex flex-col gap-y-5">
				<SheetHeader className={cn("hidden", isLoggedIn && "block")}>
					<div className="flex items-center gap-3">
						<div className="size-10 min-w-10 min-h-10 max-w-10 max-h-10">
							<img
								className="object-cover w-full h-full rounded-full"
								src={
									authUser?.avatarUrl &&
									(optimizeCloudinaryUrl(authUser?.avatarUrl) ||
										"https://i.pinimg.com/564x/06/25/9f/06259fed99c906d43f691b1d1d4956cc.jpg")
								}
								alt=""
							/>
						</div>
						<div className="flex-1 text-start">
							<p className="text-sm">{authUser?.full_name}</p>
							<span className=" line-clamp-1 text-xs font-normal text-[#757575] ">
								{authUser?.email}-{authUser?.email}-{authUser?.email}
							</span>
						</div>
					</div>
				</SheetHeader>
				<div className="">
					<SearchMobile handleCloseSidebar={() => setClose(false)} />
					<ul className="mt-2 text-black font-medium flex flex-col gap-1 items-start justify-center  *:py-2.5 *:px-1 *:rounded *:cursor-pointer  transition-all *:w-full ">
						<li className=" hover:bg-[#919eab14] has-[.active]:bg-[#919eab14]">
							<NavLink to={"/"} className="block">
								Trang chủ
							</NavLink>
						</li>
						<li className=" hover:bg-[#919eab14] has-[.active]:bg-[#919eab14]">
							<NavLink to={"/shop"} className="block">
								Sản phẩm
							</NavLink>
						</li>
						<li
							className={cn(
								" hover:bg-[#919eab14] has-[.active]:bg-[#919eab14] hidden",
								isLoggedIn && "block",
							)}
						>
							<NavLink to={"/cart"} className="block">
								Giỏ hàng
							</NavLink>
						</li>
						<li className=" hover:bg-[#919eab14] has-[.active]:bg-[#919eab14]">
							<NavLink to={"/blogs"} className="block">
								Bài viết
							</NavLink>
						</li>
						<li className=" hover:bg-[#919eab14] has-[.active]:bg-[#919eab14]">
							<NavLink to={"/contacts"} className="block">
								Liên hệ{" "}
							</NavLink>
						</li>
						<li className=" hover:bg-[#919eab14] has-[.active]:bg-[#919eab14]">
							<NavLink to={"/introduce"} className="block">
								Giới thiệu
							</NavLink>
						</li>
						<li
							className={cn(
								" hover:bg-[#919eab14] has-[.active]:bg-[#919eab14] block",
								isLoggedIn && "hidden",
							)}
						>
							<NavLink to={"/auth/register"} className="block">
								Đăng ký{" "}
							</NavLink>
						</li>
						<li
							className={cn(
								" hover:bg-[#919eab14] has-[.active]:bg-[#919eab14] block",
								isLoggedIn && "hidden",
							)}
						>
							<NavLink to={"/auth/login"} className="block">
								Đăng nhập
							</NavLink>
						</li>

						<li
							onClick={handleLogout}
							className={cn(
								" hover:bg-[#919eab14] has-[.active]:bg-[#919eab14] hidden",
								isLoggedIn && "block",
							)}
						>
							Đăng xuất
						</li>
					</ul>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default MenuMobile;
