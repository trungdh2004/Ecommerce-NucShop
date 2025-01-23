import CalendarYear from "@/components/common/CalendarYear";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import AddressLocation from "@/pages/clients/address/AddressLocation";
import { callCity, callCommune, callDistrict } from "@/service/address";
import { changeAccountShipper } from "@/service/shipper";
import { uploadFileService } from "@/service/upload";
import useStoreShipper from "@/store/useCurrentShipper";
import { ICity, ICommune, IDistrict } from "@/types/address";
import { IShipper } from "@/types/shipper.interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "sonner";
import { z } from "zod";

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
const AccountShipperIndex = () => {
	const [districts, setDistricts] = useState<IDistrict[]>([]);
	const [commune, setCommune] = useState<ICommune[]>([]);
	const { current, setCurrent } = useStoreShipper();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			fullName: current?.fullName || "",
			phone: current?.phone || "",
			idCitizen: current?.idCitizen || "",
			birthDate: current?.birthDate ? new Date(current?.birthDate) : new Date(),
			avatar: current?.avatar || "",
			address: current?.address || "",
			city: current?.city || {
				idProvince: "",
				name: "",
			},
			district: current?.district || {
				idDistrict: "",
				name: "",
			},
			commune: current?.commune || {
				idCommune: "",
				name: "",
			},
		},
	});
	const [previewUrl, setPreviewUrl] = useState({
		isLoading: false,
		url: current?.avatar || "",
	});

	// console.log("shipper", current);
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
	const { mutate } = useMutation({
		mutationFn: async (data: IShipper) => {
			return changeAccountShipper(data as IShipper);
		},
		onSuccess: (data: any) => {
			if (setCurrent) {
				console.log("data updated", data?.data?.data);
				setCurrent(data?.data?.data);
			}
			toast.success("Cập nhật thông tin thành công");
		},
		onError: (error) => {
			console.error(error);
			if (error instanceof AxiosError) {
				toast.error(error.response?.data?.message);
			}
		},
	});
	const onSubmit = async (value: z.infer<typeof formSchema>) => {
		try {
			mutate(value as IShipper);
			// const { data } = ;
			// console.log("datassssssssss", data);
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error?.response?.data?.message);
			}
		}
	};
	const { data: citys } = useQuery<ICity[]>({
		queryKey: ["city"],
		queryFn: async () => {
			const { data } = await callCity();
			return data;
		},
		staleTime: Infinity,
	});
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

	return (
		<div className="padding">
			<header className="sticky top-0 z-10 w-full p-2 md:px-4 md:mb-4 bg-main">
				<h2 className="text-xl font-semibold leading-8 sm:text-2xl">
					Thông tin cá nhân
				</h2>
				<p className="text-base font-normal">
					Quản lý thông tin hồ sơ để bảo mật tài khoản
				</p>
			</header>

			<div className="pt-8 pb-12 xl:px-10">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="flex flex-col md:flex-row">
							<div className="order-2 md:order-1 w-full md:w-[65%] md:pr-8 xl:pr-24">
								<FormField
									control={form.control}
									name="fullName"
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
									name="idCitizen"
									render={({ field }) => (
										<FormItem className="flex flex-col pb-5 md:flex-row md:items-center ">
											<FormLabel className="w-full md:w-[40%] md:text-right text-sm md:text-base text-[rgba(85,85,85,.8)] pr-4">
												Căn cước công dân
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
									name="birthDate"
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
														<PopoverContent
															className="w-auto p-0"
															align="start"
														>
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
								<FormField
									control={form.control}
									name="address"
									render={({ field }) => (
										<FormItem className="flex flex-col pb-5 md:flex-row md:items-center ">
											<FormLabel className="w-full md:w-[40%] md:text-right text-sm md:text-base text-[rgba(85,85,85,.8)] pr-4">
												Địa chỉ thường chú
											</FormLabel>
											<div className="w-full ">
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
												<FormMessage className="pt-3" />
											</div>
										</FormItem>
									)}
								/>
							</div>

							<div className="order-1 md:order-2 w-full md:w-[35%] flex flex-col justify-center items-center border-b mb-10 md:mb-0 md:border-l border-gray-200 ">
								<FormField
									control={form.control}
									name="avatar"
									render={({ field }) => (
										<FormItem className="flex items-center pb-8">
											<FormControl>
												<div className="flex flex-col items-center justify-center w-full">
													<div className="size-[100px]">
														<img
															src={previewUrl.url || "/avtUser.png"}
															className="object-cover w-full h-full rounded-full "
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
																form.clearErrors("avatar");
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
								className="px-5 py-2 text-white bg-blue-500 border rounded-sm"
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

export default AccountShipperIndex;
