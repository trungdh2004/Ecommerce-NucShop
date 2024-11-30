import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Actions from "./Actions";
import Reaction from "./Reaction";
import SendComment from "./SendComment";
import CommentEditor from "@/components/common/CommentForm";
import {
	Comment,
	IObjectComment,
	IPageComment,
} from "@/types/TypeObjectComment";
import { format } from "date-fns";
import TYPE_COMMENT from "@/config/typeComment";
import { useAuth } from "@/hooks/auth";
import {
	createComment,
	getListComments,
	reactionsComment,
} from "@/service/comment";
import { cn } from "@/lib/utils";
import { AiFillLike } from "react-icons/ai";
import DialogLoginComment from "./DialogLoginComment";
import { useLocation, useNavigate } from "react-router-dom";
import { calculateTimeDistance } from "@/common/func";
import { Button } from "@/components/ui/button";
type Props = {
	comment: Comment;
	setComment: Dispatch<SetStateAction<Comment[]>>;
};
const CommentItem = ({ comment, setComment }: Props) => {
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
			console.log("cmtpr", cmtParent);

			const { data } = await getListComments({
				pageSize: 5,
				commentId: comment?._id,
				commentType: TYPE_COMMENT.COMMENT,
				pageIndex: newPageIndex || 1,
			});
			console.log(data);

			setComment((prev) => {
				return prev?.map((comment) => {
					if (comment._id === cmtParent._id) {
						return {
							...comment,
							replies: [...comment.replies, ...data.content],
							pageIndexReplies: data.pageIndex,
						};
					}
					return comment;
				});
			});
			setCheck(data);
			return data;
		} catch (error) {
			console.log(error);
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
			console.log(data);
			console.log(commentId);

			setComment((prev) => {
				return prev?.map((comment) => {
					if (data.commentType === TYPE_COMMENT.PRODUCT) {
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
			console.log(error);
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
			console.log(data);
			
			setComment((prev) => {
				return prev?.map((comment) => {
					if (data.commentType === TYPE_COMMENT.PRODUCT) {
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
			console.log(error);
		}
	};

	const onSubmitComment = async () => {
		// console.log("value:", content);
		try {
			const { data } = await createComment(
				content,
				comment?._id as string,
				TYPE_COMMENT.COMMENT,
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
			console.log("cmt sub", comment);

			setContent("");

			handleClose();
			return data;
		} catch (error) {
			console.log(error);
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
			<div className="flex items-start gap-1 md:gap-3 w-full">
				<div className="size-7 md:size-10 rounded-full border">
					<img
						src={comment?.user?.avatarUrl || `/avatar_25.jpg`}
						alt=""
						className="w-full h-full object-cover rounded-full"
					/>
				</div>
				<div className="flex-1">
					<div className="flex flex-col gap-2">
						<div className="flex items-center gap-2">
							<span className="font-semibold text-base">
								{comment?.user?.full_name}
							</span>
							<span className="text-xs text-gray-400">
								{calculateTimeDistance(new Date(comment?.createdAt))} trước
							</span>
						</div>
						<span className="break-all text-sm">
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
							/>
						) : (
							<div className="bg-blue-400 p-2 px-4 rounded-full">
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
						<div className="flex items-start gap-1 md:gap-3 w-full pl-8">
							<div className="size-7 md:size-10 rounded-full border">
								<img
									src={comment?.user?.avatarUrl || `/avatar_25.jpg`}
									alt=""
									className="w-full h-full object-cover rounded-full"
								/>
							</div>
							<div className="flex-1">
								<div className="flex flex-col gap-2">
									<div className="flex items-center gap-1">
										<span className="font-semibold text-base">
											{comment?.user?.full_name}
										</span>
										<span className="text-xs text-gray-400">
											{calculateTimeDistance(new Date(comment?.createdAt))}{" "}
											trước
										</span>
									</div>
									<span className="break-all text-sm">
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
										<div className="bg-blue-400 p-2 px-4 rounded-full">
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
						<h3 className="font-bold text-sm text-slate-600 hover:underline pl-9">
							Xem thêm bình luận
						</h3>
					</div>
				)}
		</div>
	);
};

export default CommentItem;
