import { optimizeCloudinaryUrl } from "@/common/localFunction";
import { removeItemLocal } from "@/common/localStorage";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import app from "@/config/initializeFirebase";
import instance from "@/config/instance";
import { useAuth } from "@/hooks/auth";
import { cn } from "@/lib/utils";
import { logOut } from "@/service/account";
import useCart from "@/store/cart.store";
import { AxiosError } from "axios";
import { getAuth, signOut } from "firebase/auth";
import { LucideUser } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
const User = () => {
	const location = useLocation();
	const regex = /\b\/?admin\b/;

	const { authUser, setAuthUser, setIsLoggedIn } = useAuth();
	const {clearStateCart  } = useCart();
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
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<LucideUser strokeWidth={1.5} size={20} />
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				style={{ boxShadow: "0 -4px 32px rgba(0, 0, 0, .2)" }}
				className="py-2 px-4 *:cursor-pointer  text-[#1d2129] rounded-lg border-none"
			>
				<DropdownMenuLabel>
					<div className="flex items-center gap-3">
						<div className="size-10 ">
							<img
								className="object-cover w-full h-full rounded-full"
								src={optimizeCloudinaryUrl(
									authUser?.avatarUrl ||
										"https://i.pinimg.com/564x/93/e4/e6/93e4e61c962b5cb8a9ac79626b2f242e.jpg",
									40,
									40,
								)}
								alt={authUser?.full_name}
							/>
						</div>
						<div className="">
							<p className="text-sm truncate max-w-36 ">
								{authUser?.full_name}
							</p>
							<span className="max-w-36 inline-block truncate text-xs font-normal text-[#757575] ">
								{authUser?.email}
							</span>
						</div>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator
					className={cn(!authUser?.is_admin && "hidden")}
				/>
				<Link
					to={regex.test(location.pathname) ? "/" : "/admin"}
					className="cursor-pointer"
				>
					<DropdownMenuItem
						className={cn(
							" hidden cursor-pointer",
							authUser?.is_admin || authUser?.is_staff ? "block" : "hidden",
						)}
					>
						<p>
							{regex.test(location.pathname)
								? "Trở về trang khách hàng"
								: "Vào trang quản trị"}
						</p>
					</DropdownMenuItem>
				</Link>
				<DropdownMenuSeparator
					className={cn("cursor-pointer",regex.test(location.pathname) ? "hidden" : "block")}
				/>
				<Link
					to={"/account/profile"}
					className="cursor-pointer "
				>
					<DropdownMenuItem
						className={cn("cursor-pointer",regex.test(location.pathname) ? "hidden" : "block")}
					>
						Tài khoản của tôi
					</DropdownMenuItem>
				</Link>
				<Link to={"/account/address"} className="cursor-pointer">
					<DropdownMenuItem
						className={cn("cursor-pointer",regex.test(location.pathname) ? "hidden" : "block")}
					>
						Địa chỉ
					</DropdownMenuItem>
				</Link>
				<Link
					to="/account/purchase"
					className="cursor-pointer"
				>
					<DropdownMenuItem
						className={cn("cursor-pointer",regex.test(location.pathname) ? "hidden" : "block")}
					>
						Đơn hàng
					</DropdownMenuItem>
				</Link>
				<DropdownMenuSeparator />
				<Link
					to={"/shipper/auth"}
					className="cursor-pointer"
				>
					<DropdownMenuItem
						className={cn("cursor-pointer",
							!regex.test(location.pathname) &&
								!authUser?.is_shipper &&
								!authUser?.is_admin
								? "block"
								: "hidden",
						)}
					>
						Đăng ký giao hàng
					</DropdownMenuItem>
				</Link>
				<Link to={"/shipper"} className="cursor-pointer">
					<DropdownMenuItem
						className={cn(
							"cursor-pointer",!regex.test(location.pathname) &&
								authUser?.is_shipper &&
								!authUser?.is_admin
								? "block"
								: "hidden",
						)}
					>
						Giao hàng
					</DropdownMenuItem>
				</Link>
				<DropdownMenuItem
					onClick={handleLogout}
					className="font-semibold text-red-500"
				>
					Đăng xuất
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default User;
