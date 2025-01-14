import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
	addCategory,
	getCategory,
	updateCategory,
} from "@/service/category-admin";
import { uploadFileService } from "@/service/upload";
import {
	useProcessBarLoading,
	useProcessBarLoadingEventNone,
} from "@/store/useSidebarAdmin";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { ImageType } from "react-images-uploading";
import { toast } from "sonner";
import { z } from "zod";

interface FormDialog {
	open: boolean | string;
	title?: "Thêm danh mục" | "Cập nhật";
	labelConfirm?: string;
	handleClose: () => void;
	handlePaging: () => void;
}

const formSchema = z.object({
	name: z
		.string({
			message: "Tên danh mục không được để trống",
		})
		.min(1, {
			message: "Tên danh mục không được để trống",
		}),
	thumbnail: z
		.object({
			url: z.string().optional(),
			file: z.instanceof(File).optional(),
		})
		.refine(
			(data) => {
				return !!data.url;
			},
			{ message: "Nhập ảnh khác" },
		),
	description: z
		.string({
			message: "Mô tả danh mục không được để trống",
		})
		.min(1, {
			message: "Mô tả danh mục không được để trống",
		}),
});
const CategoryAdd = ({
	title,
	open,
	handleClose,
	handlePaging,
}: FormDialog) => {
	const { setOpenProcessLoadingEventNone, setCloseProcessLoadingEventNone } =
		useProcessBarLoadingEventNone();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			thumbnail: { url: "" },
			description: "",
		},
	});
	console.log(open);
	const { setOpen, setClose } = useProcessBarLoading();
	const [isPending] = useState(false);
	const [previewUrl, setPreviewUrl] = useState({
		isLoading: false,
		url: "",
	});
	const [image, setImage] = useState<ImageType>({});
	const handleUploadFile = async (file: File) => {
		try {
			setOpen();
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
			setClose();
		}
	};

	const onHandleUpdate = async (dataForm: any) => {
		try {
			await updateCategory(open, dataForm);
			handleClose();
			handlePaging();
			toast.success("Bạn cập nhật danh mục thành công");
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setCloseProcessLoadingEventNone();
		}
	};
	const onHandleAdd = async (dataForm: any) => {
		try {
			await addCategory(dataForm);
			form.reset();
			handleClose();
			handlePaging();
			toast.success("Bạn thêm danh mục thành công");
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setCloseProcessLoadingEventNone();
		}
	};

	useEffect(() => {
		if (typeof open === "string") {
			(async () => {
				try {
					const { data } = await getCategory(open);
					const dataReset = {
						...data.data,
						thumbnail: { url: data.data.thumbnail },
					};
					setImage({ dataURL: data.data.thumbnail });
					form.reset(dataReset);
				} catch (error) {
					console.error("Error:", error);
				}
			})();
		}
	}, [open]);

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		setOpenProcessLoadingEventNone();
		let url = data.thumbnail.url;
		if (data?.thumbnail?.file) {
			url = await handleUploadFile(data?.thumbnail?.file as File);
		}
		const dataPush = { ...data, thumbnail: url };
		if (typeof open === "string") {
			onHandleUpdate(dataPush);
		} else {
			onHandleAdd(dataPush);
		}
	};

	return (
		<div>
			<Dialog open={!!open} onOpenChange={handleClose}>
				<DialogTrigger asChild>
					<Button variant="outline">{title}</Button>
				</DialogTrigger>
				<DialogContent className="w-[90%] sm:max-w-[660px] rounded-md max-h-[90vh] p-2 sm:p-4 overflow-y-auto">
					<DialogHeader>
						<DialogTitle>
							{typeof open === "string" ? "Cập nhật" : "Thêm danh mục"}
						</DialogTitle>
					</DialogHeader>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tên danh mục</FormLabel>
										<FormControl>
											<Input placeholder="Tên" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								disabled={isPending}
								control={form.control}
								name="thumbnail"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Ảnh sản phẩm</FormLabel>
										<FormControl>
											<div className="w-full ">
												<label
													htmlFor="file-upload"
													className={cn("w-full relative ")}
												>
													<div className="relative w-full bg-white border rounded-sm">
														<div
															className={cn(
																"w-full h-[160px] flex justify-center items-center flex-col",
																image?.dataURL && "hidden",
															)}
														>
															<AiOutlineCloudUpload size={50} strokeWidth={1} />
															<h3 className="mt-2 text-sm font-medium text-gray-900">
																<span>Chọn ảnh</span>
															</h3>
															<p className="mt-1 text-xs text-gray-500">
																PNG, JPG, GIF.
															</p>
														</div>

														<div
															className={cn(
																" relative flex justify-center items-center h-[160px]",
																image?.dataURL ? "" : "hidden",
															)}
														>
															<img
																src={image?.dataURL}
																className={cn(
																	"size-[140px] object-cover border border-slate-100",
																)}
																id="preview"
															/>
														</div>
													</div>
												</label>
												<input
													type="file"
													name=""
													id="file-upload"
													accept="image/jpeg, image/png,image/svg,image/jpg,image/webp"
													onChange={(event) => {
														const file = (event?.target as HTMLInputElement)
															?.files?.[0] as File;
														const url = URL.createObjectURL(file);
														setImage({ dataURL: url, file: file });
														field.onChange({ url, file });
														form.clearErrors("thumbnail");
													}}
													hidden
													className="hidden outline-none focus-visible:ring-0 "
												/>
											</div>
										</FormControl>

										<FormMessage className="text-xs" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Mô tả</FormLabel>
										<FormControl>
											<Input placeholder="Mô tả" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit">
								{typeof open === "string" ? "Cập nhật" : "Thêm danh mục"}
							</Button>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default CategoryAdd;
