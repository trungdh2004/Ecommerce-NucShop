import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { formatCurrency } from "@/common/func";
import FroalaEditor from "@/components/common/Froala";
import InputNumberFormat from "@/components/common/InputNumberFormat";
import {
	ListColorComponent,
	ListSizeComponent,
} from "@/components/common/Product";
import SelectComponent from "@/components/common/SelectComponent";
import { TooltipComponent } from "@/components/common/TooltipComponent";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { getAllCategory } from "@/service/category-admin";
import { getAllColor } from "@/service/color";
import { getProductById, updateProductById } from "@/service/product";
import { getAllSize } from "@/service/size-admin";
import { uploadFileService, uploadMultipleFileService } from "@/service/upload";
import {
	useProcessBarLoading,
	useProcessBarLoadingEventNone,
} from "@/store/useSidebarAdmin";
import { IColor, IProduct } from "@/types/typeProduct";
import { ISize } from "@/types/variants";
import { useMutation } from "@tanstack/react-query";
import {
	AiFillCloseCircle,
	AiOutlineCloudUpload,
	AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { BsStars } from "react-icons/bs";
import { CiCirclePlus } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const formSchema = z
	.object({
		name: z.string().nonempty({ message: "Nhập tên sản phẩm" }),
		price: z.number().min(1, "Phải lớn hơn 0"),
		description: z.string().nonempty("Nhập mô tả sản phẩm"),
		discount: z.number().min(1, "Phải lớn hơn 0"),
		is_hot: z.boolean(),
		is_simple: z.boolean(),
		quantity: z.number(),
		category: z
			.object({
				_id: z.string(),
				name: z.string(),
			})
			.nullable()
			.refine(
				(data) => {
					if (!data?._id) return false;
					return true;
				},
				{
					message: "Bạn chưa nhập loại sản phẩm",
				},
			),
		attributes: z.array(
			z.object({
				color: z
					.object({
						_id: z.string().nonempty("Bạn chưa nhập loại sản phẩm"),
						name: z.string(),
						code: z.string(),
					})
					.nullable()
					.refine(
						(data) => {
							if (!data) return false;
							if (!data?._id) return false;
							return true;
						},
						{
							message: "Màu",
						},
					),
				size: z
					.object({
						_id: z.string().nonempty("Bạn chưa nhập loại sản phẩm"),
						name: z.string(),
					})
					.nullable()
					.refine(
						(data) => {
							if (!data) return false;
							if (!data?._id) return false;
							return true;
						},
						{
							message: "Kích thước",
						},
					),
				price: z.number().min(1, "Phải lớn hơn 0"),
				quantity: z.number().min(1, "Phải lớn hơn 0"),
				discount: z.number().min(1, "Phải lớn hơn 0"),
				_id: z.string().optional(),
			}),
		),
		featured: z.boolean(),
		thumbnail: z.string().refine(
			(data) => {
				return !!data;
			},
			{ message: "Nhập ảnh sản phẩm" },
		),
		images: z
			.array(
				z.object({
					url: z.string(),
					file: z.instanceof(File).optional(),
				}),
			)
			.refine(
				(data) => {
					return data.length !== 0;
				},
				{ message: "Nhập ảnh khác" },
			),
	})
	.refine(
		(data) => {
			if (data.is_simple) {
				const check = data.quantity > 0;
				return check;
			}
			return true;
		},
		{
			message: "Số lượng phải lớn hơn 0",
			path: ["quantity"], // Chỉ rõ trường bị lỗi
		},
	)
	.refine(
		(data) => {
			console.log("data", data);
			if (data.discount > data.price) {
				return false;
			}
			return true;
		},
		{
			message: "Giá giảm phải nhỏ hơn giá gốc",
			path: ["discount"],
		},
	)
	.superRefine((data, ctx) => {
		if (!data.is_simple && (!data.attributes || data.attributes.length === 0)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Chưa nhập biến thể",
				path: ["attributes"],
			});
		}

		if (data.is_simple) {
			// Nếu is_simple là true, cho phép attributes là mảng rỗng
			if (data.attributes && data.attributes.length > 0) {
				// Nếu có attributes, không yêu cầu các trường con
				data.attributes.forEach((attr) => {
					// const colorPath = ["attributes", index, "color"];
					// const sizePath = ["attributes", index, "size"];
					// const pricePath = ["attributes", index, "price"];
					// const quantityPath = ["attributes", index, "quantity"];
					// const discountPath = ["attributes", index, "discount"];

					if (attr.color) {
						z.object({
							_id: z.string().optional(),
							name: z.string().optional(),
							code: z.string().optional(),
						})
							.nullable()
							.parse(attr.color);
					}
					if (attr.size) {
						z.object({
							_id: z.string().optional(),
							name: z.string().optional(),
						})
							.nullable()
							.parse(attr.size);
					}
					if (attr.price !== undefined) {
						z.number().optional().parse(attr.price);
					}
					if (attr.quantity !== undefined) {
						z.number().optional().parse(attr.quantity);
					}
					if (attr.discount !== undefined) {
						z.number().optional().parse(attr.discount);
					}
				});
			}
		}

		if (data.attributes && data.attributes.length > 0) {
			const combinations = new Set();
			data.attributes.forEach((attr, index) => {
				if (attr.discount > attr.price) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: "Giá giảm phải nhỏ hơn giá gốc",
						path: ["attributes", index, "discount"],
					});
				}
				const combination = `${attr.color?._id}-${attr.size?._id}`;
				if (combinations.has(combination)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: "Trùng lặp màu sắc và kích thước",
						path: ["attributes", index],
					});
				} else {
					combinations.add(combination);
				}
			});
		}
	});

type FormSchemaType = z.infer<typeof formSchema>;

// Định nghĩa kiểu cho một thuộc tính (attribute)
type AttributeType = {
	color: {
		_id: string;
		name: string;
		code: string;
	} | null;
	size: {
		_id: string;
		name: string;
	} | null;
	price: number;
	quantity: number;
	discount: number;
};

// Mở rộng kiểu FormSchemaType để đảm bảo attributes là một mảng
export type ProductFormValues = Omit<FormSchemaType, "attributes"> & {
	attributes: AttributeType[];
};

type ICate = {
	_id: string;
	name: string;
};

const ProductUpdate = () => {
	const { setOpenProcessLoadingEventNone, setCloseProcessLoadingEventNone } =
		useProcessBarLoadingEventNone();
	const { id } = useParams();
	const router = useNavigate();
	const form = useForm<ProductFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			category: null,
			price: 0,
			discount: 0,
			featured: false,
			description: "",
			thumbnail: "",
			attributes: [],
			images: [],
			is_simple: true,
			is_hot: false,
			quantity: 0,
		},
	});
	const { setOpen, setClose } = useProcessBarLoading();
	const [previewUrl, setPreviewUrl] = useState({
		isLoading: false,
		url: "",
	});
	const [images, setImages] = useState<ImageListType>([]);
	const maxNumber = 8; // Số lượng ảnh tối đa có thể tải lên
	const [category, setCategorys] = useState([]);
	const [size, setSize] = useState([]);
	const [color, setColor] = useState([]);
	const [isPending] = useState(false);
	const { mutate } = useMutation({
		mutationFn: (value: IProduct) => updateProductById(id as string, value),
		onSuccess: () => {
			setCloseProcessLoadingEventNone();
			toast.success("Chỉnh sửa sản phẩm thành công");
			form.reset();
			router("/admin/product");
		},
		onError: () => {
			setCloseProcessLoadingEventNone();
			toast.error("Chỉnh sửa sản phẩm thất bại");
		},
	});
	useEffect(() => {
		(async () => {
			try {
				const { data: dataCate } = await getAllCategory();
				const { data: dataSize } = await getAllSize();
				const { data } = await getAllColor();
				setCategorys(dataCate.data);
				setSize(dataSize.data);
				setColor(data.data);
			} catch (error) {
				console.log(error);
			}
		})();
	}, []);

	useEffect(() => {
		(async () => {
			try {
				const { data } = await getProductById(id as string);

				form.reset({
					category: data.data.category,
					name: data.data.name,
					price: data.data.price,
					discount: data.data.discount,
					thumbnail: data.data.thumbnail,
					images: data.data.images,
					attributes: data.data.attributes,
					description: data.data.description,
					featured: false,
					quantity: data?.data.quantity,
					is_simple: data.data.is_simple,
					is_hot: data.data.is_hot,
				});

				setPreviewUrl({
					isLoading: false,
					url: data.data.thumbnail,
				});
				setImages(data.data.images);
			} catch (error) {
				router("/admin/product");
				toast.error("Lấy thông tin sản phẩm lỗi");
			}
		})();
	}, []);

	const control = form.control;
	const { fields, append, remove } = useFieldArray({
		control,
		name: "attributes",
	});
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			setOpenProcessLoadingEventNone();
			const listImageNotFile = values.images?.filter((image) => !image?.file);
			const listImageFile = values.images?.filter((image) => image?.file);
			let listImage = [];
			if (listImageFile?.length > 0) {
				const formData = new FormData();
				for (let i = 0; i < listImageFile?.length; i++) {
					formData.append("images", listImageFile[i]?.file as any);
				}
				const { data } = await uploadMultipleFileService(formData);
				listImage = data?.map((item: any) => ({
					url: item.path,
				}));
			}
			const images = [...listImageNotFile, ...listImage];

			const attribute = values.attributes?.map((attribute) => ({
				...attribute,
				color: attribute.color?._id as string,
				size: attribute.size?._id as string,
			}));

			const data = {
				...values,
				images,
				category: values.category?._id,
				attributes: values.is_simple ? [] : attribute,
				price: +values.price,
				discount: +values.discount,
			};
			mutate(data as IProduct);
		} catch (error) {
			console.log("error", error);
			toast.error("Chỉnh sửa sản phẩm xảy ra lỗi");
		}
	};
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

	const listColor = form.watch("attributes")
		? form.watch("attributes")?.reduce((acc: IColor[], item) => {
				if (!item.color) return acc;

				let group = acc.find(
					(g) => item.color && g._id === (item.color._id as string),
				);

				if (!group) {
					group = {
						_id: item.color._id as string,
						name: item.color.name as string,
						code: item.color.code as string,
					};
					acc.push(group);
					return acc;
				}
				return acc;
			}, [])
		: [];

	const listSize = form.watch("attributes")
		? form.watch("attributes")?.reduce((acc: ISize[], item) => {
				if (!item?.size?._id) return acc;
				let group = acc.find((g) => g._id === (item.color as ISize)?._id);

				// Nếu nhóm không tồn tại, tạo nhóm mới
				if (!group) {
					group = {
						_id: (item.size as ISize)._id as string,
						name: (item.size as ISize).name as string,
					};
					acc.push(group);
					return acc;
				}
				return acc;
			}, [])
		: [];

	const handleDescription = () => {
		const text = `<p><span style=\"font-size: 16px;\"><strong>M&ocirc; tả</strong><br>${form.watch("name")} có phom d&aacute;ng rộng, ph&ugrave; hợp mọi v&oacute;c d&aacute;ng, gi&uacute;p người mặc dễ d&agrave;ng che đi khuyết điểm.<br style=\"box-sizing: border-box; letter-spacing: 0px;\" id=\"isPasted\">Thiết kế &aacute;o c&oacute;  gi&uacute;p bảo vệ cơ thể, tăng t&iacute;nh thời trang.<br style=\"box-sizing: border-box; letter-spacing: 0px;\">Ngực &aacute;o c&oacute; h&igrave;nh in chữ to tạo một điểm nhấn.</span></p><p><span style=\"font-size: 16px;\"><br></span></p><p><span style=\"font-size: 16px;\"><strong>Chất liệu</strong></span></p><p><span style=\"font-size: 16px;\"><strong><span style=\"color: rgb(51, 63, 72); font-family: sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 500; letter-spacing: normal; orphans: 2; text-align: justify; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; float: none; display: inline !important;\" id=\"isPasted\">60% cotton 40% polyester.</span></strong></span></p><p><span style=\"font-size: 16px;\"><br></span></p><p><span style=\"font-size: 16px;\"><strong><span id=\"isPasted\">Hưỡng dẫn sử dụng</span></strong></span></p><p><span style=\"font-size: 16px;\">Giặt m&aacute;y ở chế độ nhẹ, nhiệt độ thường.</span></p><p><span style=\"font-size: 16px;\">Kh&ocirc;ng sử dụng h&oacute;a chất tẩy c&oacute; chứa Clo</span></p><p><span style=\"font-size: 16px;\">Phơi trong b&oacute;ng m&aacute;t</span></p><p><span style=\"font-size: 16px;\">Sấy th&ugrave;ng, chế độ nhẹ nh&agrave;ng</span></p>`;

		form.setValue("description", text);
	};

	return (
		<div>
			<h4 className="text-xl font-medium">Chỉnh sửa sản phẩm</h4>

			<div className="grid w-full gap-5 mt-4 lg:grid-cols-12">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex w-full gap-5 space-y-8 lg:col-span-9"
					>
						<div className="w-full">
							<div className=" w-[full] grid grid-cols-2 gap-2">
								<div className="col-span-2 sm:col-span-1 ">
									<FormField
										disabled={isPending}
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Tên sản phẩm</FormLabel>
												<FormControl>
													<Input
														placeholder="Tên sản phẩm"
														{...field}
														// onChange={(e) => setName(e.target.value)}
													/>
												</FormControl>

												<FormMessage className="text-xs" />
											</FormItem>
										)}
									/>
								</div>
								<div className="col-span-2 sm:col-span-1">
									<FormField
										disabled={isPending}
										control={form.control}
										name="category"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Danh mục</FormLabel>
												<FormControl>
													<SelectComponent<ICate>
														value={field.value}
														onChange={(newValue: ICate) => {
															field.onChange(newValue);
															form.clearErrors(`category`);
														}}
														placeholder="Danh mục"
														options={category}
														getOptionLabel={(option) => option.name}
														getOptionValue={(option) => option?._id as string}
													/>
												</FormControl>
												<FormMessage className="text-xs" />
											</FormItem>
										)}
									/>
								</div>
								<div className="col-span-2 sm:col-span-1">
									<FormField
										disabled={isPending}
										control={form.control}
										name="price"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Giá sản phẩm</FormLabel>
												<FormControl>
													<InputNumberFormat
														value={field.value}
														onChange={(value) => {
															field.onChange(value.floatValue);
														}}
														suffix="đ"
														placeholder="Giá sản phẩm"
													/>
												</FormControl>

												<FormMessage className="text-xs" />
											</FormItem>
										)}
									/>
								</div>
								{/* category */}

								<div className="col-span-2 sm:col-span-1">
									<FormField
										disabled={isPending}
										control={form.control}
										name="discount"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Giảm giá</FormLabel>
												<FormControl>
													<InputNumberFormat
														value={field.value}
														onChange={(value) => {
															field.onChange(value.floatValue);
														}}
														suffix="đ"
														placeholder="Giá giảm"
													/>
												</FormControl>

												<FormMessage className="text-xs" />
											</FormItem>
										)}
									/>
								</div>
								{/* ảnh */}
								<div className="col-span-2 sm:col-span-1">
									<FormField
										disabled={isPending}
										control={form.control}
										name="thumbnail"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Ảnh sản phẩm</FormLabel>
												<FormControl>
													<div className="w-full bg-white border rounded-sm">
														<label
															htmlFor="file-upload"
															className={cn("w-full relative ")}
															onDragOver={(e) => {
																e.preventDefault();
															}}
															onDrop={(event) => {
																const items = event.dataTransfer.items; // Lấy danh sách items được kéo thả

																for (const item of items) {
																	if (
																		item.kind === "file" &&
																		item.type.startsWith("image/")
																	) {
																		const file = item.getAsFile(); // Lấy file ảnh

																		if (file) {
																			field.onChange(async () => {
																				setPreviewUrl({
																					url: URL.createObjectURL(file),
																					isLoading: true,
																				});
																				form.clearErrors("thumbnail");
																				const url =
																					await handleUploadFile(file);
																				field.onChange(url);
																			});
																		}
																	}
																}
															}}
														>
															<div className="relative w-full bg-white ">
																<div
																	className={cn(
																		"w-full h-[160px] flex justify-center items-center flex-col",
																		previewUrl?.url && "hidden",
																	)}
																>
																	<AiOutlineCloudUpload
																		size={50}
																		strokeWidth={1}
																	/>
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
																		previewUrl?.url ? "" : "hidden",
																	)}
																>
																	<img
																		src={previewUrl?.url}
																		className={cn(
																			"size-[140px] object-cover border border-slate-100",
																		)}
																		id="preview"
																	/>
																</div>

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
														</label>

														<div className="flex justify-center h-6 px-2 mb-2">
															<div
																className="w-40 text-sm text-center text-blue-500 bg-blue-100 rounded-sm cursor-pointer hover:bg-blue-200"
																onPaste={(event) => {
																	console.log("paste dc nè");
																	const items = event.clipboardData.items;
																	for (const item of items) {
																		if (item.type.startsWith("image/")) {
																			const file = item.getAsFile();
																			if (file) {
																				field.onChange(async () => {
																					setPreviewUrl({
																						url: URL.createObjectURL(file),
																						isLoading: true,
																					});
																					form.clearErrors("thumbnail");
																					const url =
																						await handleUploadFile(file);
																					field.onChange(url);
																				});
																			}
																		}
																	}
																}}
															>
																Click to paste image
															</div>
														</div>

														<input
															type="file"
															name=""
															id="file-upload"
															accept="image/jpeg, image/png,image/svg,image/jpg,image/webp"
															onChange={(event) =>
																field.onChange(async () => {
																	setPreviewUrl({
																		url: URL.createObjectURL(
																			(event?.target as HTMLInputElement)
																				?.files?.[0] as File,
																		),
																		isLoading: true,
																	});
																	form.clearErrors("thumbnail");
																	const url = await handleUploadFile(
																		(event?.target as HTMLInputElement)
																			?.files?.[0] as File,
																	);
																	field.onChange(url);
																})
															}
															hidden
															className="hidden outline-none focus-visible:ring-0 "
														/>
													</div>
												</FormControl>

												<FormMessage className="text-xs" />
											</FormItem>
										)}
									/>
								</div>
								<div className="col-span-2 sm:col-span-1">
									<FormField
										disabled={isPending}
										control={form.control}
										name="images"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Ảnh khác</FormLabel>
												<FormControl>
													<div className="w-full bg-white border rounded-sm">
														<ImageUploading
															multiple
															value={images}
															onChange={async (imageList: ImageListType) => {
																try {
																	setImages(imageList);
																	field.onChange(imageList);
																	if (imageList.length > 0) {
																		form.clearErrors("images");
																	}
																} catch (error) {
																	console.log(error);
																} finally {
																	setClose();
																}
															}}
															maxNumber={maxNumber}
															dataURLKey="url"
														>
															{({
																imageList,
																onImageUpload,
																onImageRemove,
																onImageUpdate,
																dragProps,
															}) => {
																return (
																	<div>
																		<div
																			className={cn(
																				"w-full relative h-[160px]   grid grid-cols-4 grid-rows-2 gap-1 p-1 ",
																			)}
																		>
																			{imageList?.map(
																				(image: any, index: number) => {
																					return (
																						<div
																							className="col-span-1 row-span-1"
																							key={index}
																						>
																							<div
																								// key={index}
																								className="relative flex items-center justify-center w-full h-full border rounded "
																							>
																								<img
																									src={image?.url}
																									alt=""
																									onClick={() =>
																										onImageUpdate(index)
																									}
																									className="cursor-pointer h-[90%] object-cover 	"
																								/>
																								<AiFillCloseCircle
																									className="absolute right-0 cursor-pointer top-2 right"
																									size={20}
																									onClick={() =>
																										onImageRemove(index)
																									}
																								/>
																							</div>
																						</div>
																					);
																				},
																			)}
																			<button
																				type="button"
																				onClick={onImageUpload}
																				{...dragProps}
																				className={cn(
																					"col-span-1 row-span-1 relative w-full h-full border rounded flex justify-center items-center",
																					images.length === maxNumber &&
																						"hidden",
																				)}
																			>
																				<AiOutlineCloudUpload
																					size={50}
																					strokeWidth={1}
																				/>
																			</button>
																		</div>
																		<div className="flex justify-center h-6 px-2 mb-2">
																			<div
																				className="w-40 text-sm text-center text-blue-500 bg-blue-100 rounded-sm cursor-pointer hover:bg-blue-200"
																				onPaste={(event) => {
																					const items =
																						event.clipboardData.items;
																					for (const item of items) {
																						if (
																							item.type.startsWith("image/")
																						) {
																							const file = item.getAsFile();
																							if (file) {
																								const url =
																									URL.createObjectURL(file);

																								const list = [
																									...imageList,
																									{
																										url,
																										file,
																									},
																								];

																								console.log("list", list);

																								setImages(list);
																								field.onChange(list);
																								if (list.length > 0) {
																									form.clearErrors("images");
																								}
																							}
																						}
																					}
																				}}
																			>
																				Click to paste image
																			</div>
																		</div>
																	</div>
																);
															}}
														</ImageUploading>
													</div>
												</FormControl>
												<FormMessage className="text-xs" />
											</FormItem>
										)}
									/>
								</div>
								<div className="col-span-2 sm:col-span-1">
									<FormField
										disabled={isPending}
										control={form.control}
										name="is_simple"
										render={({ field }) => (
											<FormItem>
												<div className="w-full h-[38px] border bg-white flex items-center px-2 gap-2 rounded-sm">
													<FormControl>
														<Checkbox
															checked={field.value}
															onCheckedChange={(e) => {
																field.onChange(e);
																console.log({ e });
																if (e) {
																	// form.setValue("attributes", []);
																} else {
																	if (form.watch("attributes").length === 0) {
																		form.setValue("attributes", [
																			{
																				size: null,
																				color: null,
																				price: 0,
																				quantity: 0,
																				discount: 0,
																			},
																		]);
																	}
																	form.setValue("quantity", 0);
																}
															}}
														/>
													</FormControl>
													<FormLabel className="cursor-pointer">
														Sản phẩm đơn giản
													</FormLabel>
												</div>
												<FormMessage className="text-xs" />
											</FormItem>
										)}
									/>
								</div>
								<div className="col-span-2 sm:col-span-1">
									<FormField
										disabled={isPending}
										control={form.control}
										name="is_hot"
										render={({ field }) => (
											<FormItem>
												<div className="w-full h-[38px] border bg-white flex items-center px-2 gap-2 rounded-sm">
													<FormControl>
														<Checkbox
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
													<FormLabel className="cursor-pointer">
														Sản phẩm nổi bật
													</FormLabel>
												</div>
												<FormMessage className="text-xs" />
											</FormItem>
										)}
									/>
								</div>
								{form.watch("is_simple") && (
									<div className="col-span-2">
										<FormField
											disabled={isPending}
											control={form.control}
											name="quantity"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Số lượng</FormLabel>
													<FormControl>
														{/* <Input
															placeholder="Số lượng"
															{...field}
															type="number"
															onChange={(e) => field.onChange(+e.target.value)}
														/> */}
														<InputNumberFormat
															value={field.value}
															onChange={(value) => {
																field.onChange(value.floatValue);
															}}
															suffix=""
															placeholder="Số lượng"
														/>
													</FormControl>

													<FormMessage className="text-xs" />
												</FormItem>
											)}
										/>
									</div>
								)}

								{!form.watch("is_simple") && (
									<div className="col-span-2 space-y-2">
										<FormLabel
											className={cn(
												"",
												form.formState.errors.attributes && "text-red-500",
											)}
										>
											Biến thể
										</FormLabel>
										<div
											className={cn(
												"flex flex-col w-full border p-4 md:p-6 gap-5 rounded-lg items-center",
												form.formState.errors.attributes && "border-red-500",
											)}
										>
											<ul className="flex flex-col justify-between w-full gap-4">
												{fields.map((item, index) => (
													<li
														key={item.id}
														className="grid w-full grid-cols-2 gap-4 pb-2 border-b md:grid-cols-3 lg:grid-cols-6"
													>
														<FormField
															disabled={isPending}
															control={control}
															name={`attributes.${index}.size`}
															render={({ field }) => (
																<FormItem className="flex flex-col w-full">
																	<FormLabel>Kích thước</FormLabel>
																	<SelectComponent<ISize>
																		value={field.value}
																		onChange={(newValue: ISize) => {
																			field.onChange(newValue);
																			form.clearErrors(
																				`attributes.${index}.size`,
																			);
																		}}
																		placeholder="Kích thước"
																		options={size}
																		getOptionLabel={(option) => option.name}
																		getOptionValue={(option) =>
																			option?._id as string
																		}
																	/>
																	<FormMessage className="text-xs" />
																</FormItem>
															)}
														/>
														<div className="flex flex-col w-full gap-2">
															<FormField
																disabled={isPending}
																name={`attributes.${index}.color`}
																control={control}
																render={({ field }) => (
																	<FormItem className="flex flex-col w-full">
																		<FormLabel>Màu</FormLabel>
																		<SelectComponent<IColor>
																			value={field.value}
																			onChange={(newValue: IColor) => {
																				field.onChange(newValue);
																				form.clearErrors(
																					`attributes.${index}.color`,
																				);
																			}}
																			placeholder="Màu"
																			options={color}
																			getOptionLabel={(option) => {
																				return (
																					<div className="flex items-center justify-between w-full">
																						{option.name}{" "}
																						<p
																							className="w-2 h-2 ml-1 rounded-full"
																							style={{
																								backgroundColor: option.code,
																							}}
																						></p>
																					</div>
																				);
																			}}
																			getOptionValue={(option) =>
																				option?._id as string
																			}
																		/>
																		<FormMessage className="text-xs" />
																	</FormItem>
																)}
															/>
														</div>
														<FormField
															disabled={isPending}
															name={`attributes.${index}.price`}
															control={control}
															render={({ field }) => (
																<FormItem className="flex flex-col w-full">
																	<FormLabel>Giá</FormLabel>
																	<FormControl>
																		<InputNumberFormat
																			value={field.value}
																			onChange={(value) => {
																				field.onChange(value.floatValue);
																			}}
																			suffix="đ"
																			placeholder=""
																		/>
																	</FormControl>
																	<FormMessage className="text-xs" />
																</FormItem>
															)}
														/>
														<FormField
															disabled={isPending}
															name={`attributes.${index}.discount`}
															control={control}
															render={({ field }) => (
																<FormItem className="flex flex-col w-full">
																	<FormLabel>Giảm giá</FormLabel>
																	<FormControl>
																		<InputNumberFormat
																			value={field.value}
																			onChange={(value) => {
																				field.onChange(value.floatValue);
																			}}
																			suffix="đ"
																			placeholder=""
																		/>
																	</FormControl>
																	<FormMessage className="text-xs" />
																</FormItem>
															)}
														/>
														<FormField
															disabled={isPending}
															name={`attributes.${index}.quantity`}
															control={control}
															render={({ field }) => (
																<FormItem className="flex flex-col w-full">
																	<FormLabel>Số lượng</FormLabel>
																	<FormControl>
																		<InputNumberFormat
																			value={field.value}
																			onChange={(value) => {
																				field.onChange(value.floatValue);
																			}}
																			suffix=""
																			placeholder=""
																		/>
																	</FormControl>
																	<FormMessage className="text-xs" />
																</FormItem>
															)}
														/>

														<div className="flex items-center justify-center w-full">
															<button
																type="button"
																onClick={() => {
																	remove(index);
																}}
																className={cn(
																	"hover:bg-gray-100 p-1 rounded-full",
																	fields?.length === 1 && "opacity-30",
																)}
																disabled={fields?.length === 1}
															>
																<MdDeleteForever
																	size={20}
																	className="text-red-500"
																/>
															</button>
														</div>
													</li>
												))}
											</ul>
											<button
												type="button"
												onClick={() =>
													append({
														size: null,
														color: null,
														price: 0,
														quantity: 0,
														discount: 0,
													})
												}
											>
												<CiCirclePlus size={25} />
											</button>
										</div>
										{form.formState.errors.attributes?.root && (
											<FormMessage className="text-xs">
												{form?.formState?.errors?.attributes?.root?.message}
											</FormMessage>
										)}
									</div>
								)}
								{/* attribute */}

								<div className="col-span-2">
									<FormField
										disabled={isPending}
										name="description"
										control={control}
										render={({ field }) => (
											<FormItem className="flex flex-col w-full">
												<div className="flex items-center justify-between">
													<FormLabel>Mô tả</FormLabel>

													<TooltipComponent label="Tự tạo mô tả theo tên">
														<div
															className="flex items-center justify-center rounded-full cursor-pointer size-7 group hover:bg-gray-50"
															onClick={handleDescription}
														>
															<BsStars
																size={20}
																className="text-blue-500 group-hover:text-blue-700"
															/>
														</div>
													</TooltipComponent>
												</div>
												<FormControl>
													<FroalaEditor
														content={field.value}
														onChangeContext={field.onChange}
													/>
												</FormControl>
												<FormMessage className="text-xs" />
											</FormItem>
										)}
									/>
								</div>
							</div>

							<Button
								type="submit"
								disabled={isPending || previewUrl.isLoading}
								className="mt-4"
							>
								Lưu sản phẩm
							</Button>
						</div>
					</form>
				</Form>
				<div className="hidden p-4 lg:block lg:col-span-3 ">
					<div className="relative flex flex-col overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-xl group hover:shadow-lg">
						<div className="relative overflow-hidden border bg-[#fff] flex justify-center items-center max-w-full min-w-full box-shadow">
							<div className="relative inline-block w-full group aspect-square">
								<div className="transition duration-500 transform bg-white ">
									<img
										className="object-cover w-full h-full aspect-square"
										src={
											form.watch("thumbnail") ||
											"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTixbrVNY9XIHQBZ1iehMIV0Z9AtHB9dp46lg&s"
										}
										alt="Image 1"
									/>
								</div>
							</div>
							<div className="absolute flex items-center justify-center w-full transition-all duration-300 ease-in-out rounded -bottom-10 group-hover:bottom-8">
								<div className="flex justify-center gap-1 items-center lg:w-[200px] w-[150px] lg:text-base text-sm lg:py-2 py-1 bg-opacity-30 border text-white bg-[#232323] text-center leading-[40px] border-none transition-transform hover:scale-90 hover:bg-[#f5f5f5] hover:text-[#262626] duration-300">
									<IoEyeOutline />
									<p className="text-xs lg:text-sm">Xem chi tiết</p>
								</div>
							</div>
							{form.watch("is_hot") && (
								<div className="absolute left-3 top-5 text-center rounded-full w-[35px] h-[35px]  p-1 bg-[#f54040]">
									<p className="lg:text-[12px] text-xs pt-1 text-white">HOT</p>
								</div>
							)}
						</div>
						<div className="flex flex-col gap-1 p-2 sm:gap-2">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-1 ">
									<FaStar className="text-yellow-400" size={10} />
									<FaStar className="text-yellow-400" size={10} />
									<FaStar className="text-yellow-400" size={10} />
									<FaStar className="text-yellow-400" size={10} />
									<FaStar className="text-yellow-400" size={10} />
								</div>
								<div>
									<p className="text-xs lg:text-sm">Đã bán 0</p>
								</div>
							</div>
							<h3 className=" md:text-[18px] text-sm text-[#1A1E26] font-semibold min-w-0 truncate">
								{form.watch("name")}
							</h3>

							<div className="flex items-center gap-2">
								<span className="md:text-base text-xs justify-start font-[500] text-red-500">
									{formatCurrency(form.watch("discount") || 0)}
								</span>
								<span className="lg:text-[13px] md:text-[13px] text-[10px] font-normal hidden sm:block">
									<del>{formatCurrency(form.watch("price") || 0)}</del>
								</span>
							</div>
							<div
								className={cn(
									"flex items-center justify-between",
									!form.watch("attributes") && "hidden",
								)}
							>
								<ListColorComponent listColor={listColor} />
								<ListSizeComponent listSize={listSize} />
							</div>
							<div></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductUpdate;
