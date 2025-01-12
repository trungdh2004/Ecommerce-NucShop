import NoReview from "@/assets/noreview.png";
import { Review, SearchRatingState } from "@/types/review";
import { format } from "date-fns";
import { FaRegStar, FaStar } from "react-icons/fa";
interface Props {
	dataReview: SearchRatingState | null;
}
const ListReview = ({ dataReview }: Props) => {
	return (
		<div>
			{dataReview?.content?.length === 0 ? (
				<div className="flex flex-col items-center justify-center gap-3 py-20">
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
										className="rounded-full w-11 h-11"
									/>
									<div className="flex flex-col gap-2">
										<h2 className="text-base font-medium text-black">
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
