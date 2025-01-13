import OverlayViolet from "@/components/OverlayViolet";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateForgotPassword } from "@/service/account";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
interface PropsRestPassword {
	setStep: (val: number) => void;
	email: string;
}
const ResetPassword = ({ setStep, email }: PropsRestPassword) => {
	const navigate = useNavigate();
	const formSchema = z
		.object({
			password: z
				.string({ required_error: "Bạn phải nhập mật khẩu" })
				.min(6, { message: "Mật khẩu ít nhất phải 6 ký tự" }),
			confirmPassword: z
				.string({ required_error: "Bạn phải nhập xác nhận mật khẩu" })
				.min(6, { message: "Mật khẩu ít nhất phải 6 ký tự" }),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Mật khẩu không khớp",
			path: ["confirmPassword"],
		});
	const [isPassword, setIsPassword] = useState(false);
	const [isConfrimPassword, setIsConfrimPassword] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});
	const onSubmit = async (payload: z.infer<typeof formSchema>) => {
		try {
			const { data } = await updateForgotPassword({ ...payload, email });
			setStep(4);
			navigate("/auth/login");
			toast.success(data?.message);
		} catch (error: any) {
			toast.error(error.response!.data!.message);
		}
	};
	return (
		<div className="">
			<OverlayViolet />
			<Link
				to={"/"}
				className="dark:bg-slate-600 relative flex items-center justify-center max-w-36 mt-10 ml-12 p-3 bg-white rounded-lg shadow-lg"
			>
				<IoIosArrowRoundBack size={20} className="mr-4" /> Trang chủ
			</Link>
			<div className="dark:bg-slate-800 w-full max-w-xs md:max-w-sm mx-auto mt-5  px-8 py-9 bg-white shadow-md border border-gray-200 rounded-2xl">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className=" space-y-5">
							<h2 className="text-center text-xl font-bold">Đăng ký</h2>
							<div className=" space-y-1">
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
															className="absolute top-1/2 right-5 -translate-y-1/2 cursor-pointer"
														/>
													) : (
														<FaRegEye
															onClick={() => setIsPassword((prev) => !prev)}
															size={18}
															className="absolute top-1/2 right-5 -translate-y-1/2 cursor-pointer"
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
										name="confirmPassword"
										render={({ field }) => (
											<FormItem className="space-y-0">
												<FormLabel className="">Xác nhận mật khẩu</FormLabel>
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
															className="absolute top-1/2 right-5 -translate-y-1/2 cursor-pointer"
														/>
													) : (
														<FaRegEye
															onClick={() =>
																setIsConfrimPassword((prev) => !prev)
															}
															size={18}
															className="absolute top-1/2 right-5 -translate-y-1/2 cursor-pointer"
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
							className="w-full mt-3 mb-6 text-white text-base font-bold bg-blue-500 hover:bg-blue-400"
						>
							Thay đổi
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default ResetPassword;
