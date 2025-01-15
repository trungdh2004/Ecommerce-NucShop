import Paginations from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { pagingBlogs } from "@/service/blog";
import { getAllTags } from "@/service/tags-admin";
import { SearchObjectBlog } from "@/types/searchObjecTypes";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaCommentDots, FaEye, FaRegHeart } from "react-icons/fa";
import { Link, useSearchParams } from "react-router-dom";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
type IBlog = {
	_id?: string;
	title: string;
	content: string;
	isDeleted: string;
	createdAt: string;
	published_at: string;
	isPublish: boolean;
	user_id: {
		avatarUrl?: string;
		email: string;
		_id: string;
		full_name: string;
	};
	views_count: number;
	countLike: number;
	comments_count: number;
	thumbnail_url?: string;
	meta_description: string;
};

const BlogPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const newTags = searchParams.get("tags") || "";
	// const paramsObject = Object.fromEntries(searchParams.entries())
	const [searchObject, setSearchObject] = useState<SearchObjectBlog>({
		pageIndex: 1,
		pageSize: 8,
		keyword: "",
		fieldSort: "",
		sort: 1,
		tab: 1,
		tags: searchParams.get("tags") || "",
	});
	const { data: blogs } = useQuery({
		queryKey: ["blogs", searchObject],
		queryFn: async () => {
			try {
				const { data } = await pagingBlogs(searchObject);
				return data;
			} catch (error) {
				console.log(error);
			}
		},
		placeholderData: keepPreviousData,
	});
	const { data: tags } = useQuery({
		queryKey: ["tags"],
		queryFn: async () => {
			try {
				const { data } = await getAllTags();
				return data.data;
			} catch (error) {
				console.log(error);
			}
		},
	});
	useEffect(() => {
		setSearchObject((prev) => ({
			...prev,
			tags: newTags,
			pageIndex: 1, // Reset page index to 1 when tag changes
		}));
	}, [searchParams]);
	const handleChangePag = async (value: any) => {
		console.log("value", value);
		try {
			setSearchObject((prev) => ({
				...prev,
				pageIndex: value.selected + 1,
			}));
		} catch (error) {
			console.log(error);
		}
	};
	const handleParams = async (tagSlug: string) => {
		try {
			if (newTags === tagSlug) {
				// navigate("/blogs")
				setSearchParams({});
			} else {
				setSearchParams({ tags: tagSlug });
			}
		} catch (error) {}
	};
	return (
		<>
			{/* {isLoading && (
                <div className='absolute w-screen h-screen z-[1000] bg-custom-400/20'></div>
            )} */}
			<div className="padding pt-12 pb-10 text-[#1A1E26]">
				<div className="flex items-center gap-3 mb-3">
					<h3 className="text-xl font-semibold">Danh sách bài viết </h3>
				</div>
				<ScrollArea className=" max-w-[100%] whitespace-nowrap">
					<div className="pb-4 space-x-3">
						{tags &&
							tags.map((tag: any) => {
								// console.log(tag)
								return (
									<Button
										onClick={() => handleParams(tag.slug)}
										variant="outline"
										className={cn(
											"rounded-lg border border-slate-300 pr-3",
											newTags === tag.slug
												? "border-custom text-custom"
												: "border-slate-300",
										)}
									>
										{tag.name}
									</Button>
								);
							})}
					</div>
					<ScrollBar className="" orientation="horizontal" />
				</ScrollArea>
				{/* blogs-lít */}
				<div className="grid grid-cols-12 min-h-[360px] gap-6 xl:gap-8 my-5">
					{blogs?.content?.length ? (
						blogs?.content?.map((item: IBlog, index: number) => (
							<>
								<div
									key={index}
									className="col-span-12 min-[600px]:col-span-6 min-[900px]:col-span-3 h-[360px] "
								>
									{" "}
									<Link to={`/blogDetail/${item?._id}`}>
										<div className="h-[350px] grid grid-rows-2 border rounded-xl overflow-hidden relative">
											{/* card-head */}

											<div className="bg-gray-200 border-b border-gray-300 ">
												<img
													src={item.thumbnail_url || "/no-image.png"}
													className="object-cover w-full h-full"
													alt=""
												/>
											</div>
											{/* card-content */}
											<div className="px-4 pt-2 bg-white">
												<div className="flex items-center gap-1 pb-2">
													<img
														src={item.user_id.avatarUrl || "/avatar_25.jpg"}
														className="w-[40px] h-[40px] border-[3px] border-white rounded-full"
														alt=""
													/>
													<div className="">
														<h3 className="text-sm font-medium">
															{item.user_id.full_name}
														</h3>
														{/* <p className="text-xs text-[#212B36] opacity-50 ">{format(item.published_at || item.createdAt || "", "dd-MM-yyyy")}</p> */}
													</div>
												</div>
												<div className="flex items-center justify-between ">
													<Link
														to={`/blogDetail/${item._id}`}
														className="line-clamp-1 text-[#212B36] text-[18px] font-semibold hover:underline transition-all duration-300"
													>
														{item.title || "Bài viết chưa có tiêu đề"}
													</Link>
												</div>
												<p className="pt-1 text-xs text-gray-400 line-clamp-2">
													{item.meta_description}
												</p>
												<div className="flex space-x-4 min-[900px]:space-x-1 xl:space-x-4 absolute bottom-4 right-4">
													<div className="flex gap-3">
														<span className="text-[#212B36] text-xs flex items-center gap-1">
															<FaRegHeart size={16} />
															{item.countLike}
														</span>
														<span className="text-[#212B36] text-xs flex items-center gap-1">
															<FaCommentDots size={16} />
															{item.comments_count}
														</span>
														<span className="text-[#212B36] text-xs flex items-center gap-1">
															{" "}
															<FaEye size={16} />
															{item.views_count}
														</span>
													</div>
												</div>
											</div>
										</div>
									</Link>
								</div>
							</>
						))
					) : (
						<div className="flex items-center justify-center w-full h-full col-span-12 mt-0 mt-10">
							<h3 className=" text-lg text-[#1A1E26]">Chưa có bài viết nào.</h3>
						</div>
					)}
				</div>
				{blogs?.totalPage > 1 && (
					<div className="flex justify-center mt-5">
						<Paginations
							forcePage={searchObject.pageIndex - 1}
							pageCount={blogs?.totalPage}
							handlePageClick={handleChangePag}
						/>
					</div>
				)}
			</div>
			{/* tags-;íst */}
		</>
	);
};

export default BlogPage;
