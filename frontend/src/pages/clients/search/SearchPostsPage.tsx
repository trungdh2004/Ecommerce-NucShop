import { optimizeCloudinaryUrl } from "@/common/localFunction";
import { IBlogSearch } from "@/types/blogs";
import { format } from "date-fns";
import { FaEye, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

type Props = {
	blog: IBlogSearch;
};
const SearchPostsPage = ({ blog }: Props) => {
	return (
		<>
			<Link
				to={`/blogDetail/${blog._id}`}
				className="flex flex-col overflow-hidden rounded-lg shadow-lg"
			>
				<div className="flex-shrink-0">
					<img
						className="object-cover w-full h-48"
						src={
							blog?.thumbnail_url &&
							optimizeCloudinaryUrl(blog?.thumbnail_url, 450, 470)
						}
						alt=""
					/>
				</div>
				<div className="flex flex-col justify-between flex-1 p-3 bg-white">
					<div className="flex-1">
						<Link to={`/blogDetail/${blog._id}`} className="block mt-2">
							<p className="text-xl font-semibold text-gray-900">
								{blog?.meta_title}
							</p>
							<p className="mt-3 text-base text-gray-500">
								{blog?.meta_description}
							</p>
						</Link>
					</div>
					<div className="flex items-end justify-between mt-3">
						<div className="flex items-center">
							<div className="flex-shrink-0">
								<a href="#">
									<span className="inline-block truncate sr-only max-w-28">
										{blog?.user_id?.full_name}
									</span>
									<img
										className="w-10 h-10 rounded-full"
										src={
											blog?.user_id?.avatarUrl
												? optimizeCloudinaryUrl(
														blog?.user_id?.avatarUrl,
														40,
														40,
													)
												: "https://i.pinimg.com/564x/b2/88/7a/b2887a6d08bcca87053e519dacd43318.jpg"
										}
										alt=""
									/>
								</a>
							</div>
							<div className="flex items-center justify-between ml-3">
								<div className="">
									<p className="text-sm font-medium text-gray-900">
										<p className="truncate hover:underline max-w-28">
											{blog?.user_id?.full_name}
										</p>
									</p>
									<div className="flex space-x-1 text-sm text-gray-500">
										<time dateTime="2020-03-16">
											{blog?.published_at &&
												format(blog?.published_at, "dd-MM-yyyy")}
										</time>
									</div>
								</div>
							</div>
						</div>
						<div className="flex gap-3">
							<span className="text-[#212B36] text-xs flex items-center gap-1">
								<FaRegHeart size={16} />
								{blog.countLike}
							</span>
							<span className="text-[#212B36] text-xs flex items-center gap-1">
								{" "}
								<FaEye size={16} />
								{blog.views_count}
							</span>
						</div>
					</div>
				</div>
			</Link>
		</>
	);
};

export default SearchPostsPage;
