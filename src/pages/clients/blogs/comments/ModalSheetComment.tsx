import { optimizeCloudinaryUrl } from "@/common/localFunction";
import CommentEditor from "@/components/common/CommentForm";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import TYPE_COMMENT from "@/config/typeComment";
import { useAuth } from "@/hooks/auth";
import { createComment, getListComments } from "@/service/comment";
import { Comment, IObjectComment } from "@/types/TypeObjectComment";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { FaRegComment } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import CommentItem from "./CommentItem";
import InfiniteScroll from "react-infinite-scroll-component";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

const ModalSheetComment = () => {
	const QueryClient = useQueryClient();
	const { id } = useParams();
	const { authUser, isLoggedIn } = useAuth();
	// const [openSheet, setOpenSheet] = useState(false);
	const [open, setOpen] = useState(false);
	const [pagination, setPagination] = useState({
		pageIndex: 1,
		pageSize: 5,
		totalAllOptions: 1,
		totalOptionPage: 1,
		totalPage: 1,
	});
	const [content, setContent] = useState("");
	const [comments, setComments] = useState<Comment[]>([]);

	useEffect(() => {
		fetchingDataComments(1);
	}, []);
	const fetchingDataComments = async (pageIndex: number) => {
		try {
			const payload = {
				commentId: id,
				commentType: TYPE_COMMENT.BLOGS,
				pageIndex: pageIndex,
				pageSize: 7,
				sort: -1,
			};
			const { data } = await getListComments(payload);
			const { content, ...pagination } = data;
			console.log(pagination);

			setPagination(pagination);
			setComments((prevComments) => [...prevComments, ...content]);
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error?.response?.data?.message);
			}
		}
	};
	const onSubmitComment = async () => {
		if (isLoggedIn) {
			try {
				const { data } = await createComment(
					content,
					id as string,
					TYPE_COMMENT.BLOGS,
					id,
				);
				QueryClient.invalidateQueries({
					queryKey: ["blogDetail"],
				});
				setComments((prevComments) => [data?.data, ...prevComments]);
				setContent("");
				setOpen(false);
				return data;
			} catch (error) {
				if (error instanceof AxiosError) {
					toast.error(error?.response?.data?.message);
				}
			}
		}
	};
	const handleNextPage = () => {
		const pageIndex = pagination?.pageIndex + 1;
		fetchingDataComments(pageIndex);
	};
	const handleChange = (content: string) => {
		setContent(content);
	};

	const handleClose = () => {
		setOpen(false);
	};
	return (
		<Sheet>
			<SheetTrigger>
				<FaRegComment size={20} />
			</SheetTrigger>
			<SheetContent
				id="scrollableDiv"
				className="min-w-[45%] pt-12 overflow-y-auto scroll-custom "
			>
				{isLoggedIn ? (
					<CommentEditor
						avatar={optimizeCloudinaryUrl(
							authUser?.avatarUrl as string,
							60,
							60,
						)}
						onSubmit={onSubmitComment}
						handleChange={handleChange}
						handleClose={handleClose}
						content={content}
						handleOpen={() => setOpen(true)}
						openComment={open}
					/>
				) : (
					<h3>Đăng nhập để có thể bình luận</h3>
				)}

				{/* Danh sách comments */}
				<div className="mt-6">
					<h3 className="mb-3 text-lg font-semibold text-gray-400">
						<span>{pagination?.totalAllOptions}</span> bình luận
					</h3>

					<InfiniteScroll
						className="space-y-2"
						dataLength={pagination?.totalAllOptions}
						next={handleNextPage}
						hasMore={pagination?.pageIndex < pagination?.totalPage}
						loader={
							<div className="space-y-3">
								<div className="flex items-center gap-2">
									<Skeleton className="rounded-full size-7 md:size-10" />
									<div className="">
										<Skeleton className="w-1/3" />
										<Skeleton className="w-full" />
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Skeleton className="rounded-full size-7 md:size-10" />
									<div className="">
										<Skeleton className="w-1/3" />
										<Skeleton className="w-full" />
									</div>
								</div>
							</div>
						}
						scrollableTarget="scrollableDiv"
						endMessage={<p style={{ textAlign: "center" }}></p>}
					>
						{comments?.map((comment: any) => (
							<CommentItem
								parrent_id={id as string}
								comment={comment}
								setComment={setComments}
								key={comment?._id}
							/>
						))}
					</InfiniteScroll>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default ModalSheetComment;
