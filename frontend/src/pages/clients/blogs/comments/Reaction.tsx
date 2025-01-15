import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import TYPE_COMMENT from "@/config/typeComment";
import { useAuth } from "@/hooks/auth";
import { deleteComment } from "@/service/comment";
import { Comment } from "@/types/TypeObjectComment";
import { Dispatch, SetStateAction } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import Actions from "./Actions";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface IProps {
	handlOpenFeedback: () => void;
	handleLike: () => void;
	handleDislike: () => void;
	comment: any;
	setComment: Dispatch<SetStateAction<Comment[]>>;
}

const Reaction = ({
	handlOpenFeedback,
	handleLike,
	handleDislike,
	comment,
	setComment,
}: IProps) => {
	const { authUser, isLoggedIn } = useAuth();
	const checkLike = comment?.reactions.includes(authUser?._id);

	const handleDeleteComment = async (props: Comment) => {
		try {
			const { data } = await deleteComment(props?._id);
			setComment((prev) => {
				if (props.commentType === TYPE_COMMENT.BLOGS) {
					return prev?.filter((comment) => comment._id !== props._id);
				}
				return prev?.map((comment) =>
					comment._id === props?.comment_id
						? {
								...comment,
								replies: comment.replies.filter(
									(reply: any) => reply._id !== props._id,
								),
							}
						: comment,
				);
			});
			return data;
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error?.response?.data?.message);
			}
		}
	};

	return (
		<div className="flex items-center justify-between pt-2">
			<div className="flex items-center gap-2">
				<div className="">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								{checkLike ? (
									<AiFillLike
										size={20}
										className="text-custom cursor-pointer"
										onClick={() => {
											handleDislike();
										}}
									/>
								) : (
									<AiOutlineLike
										onClick={() => {
											handleLike();
										}}
										className="cursor-pointer"
										size={20}
									/>
								)}
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<p>Thích</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
				<div className="p-0.5 px-2 hover:bg-gray-200 cursor-pointer rounded-full">
					<span className="text-xs font-semibold" onClick={handlOpenFeedback}>
						Phản hồi
					</span>
				</div>
				{comment?.reactions_count > 0 && (
					<div className="flex gap-1">
						<div className="w-6 p-1 bg-white rounded-full">
							<AiFillLike className="text-blue-400" />
						</div>
						<span className="text-sm">{comment?.reactions_count}</span>
					</div>
				)}
			</div>
			{isLoggedIn && comment?.user?._id == authUser?._id && (
				<Actions handleDelete={() => handleDeleteComment(comment)} />
			)}
		</div>
	);
};

export default Reaction;
