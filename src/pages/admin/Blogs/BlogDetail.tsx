import { TooltipComponent } from "@/components/common/TooltipComponent";
import { getBlogDetail, showBlogsEdit } from "@/service/blog";
import { useEffect, useState } from "react";
import { LuFileEdit } from "react-icons/lu";
import { Link, useParams } from "react-router-dom";
type IBlog = {
	_id?: string;
	title: string;
	content: string;
	isDeleted: string;
	createdAt: string;
	published_at: string;
	user_id: {
		avatarUrl?: string;
		email: string;
		_id: string;
		full_name: string;
	};
	views_count: number;
	comments_count: number;
	thumbnail_url?: string;
	meta_description: string;
};
import { Remarkable } from "remarkable";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { IoMdArrowRoundBack } from "react-icons/io";

const BlogDetail = () => {
	const [blog, setBlog] = useState<IBlog>();
	const { id } = useParams();
	useEffect(() => {
		(async () => {
			const { data } = await getBlogDetail(id as string);
			setBlog(data.data);
		})();
	}, [id]);
	const md = new Remarkable({
		html: true, // Cho phép HTML bên trong Markdown
		xhtmlOut: false, // Xuất ra HTML với các tag tự đóng
		breaks: false, // Tự động ngắt dòng thành <br>
		langPrefix: "language-", // Tiền tố cho class của các khối code
		linkify: true, // Tự động chuyển đổi URL thành liên kết
		typographer: true, // Thay thế các ký tự đặc biệt như quotes, dashes thành kiểu typographic
	});
	const markdownContent = blog?.content;
	const htmlContent = md.render(markdownContent as any);
	return (
		<>
			<div className="max-w-[900px] w-full mx-auto">
				{/* title */}
				<h3 className="text-lg lg:text-2xl font-bold text-[#222222] mt-5">
					{blog?.title}
				</h3>
				{/* user-information */}
				<div className="flex my-[30px] justify-between items-center">
					{/*  */}
					<div className="flex items-center gap-5">
						<div className="border border-slate-900 w-[50px] h-[50px] rounded-full overflow-hidden">
							<img
								src={blog?.user_id?.avatarUrl || "/avatar_25.jpg"}
								className="w-full h-full object-cover"
								alt=""
							/>
						</div>
						<div className="flex-row">
							<h3 className="text-[#292929] text-base font-medium ">
								{blog?.user_id?.full_name}
							</h3>
							<p className="text-[#757575] text-sm">
								{(blog &&
									format(
										blog?.published_at || blog?.createdAt || "",
										"dd-MM-yyyy",
									)) ||
									""}
							</p>
						</div>
					</div>
					<div className="">
						<TooltipComponent label="Chỉnh sửa bài viết">
							<Link to={`/admin/blogs/${blog?._id}/edit`}>
								{" "}
								<div className=" cursor-pointer">
									<LuFileEdit size={20} />
								</div>
							</Link>
						</TooltipComponent>
					</div>
				</div>
				{/* blog-content */}
				<div dangerouslySetInnerHTML={{ __html: htmlContent }} />
				<div className=""></div>
				{/* Related-blog */}
				<div className="mt-10">
					<h3 className="text-sm text-[#757575] uppercase">
						Xem cái bài viết theo chủ đề
					</h3>
					<div className="flex">#tag</div>
				</div>
			</div>
		</>
	);
};

export default BlogDetail;
