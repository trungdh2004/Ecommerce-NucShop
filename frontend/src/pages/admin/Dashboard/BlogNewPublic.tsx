import { optimizeCloudinaryUrl } from "@/common/localFunction";
import { getListBlogNew } from "@/service/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { FaAngleRight } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

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
	const router = useNavigate();

	return (
		<div className="flex flex-col p-2 bg-white box-shadow rounded-xl">
			<div className="flex items-center justify-between py-2 border-b">
				<p className="font-semibold">Danh sách bài viết mới đăng tải</p>
			</div>

			<div className="py-2">
				{!!data &&
					data?.length > 0 &&
					data.map((item: any) => (
						<div
							className="flex items-center gap-2 py-2 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
							key={item._id}
							onClick={() => {
								router(`/admin/blogs/${item._id}`);
							}}
						>
							<div className="overflow-hidden border rounded-sm size-12">
								<img
									src={optimizeCloudinaryUrl(item?.thumbnail_url, 48, 48)}
									alt=""
									className="object-cover w-full h-full"
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
						<div className="flex items-center gap-2 py-2 border-b border-gray-100">
							<div className="flex items-center justify-center w-full h-12">
								<span>Không có bài viết nào</span>
							</div>
						</div>
					))}
				<div className="flex justify-end w-full pt-2 text-end">
					<Link
						to={"/admin/blogs/"}
						className="px-2 py-1 text-xs font-semibold rounded-sm hover:bg-gray-100 "
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
