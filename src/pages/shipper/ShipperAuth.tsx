import OverlayViolet from "@/components/OverlayViolet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { format } from "date-fns";
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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { vi } from "date-fns/locale";
import AddressLocation from "../clients/address/AddressLocation";
import { useQuery } from "@tanstack/react-query";
import { callCity, callCommune, callDistrict } from "@/service/address";
import InputNumber from "@/components/common/InputNumber";
import {
	AiOutlineCloudUpload,
	AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { uploadFileService } from "@/service/upload";
import { registerShipper } from "@/service/shipper";
import { IShipper } from "@/types/shipper.interface";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

interface ICity {
	idProvince: string;
	name: string;
}

interface IDistrict {
	idDistrict: string;
	name: string;
}
interface ICommune {
	idCommune: string;
	name: string;
}

const formSchema = z.object({
	fullName: z.string({ required_error: "Bạn chưa  nhập tên" }),
	phone: z.string().regex(/^(\+84|0)(3|5|7|8|9)\d{8}$/, {
		message: "Số điện thoại không hợp lệ",
	}),
	idCitizen: z.string().regex(/^[0-9]{12}$/, {
		message: "Số căn cước không hợp lệ",
	}),
	birthDate: z.date({
		required_error: "Chưa nhập ngày sinh",
	}),
	avatar: z.string(),
	address: z.string({
		message: "Bạn phải nhập địa chỉ",
	}),
	city: z.object({
		idProvince: z.string(),
		name: z.string(),
	}),
	district: z
		.object({
			idDistrict: z.string(),
			name: z.string(),
		})
		.nullable(),
	commune: z
		.object({
			idCommune: z.string(),
			name: z.string(),
		})
		.nullable(),
});

const ShipperAuth = () => {
	const router = useNavigate();
	const [districts, setDistricts] = useState<IDistrict[]>([]);
	const [commune, setCommune] = useState<ICommune[]>([]);
	const [previewUrl, setPreviewUrl] = useState({
		isLoading: false,
		url: "",
	});
	const { data: citys, isLoading } = useQuery<ICity[]>({
		queryKey: ["city"],
		queryFn: async () => {
			const { data } = await callCity();
			return data;
		},
		staleTime: Infinity,
	});
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});
	const onSubmit = async (payload: z.infer<typeof formSchema>) => {
		try {
			console.log("payload", payload);
			const { data } = await registerShipper(payload as IShipper);
			toast.success("Đăng kí tài khoản thành công");
			router("/shipper/pending");
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error.response?.data?.message);
			}
		}
	};

	const handleOnChangeCity = async (value: ICity) => {
		try {
			form.setValue("city", value);
			form.setValue("address", value.name);
			setDistricts([]);
			const { data } = await callDistrict(value.idProvince);
			setDistricts(data);
			setCommune([]);
		} catch (error: any) {
			toast.error(error.response!.data!.message);
		}
	};

	const handleOnChangeDistrict = async (value: IDistrict) => {
		try {
			form.setValue("district", value);
			form.setValue("commune", null);
			const address = form.getValues("city")?.name;
			const { data } = await callCommune(value.idDistrict);
			setCommune(data);
		} catch (error: any) {
			toast.error(error.response!.data!.message);
		}
	};

	const handleOnChangeCommune = (value: ICommune) => {
		const address = `${value.name},${form.watch("district")?.name},${form.watch("city")?.name}`;
		form.setValue("address", address);
		form.setValue("commune", value);
		form.clearErrors("address");
	};

	const handleUploadFile = async (file: File) => {
		const formdata = new FormData();
		formdata.append("image", file);
		const { data } = await uploadFileService(formdata);
		setPreviewUrl({ isLoading: false, url: data.path });
		return data.path;
	};

	return (
		<div className="h-[100vh] ">
			<OverlayViolet />
			<div className="flex items-center justify-center min-h-screen py-4 px-2 w-full">
				<div className="flex gap-4 justify-around w-full">
					<div className="hidden md:flex  justify-center items-center max-w-[400px]">
						<img src="/shipperAuth.png" alt="" />
					</div>
					<div className="dark:bg-slate-800 w-full max-w-xs md:max-w-sm px-2 md:px-4 lg:px-4 py-4 bg-white shadow-md border border-gray-200 rounded-2xl">
						<div>
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)}>
									<div className="space-y-2">
										<h2 className="text-center text-2xl font-bold col-span-2">
											Thông tin đăng kí
										</h2>
										{/* end line */}
										<div className="flex items-center justify-center ">
											<FormField
												control={form.control}
												name="avatar"
												render={({ field }) => (
													<FormItem className="flex flex-wrap  items-center ">
														<label
															htmlFor="file-upload"
															className={cn(
																"size-[100px] relative rounded-full border cursor-pointer overflow-hidden",
																form.formState.errors.avatar &&
																	"border-red-500",
															)}
															id=""
														>
															<div
																className={cn(
																	"flex flex-col  justify-center items-center w-full h-full ",
																	previewUrl.url && "hidden",
																)}
															>
																<AiOutlineCloudUpload
																	size={30}
																	strokeWidth={1}
																/>
																<p className="text-sm">Chọn ảnh</p>
															</div>
															<img
																src={previewUrl.url}
																className={cn(
																	"w-full relative h-full object-cover",
																	previewUrl.url ? "" : "hidden",
																)}
																id="preview"
															/>
															{previewUrl?.isLoading && (
																<div className="absolute bg-slate-50/50 w-full inset-0 flex items-center justify-center">
																	<AiOutlineLoading3Quarters
																		size={20}
																		strokeWidth="4px"
																		className="animate-spin w-full "
																	/>
																</div>
															)}
														</label>
														<FormControl>
															<input
																type="file"
																name=""
																id="file-upload"
																onChange={(event) =>
																	field.onChange(async () => {
																		setPreviewUrl({
																			url: URL.createObjectURL(
																				(event?.target as HTMLInputElement)
																					?.files?.[0] as File,
																			),
																			isLoading: true,
																		});
																		form.setValue("avatar", previewUrl.url);
																		form.clearErrors("avatar");
																		const url = await handleUploadFile(
																			(event?.target as HTMLInputElement)
																				?.files?.[0] as File,
																		);
																		form.setValue("avatar", url);
																		URL.revokeObjectURL(previewUrl.url);
																	})
																}
																hidden
																className="hidden outline-none focus-visible:ring-0 "
															/>
														</FormControl>
													</FormItem>
												)}
											/>
										</div>
										<div className="">
											<FormField
												control={form.control}
												name="fullName"
												render={({ field }) => (
													<FormItem className="space-y-0">
														<FormLabel className="text-start">
															Họ và tên
														</FormLabel>
														<FormControl className="">
															<Input {...field} className="" />
														</FormControl>
														<FormMessage className="text-xs" />
													</FormItem>
												)}
											/>
										</div>
										<div className="">
											<FormField
												control={form.control}
												name="phone"
												render={({ field }) => (
													<FormItem className="space-y-0">
														<FormLabel className="text-start">
															Số điện thoại
														</FormLabel>
														<FormControl className="">
															<InputNumber {...field} isNumeric />
														</FormControl>
														<FormMessage className="text-xs" />
													</FormItem>
												)}
											/>
										</div>
										<div className="">
											<FormField
												control={form.control}
												name="idCitizen"
												render={({ field }) => (
													<FormItem className="space-y-0">
														<FormLabel className="text-start">
															Căn cước công dân
														</FormLabel>
														<FormControl className="">
															<InputNumber {...field} isNumeric />
														</FormControl>
														<FormMessage className="text-xs" />
													</FormItem>
												)}
											/>
										</div>
										<div>
											<FormField
												control={form.control}
												name="birthDate"
												render={({ field }) => (
													<FormItem className="flex flex-col">
														<FormLabel>Ngày sinh</FormLabel>
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
																		<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
																	</Button>
																</FormControl>
															</PopoverTrigger>
															<PopoverContent
																className="w-auto p-0"
																align="start"
															>
																<Calendar
																	mode="single"
																	selected={field.value}
																	onSelect={field.onChange}
																	disabled={(date) =>
																		date > new Date() ||
																		date < new Date("1900-01-01")
																	}
																	initialFocus
																	locale={vi}
																/>
															</PopoverContent>
														</Popover>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
										<div>
											<FormField
												control={form.control}
												name="address"
												render={({ field }) => {
													return (
														<FormItem className="flex flex-col">
															<FormLabel>Địa chỉ thường chú</FormLabel>
															<AddressLocation
																field={field}
																citys={citys || []}
																districts={districts}
																commune={commune}
																iCity={form.watch("city")}
																idDistrict={form.watch("district")}
																idCommune={form.watch("commune")}
																handleOnChangeCity={handleOnChangeCity}
																handleOnChangeDistrict={handleOnChangeDistrict}
																handleOnChangeCommune={handleOnChangeCommune}
															/>
															<FormMessage />
														</FormItem>
													);
												}}
											/>
										</div>
									</div>
									<Button
										type="submit"
										className="w-full mt-3 text-white text-base font-bold bg-blue-500 hover:bg-blue-400"
										disabled={previewUrl?.isLoading}
									>
										{previewUrl?.isLoading && (
											<AiOutlineLoading3Quarters
												size={20}
												className="animate-spin text-white mr-2"
											/>
										)}{" "}
										Đăng kí
									</Button>
								</form>
							</Form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ShipperAuth;
