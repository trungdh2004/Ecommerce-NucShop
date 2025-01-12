import CommentEditor from "@/components/common/CommentForm";
import CommentItem from "./CommentItem";
import { useEffect, useState } from "react";
import { createComment, getListComments } from "@/service/comment";
import { IProductDetail } from "@/types/product";
import TYPE_COMMENT from "@/config/typeComment";
import {
	Comment,
	IObjectComment,
	IPageComment,
} from "@/types/TypeObjectComment";
import { useAuth } from "@/hooks/auth";
type Props = {
	product: IProductDetail | undefined;
};

const Comments = ({ product }: Props) => {
	const { authUser  } = useAuth();
	const [content, setContent] = useState("");
	const [open, setOpen] = useState(false);
	const [pageIndex ] = useState(1);
	const [comment, setComment] = useState<Comment[]>([]);
	const [check, setCheck] = useState<IPageComment | null>(null);
	const [objectComment, setObjectComment] = useState<IObjectComment>({
		commentId: product?._id,
		commentType: TYPE_COMMENT.PRODUCT,
		pageIndex: pageIndex,
		pageSize: 5,
		sort: -1,
	});
	useEffect(() => {
		(async () => {
			try {
				const { data } = await getListComments(objectComment);
				setComment((prevComments) => [...prevComments, ...data.content]);
				setCheck(data);
				return data;
			} catch (error) {
				console.log(error);
			}
		})();
	}, [objectComment]);

	const onSubmitComment = async () => {
		try {
			const { data } = await createComment(
				content,
				product?._id as string,
				TYPE_COMMENT.PRODUCT,
			);
			setComment((prevComments) => [data?.data, ...prevComments]);
			setContent("");
			setOpen(false);
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
	};
	return (
		<div className="p-2 bg-white rounded-md md:p-4 box-shadow">
			<div className="flex items-center gap-2 mb-3">
				<h3 className="text-xl font-bold text-slate-600">
					{" "}
					{comment?.length} bình luận
				</h3>
				{/* c */}
				{/* <FilterComment /> */}
			</div>
			<CommentEditor
				onSubmit={onSubmitComment}
				avatar={(authUser?.avatarUrl as string) || "/avatar_25.jpg"}
				handleChange={handleChange}
				handleClose={handleClose}
				content={content}
				handleOpen={() => setOpen(true)}
				openComment={open}
			/>

			<div className="mt-10 space-y-5">
				{comment?.map((comment: any) => {
					return (
						<CommentItem
							comment={comment}
							setComment={setComment}
							key={comment?._id}
						/>
					);
				})}
				{(check?.totalPage as number) > 0 &&
					(check?.pageIndex as number) !== (check?.totalPage as number) && (
						<div
							className="cursor-pointer"
							onClick={() => {
								setObjectComment((prev) => {
									return {
										...prev,
										pageIndex: (prev?.pageIndex as number) + 1,
									};
								});
							}}
						>
							<h3 className="text-sm font-bold text-slate-600 hover:underline pl-9">
								Xem thêm bình luận
							</h3>
						</div>
					)}
			</div>
		</div>
	);
};

export default Comments;
