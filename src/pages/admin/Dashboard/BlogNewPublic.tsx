import { getListBlogNew } from "@/service/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import React from "react";
import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa6";
import { optimizeCloudinaryUrl } from "@/common/localFunction";

const BlogNewPublic = () => {
	const { data } = useQuery({
		queryKey: ["dashboardListBlogNew"],
		queryFn: async () => {
			try {
				const { data } = await getListBlogNew();
				return data;
			} catch (error) {}
		},
	});

	return (
		<div className="bg-white box-shadow rounded-xl flex flex-col p-2">
			<div className="flex items-center justify-between py-2 border-b">
				<p className="font-semibold">Danh sách bài viết mới đăng tải</p>
			</div>

			<div className="py-2">
				{!!data &&
					data?.length > 0 &&
					data.map((item: any) => (
						<div className="flex gap-2 py-2 items-center border-b border-gray-100">
							<div className="size-12 rounded-sm overflow-hidden border">
								<img
									src={optimizeCloudinaryUrl(item?.thumbnail_url,48,48)}
									alt=""
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="flex-1">
								<p className="text-sm font-semibold leading-[22px] line-clamp-1">
									{item?.meta_title}
								</p>
								<p className="text-sm font-normal leading-[22px] text-gray-400 line-clamp-1">
									{item?.meta_description}
								</p>
							</div>
							<div className="text-[10px] md:text-xs font-light text-gray-400">
								{item?.published_at
									? formatDistanceToNow(new Date(item?.published_at), {
											locale: vi,
										})
									: null}
							</div>
						</div>
					))}
				{!data ||
					(data?.length === 0 && (
						<div className="flex gap-2 py-2 items-center border-b border-gray-100">
							<div className="h-12 w-full flex items-center justify-center">
								<span>Không có bài viết nào</span>
							</div>
						</div>
					))}
				<div className="w-full text-end pt-2 flex justify-end">
					<Link
						to={"/admin/blogs/"}
						className="font-semibold text-xs py-1 px-2 hover:bg-gray-100 rounded-sm "
					>
						<button className="flex items-center gap-1">
							Xem tất cả <FaAngleRight size={11} />
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default BlogNewPublic;
