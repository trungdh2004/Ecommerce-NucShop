import { TooltipComponent } from "@/components/common/TooltipComponent";
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
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
	createVoucher,
	generateCodeAuto,
	getVoucherById,
	updateVoucherById,
} from "@/service/voucher";
import { useProcessBarLoadingEventNone } from "@/store/useSidebarAdmin";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BsStars } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import InputNumberFormat from "@/components/common/InputNumberFormat";
import PopupTableService from "@/components/common/PopupTableService";

const voucherSchema = z
	.object({
		code: z.string().length(7, "Voucher có 7 kí tự"),
		name: z.string().min(1, "Tên voucher là bắt buộc"),
		description: z.string().min(1, "Mô tả voucher là bắt buộc"),
		startDate: z
			.union([z.string(), z.date()])
			.transform((val) => new Date(val)),
		endDate: z.union([z.string(), z.date()]).transform((val) => new Date(val)),
		discountType: z.enum(["fixed", "percentage"], {
			required_error: "Vui lòng chọn loại giảm giá",
		}),
		discountValue: z
			.number({
				required_error: "Giá trị giảm là bắt buộc",
				invalid_type_error: "Giá trị giảm phải là số",
			})
			.min(1, "Phải lớn hơn 0"),

		usageLimit: z
			.number({
				required_error: "Giới hạn sử dụng là bắt buộc",
				invalid_type_error: "Giới hạn sử dụng phải là số",
			})
			.min(1, "Giới hạn sử dụng phải lớn hơn 0"),
		minimumOrderValue: z
			.number({
				required_error: "Giá trị đơn hàng tối thiểu là bắt buộc",
				invalid_type_error: "Giá trị đơn hàng tối thiểu phải là số",
			})
			.min(1, "Giá trị đơn hàng tối thiểu phải lớn hơn 0"),
		maxAmount: z
			.number({
				required_error: "Giá trị đơn hàng tối thiểu là bắt buộc",
				invalid_type_error: "Giá trị đơn hàng tối thiểu phải là số",
			})
			.min(1, "Số tiền giảm tối đa lớn hơn 0"),
		status: z.enum(["active", "inactive"], {
			required_error: "Vui lòng chọn trạng thái",
		}),
		type: z.enum(["1", "2"], {
			required_error: "Vui lòng phạm vi",
		}),
		listUseProduct: z.array(z.string()),
	})
	.refine(
		(data) => {
			if (data.discountType === "percentage" && data.discountValue > 100) {
				return false;
			}
			return true;
		},
		{
			message: "Giá trị giảm tối đa là 100% cho loại giảm giá phần trăm",
			path: ["discountValue"],
		},
	)
	.refine((data) => data.startDate <= data.endDate, {
		message: "Ngày bắt đầu không được lớn hơn ngày kết thúc",
		path: ["startDate"],
	});;
export type VoucherFormValues = z.infer<typeof voucherSchema>;

const VoucherForm = () => {
	const navigate = useNavigate();
	const [openProduct, setOpenProduct] = useState(false);
	const { setOpenProcessLoadingEventNone, setCloseProcessLoadingEventNone } =
		useProcessBarLoadingEventNone();
	const { id } = useParams();
	const form = useForm<z.infer<typeof voucherSchema>>({
		resolver: zodResolver(voucherSchema),
		defaultValues: {
			name: "",
			code: "",
			description: "",
			startDate: new Date(),
			endDate: new Date(),
			discountType: "fixed",
			discountValue: 0,
			usageLimit: 0,
			minimumOrderValue: 0,
			status: "active",
			type: "1",
			listUseProduct: [],
		},
	});
	useEffect(() => {
		(async () => {
			if (id) {
				try {
					const { data } = await getVoucherById(id);
					const deafaultForm = {
						...data.data,
						discountType: data.data.discountType == 1 ? "fixed" : "percentage",
						status: data.data.status == 1 ? "active" : "inactive",
						startDate: new Date(data.data.startDate).toISOString(),
						endDate: new Date(data.data.endDate).toISOString(),
						type: data.data?.type.toString(),
					};
					console.log({ deafaultForm });

					form.reset(deafaultForm);
				} catch (error) {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data.message);
					}
				}
			}
		})();
	}, []);

	const handleCreateVoucher = async (
		payload: z.infer<typeof voucherSchema>,
  ) => {
    console.log(payload);
    
		try {
			const { status, type, listUseProduct, ...voucherData } = payload;
			const formattedData = {
				...voucherData,
				discountType: voucherData.discountType === "fixed" ? 1 : 2,
				type,
				listUseProduct: type === "1" ? [] : listUseProduct,
			};
			const { data } = await createVoucher(formattedData as any);
			toast.success(data?.message);
			navigate("/admin/product/voucher");
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error?.response?.data?.message);
			}
		}
	};
	const handleUpdateVoucher = async (
		payload: z.infer<typeof voucherSchema>,
	) => {
		try {
			const { status, type, listUseProduct, ...voucherData } = payload;
			const formattedData = {
				...voucherData,
				_id: id,
				discountType: voucherData.discountType === "fixed" ? 1 : 2,
				type,
				listUseProduct: type === "1" ? [] : listUseProduct,
			};
			const { data } = await updateVoucherById(formattedData as any);
			toast.success(data?.message);
			navigate("/admin/product/voucher");
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error?.response?.data?.message);
			}
		}
	};
	const onSubmit = async (payload: z.infer<typeof voucherSchema>) => {
		try {
			setOpenProcessLoadingEventNone();
			if (id) {
				await handleUpdateVoucher(payload);
			} else {
				await handleCreateVoucher(payload);
			}
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error?.response?.data?.message);
			}
		} finally {
			setCloseProcessLoadingEventNone();
		}
	};
	const handleGenerateCodeAuto = async () => {
		try {
			const { data } = await generateCodeAuto();
			form.setValue("code", data?.code);
		} catch (error) {
			toast.error("Tạo mã code xảy ra lỗi");
		}
	};

	const handleSelected = (arr: string[]) => {
		form.setValue("listUseProduct", arr);
		setOpenProduct(false);
	};

	return (
		<div className="">
			<h4 className="text-base font-medium md:text-xl">{`${id ? "Cập nhập mã giảm giá" : "Thêm mới mã giảm giá"}`}</h4>
			{openProduct && (
				<PopupTableService
					open={openProduct}
					handleClose={() => {
						setOpenProduct(false);
					}}
					initialSelected={form.watch("listUseProduct")}
					handleSubmit={handleSelected}
				/>
			)}
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<FormField
							control={form.control}
							name="code"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Mã voucher</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												placeholder="Nhập mã voucher"
												{...field}
												maxLength={7}
												onChange={(e) => {
													const target = e.target.value;
													const value = target.replace(/[^a-zA-Z0-9]/g, "");
													console.log({ value });

													const valueUpperCase =
														target !== "" ? target.toLocaleUpperCase() : "";
													field.onChange(valueUpperCase);
												}}
											/>

											<TooltipComponent label="Tự tạo mã voucher không bị trùng lặp">
												<div
													className="absolute flex items-center justify-center -translate-y-1/2 rounded-full cursor-pointer size-7 right-1 top-1/2 group hover:bg-gray-50"
													onClick={handleGenerateCodeAuto}
												>
													<BsStars
														size={20}
														className="text-blue-500 group-hover:text-blue-700"
													/>
												</div>
											</TooltipComponent>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tên</FormLabel>
									<FormControl>
										<Input placeholder="Nhập tên voucher" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<FormField
							control={form.control}
							name="status"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Trạng thái</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Chọn trạng thái" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="active">Hoạt động</SelectItem>
											<SelectItem value="inactive">Không hoạt động</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="usageLimit"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Số lượng sử dụng</FormLabel>
									<FormControl>
										<InputNumberFormat
											value={field.value}
											onChange={(value) => {
												field.onChange(value.floatValue);
											}}
											suffix=""
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<FormField
							control={form.control}
							name="discountType"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Loại giảm giá</FormLabel>
									<Select
										onValueChange={(value) => {
											field.onChange(value);
											form.setValue("discountValue", 0);
										}}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Chọn loại giảm giá" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="fixed">Số tiền</SelectItem>
											<SelectItem value="percentage">Số phần trăm</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="discountValue"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Giá trị giảm</FormLabel>
									<FormControl>
										<InputNumberFormat
											value={field.value}
											isAllowed={(value) => {
												const valueCheck = value.floatValue || 0;
												if (form.watch("discountType") === "percentage") {
													const check = valueCheck > 100;
													if (check) return false;
												}
												return true;
											}}
											onChange={(value) => {
												const valueCheck = value.floatValue || 0;
												if (form.watch("discountType") === "fixed") {
													form.setValue("maxAmount", valueCheck);
												}
												field.onChange(valueCheck);
											}}
											suffix={
												form.watch("discountType") === "fixed" ? "đ" : "%"
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<FormField
							control={form.control}
							name="minimumOrderValue"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Giá trị đơn hàng tối thiểu</FormLabel>
									<FormControl>
										<InputNumberFormat
											value={field.value}
											onChange={(value) => {
												field.onChange(value.floatValue);
											}}
											suffix="đ"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="maxAmount"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Số tiền giảm tối đa</FormLabel>
									<FormControl>
										<InputNumberFormat
											value={field.value}
											onChange={(value) => {
												field.onChange(value.floatValue);
											}}
											suffix="đ"
											disabled={form.watch("discountType") === "fixed"}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* ngày */}
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<FormField
							control={form.control}
							name="startDate"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Ngày bắt đầu</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant={"outline"}
													className={`w-full pl-3 text-left font-normal ${
														!field.value && "text-muted-foreground"
													}`}
												>
													{field.value ? (
														format(field.value, "dd/MM/yyyy")
													) : (
														<span>Chọn ngày</span>
													)}
													<CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={field.value}
												onSelect={(e) => {
													field.onChange(e?.toISOString());
												}}
												disabled={(date) => {
													const newDate = new Date();
													newDate.setDate(newDate.getDate() - 1);

													return (
														date < newDate || date < new Date("1900-01-01")
													);
												}}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="endDate"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Ngày kết thúc</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant={"outline"}
													className={`w-full pl-3 text-left font-normal ${
														!field.value && "text-muted-foreground"
													}`}
												>
													{field.value ? (
														format(field.value, "dd/MM/yyyy")
													) : (
														<span>Chọn ngày</span>
													)}
													<CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={field.value}
												onSelect={(e) => {
													field.onChange(e?.toISOString());
												}}
												disabled={(date) =>
													date < new Date() || date < new Date("1900-01-01")
												}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<FormField
							control={form.control}
							name="type"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phạm vi voucher</FormLabel>
									<Select
										onValueChange={(value) => {
											field.onChange(value);
										}}
										value={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Chọn loại giảm giá" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="1">Tất cả</SelectItem>
											<SelectItem value="2">Một số sản phẩm</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div>
							<FormLabel>Chọn sản phẩm </FormLabel>
							<Button
								type="button"
								variant={"default"}
								className="justify-start w-full mt-2 font-normal text-left text-black bg-white border hover:bg-gray-50"
								onClick={() => {
									setOpenProduct(true);
								}}
								disabled={form.watch("type") === "1"}
							>
								{form.getValues("listUseProduct")?.length} sản phẩm đã chọn
							</Button>
						</div>
					</div>

					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Mô tả</FormLabel>
								<FormControl>
									<Textarea placeholder="Nhập mô tả voucher" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						type="submit"
						className="w-full text-white bg-blue-600 hover:bg-blue-700"
					>
						Lưu
					</Button>
				</form>
			</Form>
		</div>
	);
};

export default VoucherForm;
