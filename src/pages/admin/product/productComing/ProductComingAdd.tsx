import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import SelectPagingComponent from "@/components/common/SelectPagingComponent";
import { CalendarIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
	createProductComing,
	getProductComingById,
	updateProductComing,
} from "@/service/product";
import { toast } from "sonner";
import { vi } from "date-fns/locale";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Label } from "recharts";
import { useProcessBarLoadingEventNone } from "@/store/useSidebarAdmin";
interface Props {
	open: boolean | string;
	close: () => void;
	handleCustomer: () => void;
}
interface DataComingState {
	productId: string;
	date: Date | undefined;
	active: boolean;
}

const ProductComingAdd = ({ open, close, handleCustomer }: Props) => {
	const { setOpenProcessLoadingEventNone, setCloseProcessLoadingEventNone } =
		useProcessBarLoadingEventNone();
	const FormSchema = z.object({
		product: z.object({
			_id: z.string(),
			name: z.string(),
			thumbnail: z.string(),
		}),
		date: z.date({
			required_error: "Chưa chọn ngày kết thúc",
		}),
		active: z.boolean().default(false).optional(),
	});
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			date: undefined,
			active: false,
		},
	});
	const createProduct = async (dataComing: DataComingState) => {
		try {
			const { data } = await createProductComing(dataComing);
			toast.success("Thêm sản phẩm chờ thành công");
			handleCustomer();
			close();
			return;
		} catch (error) {
			console.error(error);
		}
	};

	const updateProduct = async (dataComing: DataComingState) => {
		try {
			const { data } = await updateProductComing(open as string, dataComing);
			toast.success("Cập nhật sản phẩm chờ thành công");
			handleCustomer();
			close();
			return;
		} catch (error) {
			console.error(error);
		}
	};
	useEffect(() => {
		if (typeof open === "string") {
			(async () => {
				try {
					const { data } = await getProductComingById(open);
					const newDataReset = {
						...data.product,
						date: new Date(data.product.date),
					};
					form.reset(newDataReset);
				} catch (error) {
					console.error("Error:", error);
				}
			})();
		}
	}, [open]);

	const onSubmit = async (data: any) => {
		const dataPost = {
			productId: data.product._id,
			date: data.date,
			active: data.active,
		};
		if (typeof open === "string") {
			updateProduct(dataPost);
		} else {
			createProduct(dataPost);
		}
	};

	return (
		<div>
			<Dialog open={!!open} onOpenChange={close}>
				<DialogContent className="sm:max-w-[725px] max-h-[600px]">
					<DialogHeader>
						<DialogTitle>
							{typeof open === "string" ? "Cập nhật" : "Thêm"} sản phẩm chờ
						</DialogTitle>
					</DialogHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<FormField
								control={form.control}
								name="product"
								render={({ field }) => {
									return (
										<FormItem>
											<FormControl>
												<SelectPagingComponent<any>
													value={field.value}
													onChange={(e) => {
														return field.onChange(e);
													}}
													url="product/pagingProductOfVoucher"
													getOptionLabel={(option) => (
														<div className="flex items-center gap-3">
															<img
																src={option.thumbnail}
																alt=""
																className="w-8 h-8"
															/>
															<span className="ml-2 w-[500px] truncate">
																{option.name}
															</span>
														</div>
													)}
													getOptionValue={(option) => option._id}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									);
								}}
							/>
							<div className="flex justify-between items-center  gap-4">
								<FormField
									control={form.control}
									name="date"
									render={({ field }) => (
										<FormItem className="flex flex-col w-5/6">
											<FormLabel>Ngày kết thúc</FormLabel>
											<Popover>
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															variant={"outline"}
															className={cn(
																"w-full pl-3 text-left font-normal",
																!field.value && "text-muted-foreground",
															)}
														>
															{field.value ? (
																format(field.value, "dd/MM/yyyy")
															) : (
																<span>Chọn ngày</span>
															)}
															<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent className=" p-0" align="start">
													<Calendar
														mode="single"
														selected={field.value}
														onSelect={field.onChange}
														disabled={(date) => {
															const today = new Date();
															today.setHours(0, 0, 0, 0);
															return (
																date < today || date < new Date("1900-01-01")
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
									name="active"
									render={({ field }) => {
										return (
											<FormItem className="w-2/6">
												<FormLabel>
													<div className="flex flex-row items-center space-x-3 space-y-0 rounded-sm px-2 h-10 border mt-6 hover:bg-slate-100 cursor-pointer">
														<FormControl>
															<Checkbox
																checked={field.value}
																onCheckedChange={field.onChange}
															/>
														</FormControl>
														<div>Hoạt động</div>
													</div>
												</FormLabel>
											</FormItem>
										);
									}}
								/>
							</div>
							<Button type="submit">
								{typeof open === "string" ? "Cập nhật" : "Thêm"}
							</Button>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default ProductComingAdd;
