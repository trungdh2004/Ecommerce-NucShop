import FroalaEditor from "@/components/common/Froala";
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
import { publishBlogs, showBlogsEdit, updateBlogs } from "@/service/blog";
import { getAllTags } from "@/service/tags-admin";
import { uploadFileService } from "@/service/upload";
import {
	useProcessBarLoading,
	useProcessBarLoadingEventNone,
} from "@/store/useSidebarAdmin";
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
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { toast } from "sonner";
import { z } from "zod";

const EditBlog = () => {
	const { setOpenProcessLoadingEventNone, setCloseProcessLoadingEventNone } =
		useProcessBarLoadingEventNone();
	const navigate = useNavigate();
	const [statusLoading, setStatusLoading] = useState({
		isSubmitted: false,
		isLoading: false,
	});
	const { setOpen, setClose } = useProcessBarLoading();
	const { id } = useParams();
	const [tags, setTags] = useState();
	const [blogs, setBlogs] = useState<z.infer<typeof formSchema>>();
	const [previewUrl, setPreviewUrl] = useState({
		url: "",
		isLoading: false,
	});
	const [content, setContent] = useState("");
	const formSchema = z.object({
		title: z.string({
			required_error: "Tiêu đề bài viết là bắt buộc",
			invalid_type_error: "Tiêu đề bài viết là một chuỗi",
		}),
		content: z.string({
			required_error: "Nội dung bài viết là bắt buộc",
			invalid_type_error: "Nội dung bài viết là một chuỗi",
		}),
		published_at: z.string({
			required_error: "Bạn chưa nhập ngày",
		}),
		selected_tags: z
			.array(z.object({ _id: z.string(), name: z.string() }))
			.nonempty({ message: "Bạn phải chọn ít nhất 1 nhãn" }),
		thumbnail_url: z.string({
			message: "Bạn cần phải chọn ảnh thu nhỏ cho bài viết",
		}),
	});
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: blogs,
	});
	useEffect(() => {
		(async () => {
			const [{ data: blog }, { data: tags }] = await Promise.all([
				showBlogsEdit(id as string),
				getAllTags(),
			]);

			setContent(blog?.data?.content);
			form.reset(blog?.data);
			setBlogs(blog?.data);
			setTags(tags?.data);
		})();
	}, []);
	const handleAutoSave = async () => {
		const formData = form.getValues();
		const { _id, ...rest } = formData as any;
		const payload = {
			...rest,
			thumbnail_url: formData?.thumbnail_url,
		};
		try {
			setStatusLoading({ isSubmitted: true, isLoading: true });
			await updateBlogs(_id, payload);
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error.response?.data?.message);
			}
		} finally {
			setStatusLoading({ isSubmitted: true, isLoading: false });
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
	const debouncedChangeHandler = useDebounce(() => {
		handleAutoSave();
	}, 5000);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			if (previewUrl.isLoading) {
				toast.warning("Vui lòng chờ ảnh tải xong");
			} else {
				setOpenProcessLoadingEventNone();
				const payload = {
					...values,
				};
				setStatusLoading({ isSubmitted: true, isLoading: true });
				const reponse = await publishBlogs(id as string, payload);
				if (reponse.status === 200) {
					toast.success("Cập nhập bài viết thành công");
					navigate("/admin/blogs");
				} else {
					throw new Error("Cập nhập bài viết thất bại");
				}
			}
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error?.response?.data.message);
			}
		} finally {
			setCloseProcessLoadingEventNone();
			setStatusLoading({ isSubmitted: true, isLoading: false });
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
													disabled={
														previewUrl.isLoading || statusLoading.isLoading
													}
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
													className="py-5 text-2xl font-semibold text-black bg-transparent border-none outline-none focus-visible:ring-0"
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

					<div className="flex flex-col items-start w-full gap-5 md:flex-row">
						<div className="order-2 w-full md:order-none">
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
								props={{
									heightMin: "400px",
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
							<div className="order-1 w-full md:order-none box-shadow">
								<div className="bg-white rounded-lg ">
									<h3 className="px-5 py-2 text-base font-semibold ">
										Phát hành
									</h3>
									<div className="px-5 py-3 border-gray-200 border-y">
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
																selected={field.value as any}
																onSelect={(e) => {
																	field.onChange(e?.toISOString());
																}}
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
											disabled={previewUrl.isLoading || statusLoading.isLoading}
											type="submit"
											className="py-0.5 px-5 bg-blue-500 hover:bg-blue-500/80"
										>
											Đăng tải
										</Button>
									</div>
								</div>
							</div>
							<div className="order-3 w-full md:order-none box-shadow">
								<div className={cn("bg-white   rounded-lg")}>
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
															<AccordionTrigger className="px-5 py-3 pt-0 border-none">
																<FormLabel className="cursor-pointer">
																	Nhãn
																</FormLabel>
															</AccordionTrigger>
															<AccordionContent className="px-5">
																<div>
																	<Select
																		options={tags}
																		isMulti
																		{...field}
																		getOptionLabel={(option) => option.name}
																		getOptionValue={(option) => option._id}
																		className="react-select-container"
																		classNamePrefix="react-select"
																		onChange={(e: any) => {
																			field.onChange(e);
																		}}
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
							<div className="order-4 w-ful md:order-nonel box-shadow">
								<div className="bg-white rounded-lg ">
									<FormField
										control={form.control}
										name="thumbnail_url"
										render={({ field }) => (
											<FormItem className="flex flex-wrap items-center ">
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
															<AccordionTrigger className="px-5 py-3 pt-0 border-none">
																<FormLabel className="cursor-pointer">
																	Hình ảnh thu nhỏ
																</FormLabel>
															</AccordionTrigger>
															<AccordionContent className="px-5 ">
																<div className="w-full ">
																	<label
																		htmlFor="file-upload"
																		className={cn(
																			"w-full relative cursor-pointer  rounded-lg p-6 ",
																		)}
																		id=""
																	>
																		<div
																			className={cn(
																				"flex flex-col justify-center items-center ",
																				(previewUrl.url ||
																					blogs?.thumbnail_url) &&
																					"hidden",
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
																		<div className="max-h-[180px] relative">
																			<img
																				src={
																					previewUrl?.url ||
																					blogs?.thumbnail_url
																				}
																				className={cn(
																					"w-full relative max-h-[180px] object-cover",
																					previewUrl.url || blogs?.thumbnail_url
																						? ""
																						: "hidden",
																				)}
																				id="preview"
																			/>
																			{previewUrl.isLoading && (
																				<div className="absolute inset-0 flex items-center justify-center bg-slate-50/50">
																					<AiOutlineLoading3Quarters
																						size={20}
																						strokeWidth="4px"
																						className="animate-spin "
																					/>
																				</div>
																			)}
																		</div>
																	</label>
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
																				form.clearErrors("thumbnail_url");
																				const url = await handleUploadFile(
																					(event?.target as HTMLInputElement)
																						?.files?.[0] as File,
																				);
																				form.setValue("thumbnail_url", url);
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

export default EditBlog;
