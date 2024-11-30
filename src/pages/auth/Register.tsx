import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
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
import { createAccount } from "@/service/account";
import { toast } from "sonner";
import { AxiosError } from "axios";
import OverlayViolet from "@/components/OverlayViolet";

const Register = () => {
  const navigate = useNavigate();
	const formSchema = z
		.object({
			userName: z.string({ required_error: "Bạn chưa nhập tên đăng nhập" }),
			email: z
				.string({ required_error: "Bạn chưa  nhập email" })
				.email({ message: "Bạn nhập email không đúng định dạng" }),
			password: z
				.string({ required_error: "Bạn phải nhập mật khẩu" })
				.min(6, { message: "Mật khẩu ít nhất phải 6 ký tự" }),
			forgotPassword: z
				.string({ required_error: "Bạn phải nhập xác nhận mật khẩu" })
				.min(6, { message: "Mật khẩu ít nhất phải 6 ký tự" }),
		})
		.refine((data) => data.password === data.forgotPassword, {
			message: "Mật khẩu không khớp",
			path: ["forgotPassword"],
		});
	const [isPassword, setIsPassword] = useState(false);
	const [isConfrimPassword, setIsConfrimPassword] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			userName: "",
			email: "",
			password: "",
			forgotPassword: "",
		},
	});
	const onSubmit = async (payload: z.infer<typeof formSchema>) => {
		try {
			const { data } = await createAccount(payload);
			toast.success(data?.message);
      navigate('/auth/login');
		} catch (error: any) {
			toast.error(error.response!.data!.message);
		}
	};
	return (
		<div className="w-full h-full">
			<OverlayViolet />

			<Link
				to={"/"}
				className="relative flex items-center justify-center p-3 bg-white rounded-lg shadow-lg dark:bg-slate-600 max-w-36"
			>
				<IoIosArrowRoundBack size={20} className="mr-4" /> Trang chủ
			</Link>
			<div className="w-full max-w-xs px-8 mx-auto mt-5 bg-white border border-gray-200 shadow-md dark:bg-slate-800 md:max-w-sm py-9 rounded-2xl">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="space-y-5 ">
							<h2 className="text-xl font-bold text-center">Đăng ký</h2>
							<SignInWithFacebookOrGoogle />
							<div className="space-y-1 ">
								<div className="">
									<FormField
										control={form.control}
										name="userName"
										render={({ field }) => (
											<FormItem className="space-y-0">
												<FormLabel>Tên đăng nhập</FormLabel>
												<FormControl className="">
													<Input {...field} className="" type="text" />
												</FormControl>
												<FormMessage className="text-xs" />
											</FormItem>
										)}
									/>
								</div>
								<div className="">
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem className="space-y-0">
												<FormLabel>Email</FormLabel>
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
												<FormLabel>Mật khẩu</FormLabel>
												<div className="relative">
													<FormControl>
														<Input
															{...field}
															type={isPassword ? "text" : "password"}
														/>
													</FormControl>
													{isPassword ? (
														<FaRegEyeSlash
															onClick={() => setIsPassword((prev) => !prev)}
															size={18}
															className="absolute -translate-y-1/2 cursor-pointer top-1/2 right-5"
														/>
													) : (
														<FaRegEye
															onClick={() => setIsPassword((prev) => !prev)}
															size={18}
															className="absolute -translate-y-1/2 cursor-pointer top-1/2 right-5"
														/>
													)}
												</div>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div>
									<FormField
										control={form.control}
										name="forgotPassword"
										render={({ field }) => (
											<FormItem className="space-y-0">
												<FormLabel className="text-xs">
													Xác nhận mật khẩu
												</FormLabel>
												<div className="relative">
													<FormControl>
														<Input
															{...field}
															type={isConfrimPassword ? "text" : "password"}
														/>
													</FormControl>
													{isConfrimPassword ? (
														<FaRegEyeSlash
															onClick={() =>
																setIsConfrimPassword((prev) => !prev)
															}
															size={18}
															className="absolute -translate-y-1/2 cursor-pointer top-1/2 right-5"
														/>
													) : (
														<FaRegEye
															onClick={() =>
																setIsConfrimPassword((prev) => !prev)
															}
															size={18}
															className="absolute -translate-y-1/2 cursor-pointer top-1/2 right-5"
														/>
													)}
												</div>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
						</div>
						<Button
							type="submit"
							className="w-full mt-3 mb-6 text-base font-bold text-white bg-blue-500 hover:bg-blue-400"
						>
							Đăng ký
						</Button>
						<p className="text-center">
							Bạn đã có tài khoản ?{" "}
							<Link to={"/auth/login"} className="text-blue-500">
								Đăng nhập
							</Link>
						</p>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default Register;
