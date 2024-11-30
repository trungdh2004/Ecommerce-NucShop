import OverlayViolet from "@/components/OverlayViolet";
import instance from "@/config/instance";
import { useAuth } from "@/hooks/auth";
import { loginAccount } from "@/service/account";
import { getCountMyShoppingCart, pagingCartV2 } from "@/service/cart";
import useCart from "@/store/cart.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../../components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import SignInWithFacebookOrGoogle from "./SignInWithFacebookOrGoogle";
const Login = () => {
	const [searchParams, SetURLSearchParams] = useSearchParams();
	const router = useNavigate();
	const { setCarts, setTotalCart } = useCart();
	const { setAuthUser, setIsLoggedIn } = useAuth();
	const formSchema = z.object({
		email: z
			.string({ required_error: "Bạn chưa  nhập email" })
			.email({ message: "Bạn nhập email không đúng định dạng" }),

		password: z
			.string({ required_error: "Bạn phải nhập mật khẩu" })
			.min(6, { message: "Mật khẩu ít nhất phải 6 ký tự" }),
	});
	const [isPassword, setIsPassword] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const onSubmit = async (payload: z.infer<typeof formSchema>) => {
		try {
			const { data } = await loginAccount(payload);
			const { user, accessToken, message } = data;

			// Cập nhật trạng thái đăng nhập và token Authorization
			setAuthUser?.(user);
			setIsLoggedIn?.(true);
			instance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
			const [cartsResponse, totalCountResponse] = await Promise.all([
				pagingCartV2(),
				getCountMyShoppingCart(),
			]);

			setCarts(cartsResponse?.data?.listData || []);
			setTotalCart(totalCountResponse?.data?.count || 0);
			toast.success(message);
			const historyUrl = searchParams.get("url");

			if (historyUrl) {
				const url = decodeURIComponent(historyUrl);
				window.location.href = url;
			} else {
				router("/");
			}
		} catch (error) {
			setAuthUser?.(undefined);
			setIsLoggedIn?.(false);
			setCarts([]);
			setTotalCart(0);
			if (error instanceof AxiosError) {
				toast.error(error.response?.data?.message);
			}
		}
	};
	return (
		<div className="h-full">
			<OverlayViolet />

			<div className="absolute flex items-center justify-between pr-5 left-3 top-3">
				<Link
					to={"/"}
					className="relative flex items-center justify-center p-3 bg-white rounded-lg shadow-lg dark:bg-slate-600 max-w-36"
				>
					<IoIosArrowRoundBack size={20} className="mr-4" /> Trang chủ
				</Link>
			</div>
			<div className="w-full max-w-xs px-8 mx-auto my-auto mt-24 bg-white border border-gray-200 shadow-md dark:bg-slate-800 md:max-w-sm md:mt-12 py-9 rounded-2xl">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="space-y-5 ">
							<h2 className="mb-10 text-xl font-bold text-center">Đăng nhập</h2>
							<SignInWithFacebookOrGoogle />
							{/* end line */}
							<div className="space-y-1">
								<div className="">
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem className="space-y-0">
												<FormLabel className="text-start">Email</FormLabel>
												<FormControl className="">
													<Input {...field} className="" />
												</FormControl>
												<FormMessage className="text-xs" />
											</FormItem>
										)}
									/>
								</div>
								<div>
									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem className="space-y-0">
												<FormLabel className="text-start">Mật khẩu</FormLabel>
												<div className="relative">
													<FormControl>
														<Input
															{...field}
															type={isPassword ? "text" : "password"}
															className=""
														/>
													</FormControl>
													{isPassword ? (
														<FaRegEyeSlash
															onClick={() => setIsPassword((prev) => !prev)}
															size={18}
															className="absolute -translate-y-1/2 cursor-pointer top-1/2 right-5 "
														/>
													) : (
														<FaRegEye
															onClick={() => setIsPassword((prev) => !prev)}
															size={18}
															className="absolute -translate-y-1/2 cursor-pointer top-1/2 right-5"
														/>
													)}
												</div>
												<FormMessage className="text-xs" />
											</FormItem>
										)}
									/>
								</div>
							</div>
						</div>

						<Link
							to={"/auth/forgot-password"}
							className="mt-2 text-blue-500 float-end "
						>
							Quên mật khẩu ?
						</Link>
						<Button
							type="submit"
							className="w-full mt-3 mb-6 text-base font-bold text-white bg-blue-500 hover:bg-blue-400"
						>
							Đăng nhập
						</Button>
						<p className="text-center">
							Bạn chưa có tài khoản ?{" "}
							<Link to={"/auth/register"} className="text-blue-500">
								Đăng ký
							</Link>
						</p>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default Login;
