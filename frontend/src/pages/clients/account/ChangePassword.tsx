import { useState } from "react";
import { useForm } from "react-hook-form";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { changePassword } from "@/service/account";
import { IPassword } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { toast } from "sonner";
import { boolean, z } from "zod";
import { useAuth } from "@/hooks/auth";
import { cn } from "@/lib/utils";
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
	const [checkUid, setCheckUid] = useState(false);
	const { authUser } = useAuth();
	console.log("authUser", authUser?.uid);
	const onSubmit = async (data: IPassword) => {
		try {
			await changePassword(data);
			toast.success("Thay đổi mật khẩu thành công");
			form.reset();
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error?.response?.data?.message);
			}
		}
	};
	return (
		<div className="w-full px-4 overflow-hidden bg-white rounded-md md:px-8 box-shadow">
			<div className="py-2 md:py-5 border-b border-[#efedec]">
				<h3 className="text-base md:text-lg text-[#333333] font-medium">
					Thay đổi mật khẩu
				</h3>
				<span className="text-sm text-gray-700 md:text-base">
					Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
				</span>
			</div>
			<div className="pt-3 md:pt-8 pb-12  xl:px-10 max-w-[900px] w-full mx-auto">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="flex ">
							<div className="order-2 w-full md:order-1 md:pr-8 xl:pr-24">
								<FormField
									control={form.control}
									name="passwordOld"
									render={({ field }) => (
										<FormItem className="flex flex-col pb-5 md:flex-row md:items-center ">
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
															disabled={!!authUser?.uid}
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
												<FormMessage className="pt-2 text-xs" />
											</div>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="passwordNew"
									render={({ field }) => (
										<FormItem className="flex flex-col pb-5 md:flex-row md:items-center ">
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
															disabled={!!authUser?.uid}
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
												<FormMessage className="pt-2 text-xs" />
											</div>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem className="flex flex-col pb-5 md:flex-row md:items-center ">
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
															disabled={!!authUser?.uid}
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
												<FormMessage className="pt-2 text-xs" />
											</div>
										</FormItem>
									)}
								/>
							</div>
						</div>
						<div className="flex justify-center w-full my-5">
							<button
								type="submit"
								className={cn(
									!!authUser?.uid
										? "hidden"
										: "px-5 py-2 text-white border rounded-sm bg-custom-500",
								)}
								// disabled={}
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
