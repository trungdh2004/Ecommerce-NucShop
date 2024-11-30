import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import Paginations from "./Pagination";
import { useEffect, useState } from "react";
import {
	keepPreviousData,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { pagingProductOfVoucher } from "@/service/product";
import { FaRegCircle, FaRegCheckCircle } from "react-icons/fa";

interface IProductVoucher {
	_id: string;
	name: string;
	thumbnail: string;
}

interface IResponseProduct {
	content: IProductVoucher[];
	pageIndex: number;
	pageSize: number;
	totalAllOptions: number;
	totalOptionPage: number;
	totalPage: number;
}

interface IProps {
	open: boolean;
	handleClose: () => void;
	initialSelected: string[];
	handleSubmit: (arr: string[]) => void;
}

const PopupTableService = ({
	open,
	handleClose,
	initialSelected = [],
	handleSubmit,
}: IProps) => {
	const [searchObject, setSearchObject] = useState({
		pageIndex: 1,
		keyword: "",
	});
	const [listSelect, setListSelect] = useState<string[]>(initialSelected);
	const { data, isError } = useQuery<IResponseProduct>({
		queryKey: ["productOfVoucher", searchObject.pageIndex, searchObject],
		queryFn: async () => {
			try {
				const { data } = await pagingProductOfVoucher({
					pageIndex: searchObject.pageIndex,
					keyword: searchObject.keyword,
				});
				return data;
			} catch (error) {}
		},
		placeholderData: keepPreviousData,
	});

	useEffect(() => {
		(async () => {})();
	}, []);

	const handleCloseModel = () => {
		setListSelect([]);
		handleClose();
	};

	return (
		<Dialog open={open} onOpenChange={handleCloseModel}>
			<DialogContent className="p-3 sm:max-w-[500px] md:max-w-[700px]">
				<DialogHeader>
					<DialogTitle>Danh sách sản phẩm</DialogTitle>
				</DialogHeader>

				<div className="">
					<table className="w-full border-collapse border [&>td]:border [&>td]:p-1 [&>th]:border [&>th]:p-1 ">
						<thead className="[&>tr>th]:p-1 [&>tr>th]:border">
							<tr className="border">
								<th className="w-10 ">STT</th>
								<th className=" w-20">Ảnh</th>
								<th className="">Tên</th>
								<th className=" w-20">Thao tác</th>
							</tr>
						</thead>
						<tbody className="[&>tr>td]:p-1 [&>tr>td]:border">
							{!isError &&
								data?.content?.map((product, index) => {
									const isSelected = listSelect.includes(product._id);

									return (
										<tr key={product._id}>
											<td className="text-center font-medium">{index + 1}</td>
											<td className=" flex items-center justify-center">
												<div className="size-12 bg-white border ">
													<img
														src={product?.thumbnail}
														alt=""
														className="w-full h-full object-cover"
													/>
												</div>
											</td>
											<td className="">
												<div className="w-full line-clamp-2 text-sm">
													{product.name}
												</div>
											</td>
											<td className="">
												<div className="flex items-center justify-center cursor-pointer">
													{isSelected ? (
														<div
															className="p-1 hover:bg-green-50 hover:text-green-500 rounded-full"
															onClick={() => {
																setListSelect((prev) => {
																	const newArray = prev.filter(
																		(item) => item !== product._id,
																	);
																	return newArray;
																});
															}}
														>
															<FaRegCheckCircle
																size={20}
																className="text-green-500"
															/>
														</div>
													) : (
														<div
															className="p-1 hover:bg-green-50 hover:text-green-500 rounded-full"
															onClick={() => {
																setListSelect((prev) => [...prev, product._id]);
															}}
														>
															<FaRegCircle size={20} />
														</div>
													)}
												</div>
											</td>
										</tr>
									);
								})}
							
							{data?.content?.length === 0 && (
								<tr>
									<th colSpan={4}>Không có dữ liệu</th>
								</tr>
							)}
						</tbody>
					</table>

					<div className="w-full mt-2 flex justify-center">
						<Paginations
							forcePage={searchObject.pageIndex - 1}
							size="sm"
							pageCount={data?.totalPage || 1}
							handlePageClick={(e) => {
								console.log(e);
								setSearchObject((prev) => ({
									...prev,
									pageIndex: e.selected + 1,
								}));
							}}
							marginPagesDisplayed={1}
						/>
					</div>
				</div>

				<DialogFooter className="border-t pt-2">
					<Button variant={"outline"} size={"sm"} onClick={handleCloseModel}>
						Hủy
					</Button>
					<Button variant={"danger"} size={"sm"} onClick={() => {
						setListSelect([])
					}}>
						Bỏ tất cả
					</Button>
					<Button
						className="bg-blue-500 px-2 hover:bg-blue-600"
						size={"sm"}
						onClick={() => {
							handleSubmit(listSelect);
						}}
					>
						Xác nhận
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default PopupTableService;
