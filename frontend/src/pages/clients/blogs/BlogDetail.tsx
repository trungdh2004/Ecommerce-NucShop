import { actionUpdateReactions, getBlogDetailClient } from "@/service/blog";
import { IBlogs } from "@/types/blogs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { format } from "date-fns";
import { FaRegHeart } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";
import { Remarkable } from "remarkable";
import { toast } from "sonner";
import ModalSheetComment from "./comments/ModalSheetComment";
import { useAuth } from "@/hooks/auth";
import { useCurrentRouteAndNavigation } from "@/hooks/router";
import { FaHeart } from "react-icons/fa";

const BlogDetail = () => {
	const { id } = useParams();
	const { authUser, isLoggedIn } = useAuth();
	const QueryClient = useQueryClient();
	const handleCurrentRoute = useCurrentRouteAndNavigation();
	const { data: blog } = useQuery({
		queryKey: ["blogDetail", id],
		queryFn: async () => {
			try {
				const { data } = await getBlogDetailClient(id as string);
				return data;
			} catch (error) {
				if (error instanceof AxiosError) {
					toast.error(error?.response?.data?.message);
				}
			}
		},
	});
	const md = new Remarkable({
		html: true, // Cho phép HTML bên trong Markdown
		xhtmlOut: false, // Xuất ra HTML với các tag tự đóng
		breaks: false, // Tự động ngắt dòng thành <br>
		langPrefix: "language-", // Tiền tố cho class của các khối code
		linkify: true, // Tự động chuyển đổi URL thành liên kết
		typographer: true, // Thay thế các ký tự đặc biệt như quotes, dashes thành kiểu typographic
	});
	const markdownContent = blog?.data?.content;
	const htmlContent = md.render(markdownContent as any);
	const handleUpdateReactions = async () => {
		if (isLoggedIn) {
			try {
				const isLike = blog?.data?.reactions?.includes(authUser?._id);
				await actionUpdateReactions({ id: id as string, isLike: !isLike });
				QueryClient.invalidateQueries({ queryKey: ["blogDetail"] });
			} catch (error) {
				if (error instanceof AxiosError) {
					toast.error(error?.response?.data?.message);
				}
			}
		} else {
			handleCurrentRoute();
		}
	};
	return (
		<div className="py-12 mx-auto padding">
			<div className="grid w-full grid-cols-12 gap-8 overflow-visible ">
				<div className="hidden col-span-2 pr-5 overflow-visible lg:block">
					<div className="sticky top-0">
						<h3 className="hidden pb-2 text-base font-medium lg:block">
							{blog?.data?.user_id?.full_name}
						</h3>
						<div className="flex gap-6 pt-2 border-t border-gray-300">
							<div className="flex items-center gap-2 text-[#757575] ">
								<span
									onClick={handleUpdateReactions}
									className="cursor-pointer"
								>
									{blog?.data?.reactions?.includes(authUser?._id) ? (
										<FaHeart
											size={20}
											fill="#ef4444"
											className="text-red-500 fill-red-500"
										/>
									) : (
										<FaRegHeart size={20} />
									)}
								</span>
								<span className="text-lg font-medium">
									{blog?.data?.countLike}
								</span>
							</div>
							<div className="flex items-center gap-2 text-[#757575]">
								<ModalSheetComment />
								<span className="text-lg font-medium">
									{blog?.data?.comments_count}
								</span>
							</div>
						</div>
					</div>
				</div>

				<div className="col-span-12 lg:col-span-7 lg:px-8">
					<h3 className="text-xl md:text-2xl font-bold text-[#222222] ">
						{blog?.data?.title}
					</h3>
					{/* user-information */}
					<div className="flex my-[30px] justify-between items-center">
						{/*  */}
						<div className="flex items-center gap-5">
							<div className="border border-slate-900 w-[50px] h-[50px] rounded-full overflow-hidden">
								<img
									src={blog?.data?.user_id?.avatarUrl || "/avatar_25.jpg"}
									className="object-cover w-full h-full"
									alt=""
								/>
							</div>
							<div className="flex-row">
								<h3 className="text-[#292929] text-base font-medium ">
									{blog?.data?.user_id?.full_name}
								</h3>
								<p className="text-[#757575] text-sm">
									{(blog?.data &&
										format(
											blog?.data?.published_at || blog?.data?.createdAt || "",
											"dd-MM-yyyy",
										)) ||
										""}
								</p>
							</div>
						</div>
					</div>
					{/* blog?.data-content */}
					<div
						className={
							"[&>table]:border-collapse [&>table]:border-gray-400  [&>th]:border [&>td]:border "
						}
						dangerouslySetInnerHTML={{ __html: htmlContent }}
					/>
					{/* Related-blog?.data */}
					<div className="mt-10">
						<hr />
					</div>
					<div className="flex  gap-6 pt-3 text-[#757575]">
						<div className="flex items-center gap-2 ">
							<span onClick={handleUpdateReactions} className="cursor-pointer">
								{blog?.data?.reactions?.includes(authUser?._id) ? (
									<FaHeart
										size={20}
										fill="#ef4444"
										className="text-red-500 fill-red-500"
									/>
								) : (
									<FaRegHeart size={20} />
								)}
							</span>
							<span className="text-lg font-medium">
								{blog?.data?.countLike}
							</span>
						</div>
						<div className="flex items-center gap-2 ">
							<ModalSheetComment />
							<span className="text-lg font-medium">
								{blog?.data?.comments_count}
							</span>
						</div>
					</div>
				</div>

				<div className="col-span-12 lg:col-span-3 lg:pl-3">
					<h3 className="pb-2 mt-4 text-base font-medium border-b border-gray-300 lg:mt-0">
						Bài viết khác
					</h3>
					<div className="gap-6 mt-2 ">
						{blog?.orther &&
							blog?.orther?.map((item: IBlogs) => (
								<Link to={`/blogDetail/${item._id}`}>
									<div className="flex w-full p-2 mt-2 border rounded-md hover:shadow">
										<div className="w-20 h-20 overflow-hidden">
											<img
												src={item?.thumbnail_url || "/avatar_25.jpg"}
												alt=""
												className="object-cover w-full h-full border rounded-sm"
											/>
										</div>
										<div className="flex flex-col justify-between flex-1 pl-2 ">
											<div>
												<h3 className="font-medium leading-4 line-clamp-1">
													{item?.meta_title}
												</h3>
												<p className="mt-1 text-sm leading-4 text-gray-400 line-clamp-2">
													{item?.meta_description}
												</p>
											</div>
											<div className="flex items-end">
												<img
													src={item.user_id.avatarUrl || "/avatar_25.jpg"}
													alt=""
													className="w-6 h-6 border rounded-full"
												/>
												<span className="pl-2 text-xs">
													{item.user_id.full_name}
												</span>
											</div>
										</div>
									</div>
								</Link>
							))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default BlogDetail;
