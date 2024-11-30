import { Review, SearchRatingState } from "@/types/review";
import { format } from "date-fns";
import React from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import NoReview from "@/assets/noreview.png";
interface Props {
	dataReview: SearchRatingState | null;
}
const ListReview = ({ dataReview }: Props) => {
	return (
		<div>
			{dataReview?.content?.length === 0 ? (
				<div className="flex flex-col gap-3 py-20 justify-center items-center">
					<img src={NoReview} alt="" className="w-40 h-40" />
					<p>Chưa có đánh giá</p>
				</div>
			) : (
				<div className="flex flex-col">
					{dataReview?.content?.map((review: Review, index: number) => {
						return (
							<div className="" key={index}>
								<div className="flex gap-3 py-5">
									<img
										src={review?.user?.avatarUrl || "/avatar_25.jpg"}
										alt=""
										className="w-11 h-11 rounded-full"
									/>
									<div className="flex flex-col gap-2">
										<h2 className="font-medium text-base text-black">
											{review.user.full_name}
										</h2>

										<div className="flex text-orange-500">
											{[...Array(5)].map((_, index) =>
												index < review.rating ? (
													<FaStar key={index} size={13} />
												) : (
													<FaRegStar key={index} size={13} />
												),
											)}
										</div>

										<span className="text-xs text-gray-500">
											{format(new Date(review.createdAt), "dd/MM/yyyy")} | Phân
											loại hàng : {review.attribute}
										</span>

										<p className="text-sm">
											<span className="text-gray-500">Lời nhắn : </span>
											{review.content}
										</p>
									</div>
								</div>
								<hr />
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default ListReview;
