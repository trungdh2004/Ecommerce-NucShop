import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import instance from "@/config/instance";
import { cn } from "@/lib/utils";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Input } from "@/components/ui/input";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changePassword } from "@/service/account";
import { IPassword } from "@/types/auth";
import { toast } from "sonner";
import { AxiosError } from "axios";
const formSchema = z.object({
	passwordOld: z
		.string({ required_error: "Bạn phải nhập mật khẩu cũ" })
		.min(6, { message: "Mật khẩu ít nhất phải 6 ký tự" }),
	passwordNew: z
		.string({ required_error: "Bạn phải nhập mật khẩu mới" })
		.min(6, { message: "Mật khẩu ít nhất phải 6 ký tự" }),
	confirmPassword: z
		.string({ required_error: "Bạn phải nhập lại mật khẩu mới" })
		.min(6, { message: "Mật khẩu ít nhất phải 6 ký tự" }),
});
const ChangePassword = () => {
	const queryClient = useQueryClient();
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			passwordOld: "",
			passwordNew: "",
			confirmPassword: "",
		},
	});
	const [isPasswordOld, setIsPasswordOld] = useState(false);
	const [isPasswordNew, setIsPasswordNew] = useState(false);
	const [isConfirmPassword, setIsConfirmPassword] = useState(false);

	const onSubmit = async (data: IPassword) => {
		try {
			const response = await changePassword(data);
			toast.success("Thay đổi mật khẩu thành công");
			form.reset();
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error?.response?.data?.message);
			}
		}
	};
	return (
		<div className="w-full bg-white px-4 md:px-8 box-shadow rounded-md overflow-hidden">
			<div className="py-2 md:py-5 border-b border-[#efedec]">
				<h3 className="text-base md:text-lg text-[#333333] font-medium">
					Thay đổi mật khẩu
				</h3>
				<span className="text-sm md:text-base text-gray-700">
					Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
				</span>
			</div>
			<div className="pt-3 md:pt-8 pb-12  xl:px-10 max-w-[900px] w-full mx-auto">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="flex ">
							<div className="order-2 md:order-1 w-full md:pr-8 xl:pr-24">
								<FormField
									control={form.control}
									name="passwordOld"
									render={({ field }) => (
										<FormItem className="flex flex-col md:flex-row md:items-center pb-5 ">
											<FormLabel className="w-full md:w-[40%] md:text-right text-sm md:text-base text-[rgba(85,85,85,.8)] pr-4">
												Mật khẩu cũ
											</FormLabel>{" "}
											<div className="w-full">
												<div className="relative ">
													<FormControl>
														<Input
															{...field}
															type={isPasswordOld ? "text" : "password"}
															className=""
														/>
													</FormControl>
													{isPasswordOld ? (
														<FaRegEyeSlash
															onClick={() => setIsPasswordOld((prev) => !prev)}
															size={18}
															className="absolute -translate-y-1/2 cursor-pointer top-1/2 right-5 "
														/>
													) : (
														<FaRegEye
															onClick={() => setIsPasswordOld((prev) => !prev)}
															size={18}
															className="absolute -translate-y-1/2 cursor-pointer top-1/2 right-5"
														/>
													)}
												</div>
												<FormMessage className="text-xs pt-2" />
											</div>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="passwordNew"
									render={({ field }) => (
										<FormItem className="flex flex-col md:flex-row md:items-center pb-5 ">
											<FormLabel className="w-full md:w-[40%] md:text-right text-sm md:text-base text-[rgba(85,85,85,.8)] pr-4">
												Mật khẩu mới
											</FormLabel>{" "}
											<div className="w-full">
												<div className="relative ">
													<FormControl>
														<Input
															{...field}
															type={isPasswordNew ? "text" : "password"}
															className=""
														/>
													</FormControl>
													{isPasswordNew ? (
														<FaRegEyeSlash
															onClick={() => setIsPasswordNew((prev) => !prev)}
															size={18}
															className="absolute -translate-y-1/2 cursor-pointer top-1/2 right-5 "
														/>
													) : (
														<FaRegEye
															onClick={() => setIsPasswordNew((prev) => !prev)}
															size={18}
															className="absolute -translate-y-1/2 cursor-pointer top-1/2 right-5"
														/>
													)}
												</div>
												<FormMessage className="text-xs pt-2" />
											</div>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem className="flex flex-col md:flex-row md:items-center pb-5 ">
											<FormLabel className="w-full md:w-[40%] md:text-right text-sm md:text-base text-[rgba(85,85,85,.8)] pr-4">
												Nhập lại mật khẩu mới
											</FormLabel>{" "}
											<div className="w-full">
												<div className="relative ">
													<FormControl>
														<Input
															{...field}
															type={isConfirmPassword ? "text" : "password"}
															className=""
														/>
													</FormControl>
													{isConfirmPassword ? (
														<FaRegEyeSlash
															onClick={() =>
																setIsConfirmPassword((prev) => !prev)
															}
															size={18}
															className="absolute -translate-y-1/2 cursor-pointer top-1/2 right-5 "
														/>
													) : (
														<FaRegEye
															onClick={() =>
																setIsConfirmPassword((prev) => !prev)
															}
															size={18}
															className="absolute -translate-y-1/2 cursor-pointer top-1/2 right-5"
														/>
													)}
												</div>
												<FormMessage className="text-xs pt-2" />
											</div>
										</FormItem>
									)}
								/>
							</div>
						</div>
						<div className="w-full  flex justify-center my-5">
							<button
								type="submit"
								className="text-white bg-blue-500 px-5 py-2 border rounded-sm"
							>
								Cập nhật
							</button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default ChangePassword;
