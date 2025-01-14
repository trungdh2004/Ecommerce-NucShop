import FroalaEditor from "@/components/common/Froala";
import SelectComponent from "@/components/common/SelectComponent";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Textarea } from "@/components/ui/textarea";
import useDebounce from "@/hooks/shared";
import { cn } from "@/lib/utils";
import { newBlogs } from "@/service/blog";
import { getAllTags } from "@/service/tags-admin";
import { uploadFileService } from "@/service/upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
	AiOutlineCloudUpload,
	AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
const NewBlog = () => {
	const [statusLoading, setStatusLoading] = useState({
		isSubmitted: false,
		isLoading: false,
	});
	const [previewUrl, setPreviewUrl] = useState("");
	const [content, setContent] = useState("");
	const [tags, setTags] = useState([]);
	const navigate = useNavigate();
	const formSchema = z.object({
		title: z.string({
			required_error: "Tiêu đề bài viết là bắt buộc",
			invalid_type_error: "Tiêu đề bài viết là một chuỗi",
		}),
		content: z.string({
			required_error: "Nội dung bài viết là bắt buộc",
			invalid_type_error: "Nội dung bài viết là một chuỗi",
		}),
		published_at: z.date({
			required_error: "Ngày đăng là bắt buộc",
			invalid_type_error: "Ngày đăng không đúng định dạng",
		}),
		selected_tags: z
			.array(
				z.object({
					_id: z.string(),
					name: z.string(),
				}),
			)
			.nonempty({
				message: "Bạn chưa chọn nhãn",
			}),
		thumbnail_url: z.string({ required_error: "Ảnh thu nhỏ là bắt buộc" }),
	});
	useEffect(() => {
		(async () => {
			const { data } = await getAllTags();
			setTags(data?.data);
		})();
	}, []);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});
	const handleAutoSave = async () => {
		const data = form.getValues();
		const payload = {
			...data,
			selected_tags: data?.selected_tags?.map((tag) => tag?._id),
		};
		console.log(payload);

		if (payload.title || payload.content) {
			try {
				setStatusLoading({ isSubmitted: true, isLoading: true });
				const { data } = await newBlogs(payload);
				navigate(`/admin/blogs/${data?._id}/edit`);
			} catch (error) {
				if (error instanceof AxiosError) {
					toast.error(error.response?.data?.message);
				}
			} finally {
				setStatusLoading({ isSubmitted: true, isLoading: false });
			}
		}
	};
	const handleUploadFile = async (file: File) => {
		const formdata = new FormData();
		formdata.append("image", file);
		const { data } = await uploadFileService(formdata);
		setPreviewUrl(data.path);
		return data.path;
	};
	const debouncedChangeHandler = useDebounce(() => {
		handleAutoSave();
	}, 1000);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const payload = {
				...values,
				selected_tags: values?.selected_tags?.map((tag) => tag?._id),
			};
			await newBlogs(payload);
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error.response?.data?.message);
			}
		}
	}
	return (
		<div className="">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col items-start gap-5"
				>
					<div className="relative w-full">
						<div className="w-full">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<div className="">
												<Input
													placeholder="Tiêu đề"
													{...field}
													onChange={(event) =>
														field.onChange(() => {
															const title = (event.target as HTMLInputElement)
																.value;
															document.title = title;
															form.clearErrors("title"),
																(title == "" || title == null) &&
																	form.setError("title", {
																		type: "custom",
																		message: "Tiêu đề nội dung là bắt buộc",
																	});

															form.setValue("title", title),
																debouncedChangeHandler();
														})
													}
													className="bg-transparent py-5 border-none outline-none focus-visible:ring-0 text-2xl font-semibold text-black"
												/>
											</div>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div
							className={cn(
								"absolute  top-1/2 -translate-y-1/2 right-5   text-sm text-gray-300",
								!statusLoading.isSubmitted && "hidden",
							)}
						>
							<span
								className={cn(
									"flex items-center justify-center gap-1",
									!statusLoading.isLoading && "hidden",
								)}
							>
								Đang lưu
								<span className="">
									<AiOutlineLoading3Quarters className="animate-spin" />
								</span>
							</span>
							<span className={cn(statusLoading.isLoading && "hidden")}>
								Đã lưu
							</span>
						</div>
					</div>
					<div className="flex flex-col md:flex-row items-start gap-5 w-full">
						<div className="w-full order-2 md:order-none">
							<FroalaEditor
								content={content}
								onChangeContext={(value) => {
									debouncedChangeHandler();
									setContent(value);
									form.setValue("content", value);
									form.clearErrors("content");
									if (value == "" || value == null) {
										form.setError("content", {
											type: "custom",
											message: "Nội dung bài viết là bắt buộc",
										});
									}
								}}
							/>
							{/*  */}
							<FormField
								control={form.control}
								name="content"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Textarea
												defaultValue={content}
												{...field}
												className="hidden"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="flex flex-col space-y-5 order-1 md:order-none w-full min-w-72 md:max-w-72 *:rounded-xl">
							<div className="w-full  order-1 md:order-none box-shadow">
								<div className=" bg-white box-shadow  rounded-lg ">
									<h3 className="font-semibold text-base py-2 px-5 ">
										Phát hành
									</h3>
									<div className="px-5 py-3 border-y border-gray-200">
										<FormField
											control={form.control}
											name="published_at"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>Ngày đăng</FormLabel>
													<Popover>
														<PopoverTrigger asChild>
															<FormControl>
																<Button
																	disabled
																	variant={"outline"}
																	className={cn(
																		"w-full flex justify-between items-center pl-3 text-left font-normal",
																		!field.value && "text-muted-foreground",
																	)}
																>
																	{field.value ? (
																		format(field.value, "PPP", {
																			locale: vi,
																		})
																	) : (
																		<span>Chọn ngày</span>
																	)}
																	<MdOutlineCalendarMonth />
																</Button>
															</FormControl>
														</PopoverTrigger>
														<PopoverContent
															className="w-auto p-0"
															align="start"
														>
															<Calendar
																locale={vi}
																mode="single"
																selected={field.value}
																onSelect={field.onChange}
																disabled={(date) =>
																	date < new Date() ||
																	date < new Date("1900-01-01")
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
									<div className="flex items-center justify-end px-5 py-3">
										<Button
											type="submit"
											className="py-0.5 px-5 bg-blue-500 hover:bg-blue-500/80"
											disabled
										>
											Đăng tải
										</Button>
									</div>
								</div>
							</div>
							<div className="w-full  order-1 md:order-none box-shadow">
								<div className={cn("bg-white box-shadow  rounded-lg")}>
									<FormField
										control={form.control}
										name="selected_tags"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Accordion
														type="single"
														collapsible
														className="w-full"
													>
														<AccordionItem
															value="item-1"
															className="border-none"
														>
															<AccordionTrigger className="pt-0 px-5 py-3 border-none">
																<FormLabel>Nhãn</FormLabel>
															</AccordionTrigger>
															<AccordionContent className="px-5">
																<div>
																	<SelectComponent<ITag>
																		options={tags}
																		isMulti={true}
																		value={field.value}
																		onChange={(values: any) => {
																			field.onChange(values);
																		}}
																		getOptionLabel={(option) => option.name}
																		getOptionValue={(option) => option._id}
																		disabled={true}
																	/>
																</div>
																<FormMessage />
															</AccordionContent>
														</AccordionItem>
													</Accordion>
												</FormControl>
											</FormItem>
										)}
									></FormField>
								</div>
							</div>
							<div className="w-full  order-1 md:order-none box-shadow">
								<div className=" bg-white box-shadow  rounded-lg ">
									<FormField
										control={form.control}
										name="thumbnail_url"
										render={({ field }) => (
											<FormItem className="flex flex-wrap  items-center ">
												<FormControl>
													<Accordion
														type="single"
														collapsible
														className="w-full "
													>
														<AccordionItem
															value="item-1"
															className="border-none"
														>
															<AccordionTrigger className="pt-0 px-5 py-3 border-none">
																<FormLabel>Hình ảnh thu nhỏ</FormLabel>
															</AccordionTrigger>
															<AccordionContent className="px-5 ">
																<div className="w-full ">
																	<label
																		htmlFor="file-upload"
																		className={cn(
																			"w-full relative cursor-pointer  rounded-lg p-6",
																		)}
																		id=""
																	>
																		<div
																			className={cn(
																				"flex flex-col justify-center items-center ",
																				previewUrl && "hidden",
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
																		<img
																			src={previewUrl}
																			className={cn(
																				"w-full relative max-h-[180px] object-cover",
																				previewUrl ? "" : "hidden",
																			)}
																			id="preview"
																		/>
																	</label>
																	<input
																		type="file"
																		name=""
																		id="file-upload"
																		disabled
																		onChange={(event) =>
																			field.onChange(async () => {
																				setPreviewUrl(
																					URL.createObjectURL(
																						(event?.target as HTMLInputElement)
																							?.files?.[0] as File,
																					),
																				);
																				form.setValue(
																					"thumbnail_url",
																					previewUrl,
																				);
																				form.clearErrors("thumbnail_url");
																				const url = await handleUploadFile(
																					(event?.target as HTMLInputElement)
																						?.files?.[0] as File,
																				);
																				form.setValue("thumbnail_url", url);

																				URL.revokeObjectURL(previewUrl);
																			})
																		}
																		hidden
																		className="hidden outline-none focus-visible:ring-0 "
																	/>
																	<Input
																		type="text"
																		placeholder="Hình ảnh thu nhỏ"
																		{...field}
																		className="hidden outline-none focus-visible:ring-0 "
																	/>
																</div>
																<FormMessage />
															</AccordionContent>
														</AccordionItem>
													</Accordion>
												</FormControl>
											</FormItem>
										)}
									/>
								</div>
							</div>
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default NewBlog;
