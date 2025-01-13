import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
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
import { uploadFileService } from "@/service/upload";
import { useMutation } from "@tanstack/react-query";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "sonner";

import CalendarYear from "@/components/common/CalendarYear";
import { IUser } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
	full_name: z
		.string()
		.min(1, { message: "Vui lòng nhập tên của bạn!" })
		.max(50),
	phone: z
		.string()
		.length(10, { message: "Số điện thoại không đúng định dạng!" })
		.regex(/^[0-9]+$/, { message: "Số điện thoại không đúng định dạng!" })
		.optional(),
	birthDay: z.string().optional(),
});
const AccountIndex = () => {
	const { authUser, setAuthUser } = useAuth();
	const [previewUrl, setPreviewUrl] = useState(() => {
		return {
			isLoading: false,
			url: authUser?.avatarUrl || "",
		};
	});

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			full_name: authUser?.full_name,
			phone: authUser?.phone || "",
			birthDay: authUser?.birthDay || "",
			email: authUser?.email || "",
			avatarUrl: authUser?.avatarUrl || "",
		},
	});
	const { mutate } = useMutation({
		mutationFn: async (data: any) => {
			return await instance.put(`/auth/changeUser/${authUser?._id}`, data);
		},
		onSuccess: ({ data }) => {
			console.log({ data });
			if (setAuthUser) {
				console.log("cập nhập");

				setAuthUser(data.user as IUser);
			}
			toast.success("Cập nhật thông tin thành công!");
		},
		onError: (error) => {
			console.log(error);
			toast.error("Cập nhật thông tin thất bại!");
		},
	});
	const handleUploadFile = async (file: File) => {
		try {
			// setOpen();
			const formdata = new FormData();
			formdata.append("image", file);
			const { data } = await uploadFileService(formdata);
			URL.revokeObjectURL(previewUrl.url);
			setPreviewUrl({
				url: data.path,
				isLoading: false,
			});
			return data.path;
		} catch (error) {
			console.error(error);
		} finally {
			// setClose();
		}
	};

	const onSubmit = async (formData: any) => {
		try {
			const newAvatarUrl = previewUrl.url;
			console.log("date", formData.birthDay);
			mutate({ ...formData, avatarUrl: newAvatarUrl });
			console.log("formData", formData);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div className="w-full px-8 overflow-hidden bg-white rounded-md box-shadow">
			<div className="py-5 border-b border-[#efedec]">
				<h3 className="text-base md:text-lg text-[#333333] font-medium">
					Hồ Sơ Của Tôi
				</h3>
				<span className="text-sm text-gray-700 md:text-base">
					Quản lý thông tin hồ sơ để bảo mật tài khoản của bạn
				</span>
			</div>
			<div className="pt-8 pb-12 xl:px-10">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="flex flex-col md:flex-row">
							<div className="order-2 md:order-1 w-full md:w-[65%] md:pr-8 xl:pr-24">
								<FormField
									control={form.control}
									name="full_name"
									render={({ field }) => (
										<FormItem className="flex flex-col pb-5 md:flex-row md:items-center ">
											<FormLabel className="w-full md:w-[40%] md:text-right text-sm md:text-base text-[rgba(85,85,85,.8)] pr-4">
												Tên
											</FormLabel>
											<div className="w-full ">
												<FormControl>
													<Input
														placeholder=""
														{...field}
														className="text-sm md:text-base"
													/>
												</FormControl>
												<FormMessage className="pt-3" />
											</div>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem className="flex flex-col pb-5 md:flex-row md:items-center ">
											<FormLabel className="w-full md:w-[40%] md:text-right text-sm md:text-base text-[rgba(85,85,85,.8)] pr-4">
												Email
											</FormLabel>
											<FormControl>
												<Input
													readOnly
													placeholder=""
													{...field}
													className="text-sm md:text-base"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="phone"
									render={({ field }) => (
										<FormItem className="flex flex-col pb-5 md:flex-row md:items-center ">
											<FormLabel className="w-full md:w-[40%] md:text-right text-sm md:text-base text-[rgba(85,85,85,.8)] pr-4">
												Số điện thoại
											</FormLabel>
											<div className="w-full ">
												<FormControl>
													<Input
														placeholder=""
														{...field}
														className="text-sm md:text-base"
													/>
												</FormControl>
												<FormMessage className="pt-3" />
											</div>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="birthDay"
									render={({ field }) => (
										<FormItem className="flex flex-col pb-5 md:flex-row md:items-center ">
											<FormLabel className="w-full md:w-[40%] md:text-right text-sm md:text-base text-[rgba(85,85,85,.8)] pr-4">
												Ngày sinh
											</FormLabel>
											<FormControl>
												<div className="w-full">
													<Popover>
														<PopoverTrigger asChild>
															<FormControl>
																<Button
																	variant={"outline"}
																	className={cn(
																		"w-full pl-3 text-left font-normal hover:bg-white",
																		!field.value && "text-muted-foreground",
																	)}
																>
																	{field.value ? (
																		format(field.value, "dd/MM/yyyy")
																	) : (
																		<span>Ngày sinh</span>
																	)}
																	<CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
																</Button>
															</FormControl>
														</PopoverTrigger>
														<PopoverContent className="p-0 " align="start">
															{/* <Calendar
																locale={vi}
																mode="single"
																selected={field.value as any}
																onSelect={(e) => {
																	field.onChange(e?.toISOString());
																}}
																disabled={(date) =>
																	date < new Date() ||
																	date < new Date("1900-01-01")
																}
																initialFocus
															/> */}
															<CalendarYear
																value={
																	field.value
																		? new Date(field.value)
																		: undefined
																}
																onSelect={(value) => {
																	field.onChange(value?.toISOString());
																}}
																disabled={(date) =>
																	date > new Date() ||
																	date < new Date("1900-01-01")
																}
																lengthYear={40}
																initialFocus
															/>
														</PopoverContent>
													</Popover>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="order-1 md:order-2 w-full md:w-[35%] flex flex-col justify-center items-center border-b mb-10 md:mb-0 md:border-l border-gray-200 ">
								<FormField
									control={form.control}
									name="avatarUrl"
									render={({ field }) => (
										<FormItem className="flex items-center pb-8">
											<FormControl>
												<div className="flex flex-col items-center justify-center w-full">
													<div className="size-[100px]">
														<img
															src={previewUrl.url || ""}
															className="relative w-full h-full bg-gray-300 border border-gray-300 rounded-full"
															alt=""
														/>
														{previewUrl?.isLoading && (
															<div className="absolute inset-0 flex items-center justify-center w-full bg-slate-50/50">
																<AiOutlineLoading3Quarters
																	size={20}
																	strokeWidth="4px"
																	className="w-full animate-spin "
																/>
															</div>
														)}
													</div>
													<input
														type="file"
														className="hidden"
														id="avatarInput"
														accept=".jpg,.png,.webp,.jpeg"
														onChange={(event) =>
															field.onChange(async () => {
																// console.log("url", URL.createObjectURL(
																//   (event?.target as HTMLInputElement)
																//     ?.files?.[0] as File,
																// ))
																setPreviewUrl({
																	url: URL.createObjectURL(
																		(event?.target as HTMLInputElement)
																			?.files?.[0] as File,
																	),
																	isLoading: true,
																});
																form.clearErrors("avatarUrl");
																const url = await handleUploadFile(
																	(event?.target as HTMLInputElement)
																		?.files?.[0] as File,
																);
																field.onChange(url);
															})
														}
													/>
													<label
														htmlFor="avatarInput"
														className="px-4 py-2 mt-4 mb-3 text-sm border border-gray-300 rounded-sm cursor-pointer md:text-base"
													>
														Chọn Ảnh
													</label>
													<div className="flex flex-col text-[#999] text-xs md:text-base">
														<span className="">
															Dụng lượng file tối đa 1 MB
														</span>
														<span className=""> Định dạng:.JPEG, .PNG</span>
													</div>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
						<div className="w-full md:w-[40%] flex justify-center my-5">
							<button
								type="submit"
								className="px-5 py-2 text-white border rounded-sm bg-custom-500"
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

export default AccountIndex;
