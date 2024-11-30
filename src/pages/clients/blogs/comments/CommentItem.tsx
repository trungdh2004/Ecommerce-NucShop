import { calculateTimeDistance } from "@/common/func";
import CommentEditor from "@/components/common/CommentForm";
import TYPE_COMMENT from "@/config/typeComment";
import { useAuth } from "@/hooks/auth";
import { cn } from "@/lib/utils";
import {
	createComment,
	getListComments,
	reactionsComment,
} from "@/service/comment";
import { Comment, IPageComment } from "@/types/TypeObjectComment";
import { Dispatch, SetStateAction, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Reaction from "./Reaction";
import { AxiosError } from "axios";
import { toast } from "sonner";
type Props = {
	comment: Comment;
	parrent_id:string;
	setComment: Dispatch<SetStateAction<Comment[]>>;
};
const CommentItem = ({ comment,parrent_id, setComment }: Props) => {
	const { authUser, isLoggedIn } = useAuth();
	const [content, setContent] = useState(``);
	const [pageIndex, setPageIndex] = useState(1);
	const [check, setCheck] = useState<IPageComment | null>(null);
	const [open, setOpen] = useState(false);
	const [openFeedback, setOpenFeedback] = useState<string | null>(null);
	const [openAnswer, setOpenAnswer] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const handleLoadMoreComments = async (cmtParent: any) => {
		const newPageIndex = pageIndex + 1;
		setPageIndex(newPageIndex);
		await handleListcommentItems(newPageIndex, cmtParent);
	};
	const handleListcommentItems = async (
		newPageIndex: number,
		cmtParent: any,
	) => {
		try {
			const { data } = await getListComments({
				pageSize: 5,
				commentId: comment?._id,
				commentType: TYPE_COMMENT.COMMENT,
				pageIndex: newPageIndex || 1,
			});
			setComment((prev) => {
				return prev?.map((comment) => {
					if (comment._id === cmtParent._id) {
						return {
							...comment,
							replies: [...comment.replies, ...data.content].reduce(
								(acc, reply) => {
									if (
										!acc.some(
											(existingReply: any) => existingReply._id === reply._id,
										)
									) {
										acc.push(reply); // Nếu chưa tồn tại, thêm vào
									}
									return acc;
								},
								[],
							),
							pageIndexReplies: data.pageIndex,
						};
					}
					return comment;
				});
			});
			setCheck(data);
			return data;
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error?.response?.data?.message);
			}
		}
	};
	const handlOpenFeedback = (
		commentId: string,
		userRep?: string,
		userNameRep?: string,
	) => {
		if (!isLoggedIn) {
			const productUrl = location.pathname;
			navigate(`/auth/login?url=${encodeURIComponent(productUrl)}`);
			return;
		}
		setOpenFeedback(commentId);
		if (userRep !== authUser?._id) {
			setContent(
				`<span contentEditable="false" class="link-mention">@${userNameRep}</span>`,
			);
		} else {
			setContent("");
		}
	};
	const handleLike = async (commentId: string) => {
		if (!isLoggedIn) {
			const productUrl = location.pathname;
			navigate(`/auth/login?url=${encodeURIComponent(productUrl)}`);
			return;
		}
		try {
			const { data } = await reactionsComment(commentId, true);
			setComment((prev) => {
				return prev?.map((comment) => {
					if (data.commentType === TYPE_COMMENT.BLOGS) {
						if (comment._id === commentId) {
							return {
								...comment,
								reactions: [...(comment.reactions || []), authUser?._id],
								reactions_count: comment.reactions.length + 1,
							};
						}
					} else {
						if (comment._id === data?.comment_id) {
							const newComment = { ...comment };
							const newReplies = newComment.replies.map((reply: any) => {
								if (reply._id === data._id) {
									console.log("reply_data", { reply, data });
									return data;
								}
								return reply;
							});
							newComment.replies = newReplies;
							console.log({ newComment, comment, newReplies });

							return newComment;
						} else {
							return comment;
						}
					}
					return comment;
				});
			});
			return data;
		} catch (error) {
			if(error instanceof AxiosError){
				toast.error(error?.response?.data?.message);
			}
		}
	};
	// [...(comment.reactions || []), authUser?._id]
	const handleDislike = async (commentId: string) => {
		if (!isLoggedIn) {
			const productUrl = location.pathname;
			navigate(`/auth/login?url=${encodeURIComponent(productUrl)}`);
			return;
		}
		try {
			const { data } = await reactionsComment(commentId, false);
			setComment((prev) => {
				return prev?.map((comment) => {
					if (data.commentType === TYPE_COMMENT.BLOGS) {
						if (comment._id === commentId) {
							return {
								...comment,
								reactions: comment.reactions.filter(
									(reaction) => reaction !== authUser?._id,
								),
								reactions_count: comment.reactions.length - 1,
							};
						}
					} else {
						if (comment._id === data?.comment_id) {
							const newComment = { ...comment };
							const newReplies = newComment.replies.map((reply: any) => {
								if (reply._id === data._id) {
									return data;
								}
								return reply;
							});
							newComment.replies = newReplies;
							return newComment;
						} else {
							return comment;
						}
					}
					return comment;
				});
			});
			return data;
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error?.response?.data?.message);
			}
		}
	};

	const onSubmitComment = async () => {
		// console.log("value:", content);
		try {
			const { data } = await createComment(
				content,
				comment?._id as string,
				TYPE_COMMENT.COMMENT,
				parrent_id
			);
			setComment((prev) => {
				return prev?.map((comment) => {
					if (comment._id === data.data.comment_id) {
						if (comment.replies.length > 0) {
							console.log("abc");
							return {
								...comment,
								replies: [data.data, ...(comment.replies || [])],
								replies_count: comment.replies_count + 1,
							};
						}
						return {
							...comment,
							replies: [],
							replies_count: comment.replies_count + 1,
						};
					}
					return comment;
				});
			});
			setContent("");
			handleClose();
			return data;
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error?.response?.data?.message);
			}
		}
	};
	const handleChange = (content: string) => {
		setContent(content);
	};

	const handleClose = () => {
		setOpen(false);
		setOpenFeedback(null);
	};
	const isFeedbackOpen = openFeedback === comment?._id;
	return (
		<div>
			<div className="flex items-start w-full gap-1 md:gap-3">
				<div className="border rounded-full size-7 md:size-10">
					<img
						src={comment?.user?.avatarUrl || `/avatar_25.jpg`}
						alt=""
						className="object-cover w-full h-full rounded-full"
					/>
				</div>
				<div className="flex-1">
					<div className="flex flex-col gap-2">
						<div className="flex items-center gap-2">
							<span className="text-base font-semibold">
								{comment?.user?.full_name}
							</span>
							<span className="text-xs text-gray-400">
								{calculateTimeDistance(new Date(comment?.createdAt))} trước
							</span>
						</div>
						<span className="text-sm break-all">
							<div dangerouslySetInnerHTML={{ __html: comment?.content }} />
						</span>
					</div>
					<Reaction
						handlOpenFeedback={() =>
							handlOpenFeedback(
								comment?._id as string,
								comment?.user?._id,
								comment?.user?.full_name,
							)
						}
						handleLike={() => handleLike(comment?._id)}
						handleDislike={() => handleDislike(comment?._id)}
						comment={comment}
						setComment={setComment}
					/>

					{isFeedbackOpen &&
						(isLoggedIn ? (
							<CommentEditor
								onSubmit={onSubmitComment}
								avatar={authUser?.avatarUrl as string}
								handleClose={() => handleClose()}
								openComment
								content={content}
								handleChange={handleChange}
								size="small"
							/>
						) : (
							<div className="p-2 px-4 bg-blue-400 rounded-full">
								Bạn hãy đăng nhập để được bình luận
							</div>
						))}
					{comment?.replies_count !== 0 && (
						<div
							className={cn(
								"text-sm font-semibold text-blue-400 cursor-pointer",
								openAnswer && "hidden",
							)}
							onClick={() => {
								setOpenAnswer(true);
								handleListcommentItems(1, comment);
							}}
						>
							{comment?.replies_count} câu trả lời
						</div>
					)}
				</div>
			</div>
			{openAnswer &&
				comment?.replies?.map((comment: any) => {
					const isFeedbackOpen = openFeedback === comment?._id;
					return (
						<div
							key={comment?._id}
							className="flex items-start w-full gap-1 pl-8 md:gap-3"
						>
							<div className="border rounded-full size-6 md:size-8">
								<img
									src={comment?.user?.avatarUrl || `/avatar_25.jpg`}
									alt=""
									className="object-cover w-full h-full rounded-full"
								/>
							</div>
							<div className="flex-1">
								<div className="flex flex-col gap-2">
									<div className="flex items-center gap-1">
										<span className="text-base font-semibold">
											{comment?.user?.full_name}
										</span>
										<span className="text-xs text-gray-400">
											{calculateTimeDistance(new Date(comment?.createdAt))}{" "}
											trước
										</span>
									</div>
									<span className="text-sm break-all">
										<div
											dangerouslySetInnerHTML={{ __html: comment?.content }}
										/>
									</span>
								</div>
								<Reaction
									handlOpenFeedback={() =>
										handlOpenFeedback(
											comment?._id as string,
											comment?.user?._id,
											comment?.user?.full_name,
										)
									}
									handleLike={() => handleLike(comment?._id)}
									handleDislike={() => handleDislike(comment?._id)}
									comment={comment}
									setComment={setComment}
								/>

								{isFeedbackOpen &&
									(isLoggedIn ? (
										<CommentEditor
											onSubmit={onSubmitComment}
											avatar={authUser?.avatarUrl as string}
											handleClose={() => handleClose()}
											openComment
											content={content}
											handleChange={handleChange}
										/>
									) : (
										<div className="p-2 px-4 bg-blue-400 rounded-full">
											Bạn hãy đăng nhập để được bình luận
										</div>
									))}
							</div>
						</div>
					);
				})}
			{(check?.totalPage as number) > 0 &&
				(check?.pageIndex as number) !== (check?.totalPage as number) && (
					<div
						className="cursor-pointer"
						onClick={() => {
							handleLoadMoreComments(comment);
						}}
					>
						<h3 className="text-sm font-bold text-slate-600 hover:underline pl-9">
							Xem thêm bình luận
						</h3>
					</div>
				)}
		</div>
	);
};

export default CommentItem;
