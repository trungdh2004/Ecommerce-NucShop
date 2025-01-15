import DialogConfirm from "@/components/common/DialogConfirm";
import Paginations from "@/components/common/Pagination";
import { TooltipComponent } from "@/components/common/TooltipComponent";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	deleteAddress,
	editAddressMain,
	fetchAddress,
} from "@/service/address";
import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { BsCheck2Circle, BsCircle } from "react-icons/bs";
import { CiCircleRemove } from "react-icons/ci";
import { FaLocationDot } from "react-icons/fa6";
import { RiEditCircleLine } from "react-icons/ri";
import { toast } from "sonner";
import EditAddress from "./EditAddress";
import NewAddress from "./NewAddress";
const AddressIndex = () => {
	const [open, setOpen] = useState<string | boolean>(false);
	const [openEditById, setOpenEditById] = useState<string | null>(null);
	const [openDeleteById, setopenDeleteById] = useState<string | null>(null);
	const [pageIndex, setPageIndex] = useState(1);
	const queryClient = useQueryClient();

	const handleClose = () => {
		setOpen(false);
	};
	const handleCreate = () => {
		setOpen(true);
	};
	const handleEdit = (id: string) => {
		setOpenEditById(id);
	};
	const handleCLoseEdit = () => {
		setOpenEditById(null);
	};

	const handleDelete = () => {
		mutate(openDeleteById as string);
	};

	const { mutate } = useMutation({
		mutationFn: async (id: string) => await deleteAddress(id),
		onSuccess: () => {
			toast.success("Bạn xóa địa chỉ thành công");
			setopenDeleteById(null);
			queryClient.invalidateQueries({
				queryKey: ["address", pageIndex],
			});
		},
		onError: (error) => {
			console.log(error);
		},
	});

	const mutate1: any = useMutation({
		mutationFn: async (id: string | number) => {
			const { data } = await editAddressMain(id);
			return data;
		},
		onSuccess: () => {
			toast.success("Bạn cập nhật địa chỉ mặc định thành công");
			queryClient.invalidateQueries({
				queryKey: ["address", pageIndex],
			});
		},
		onError: (error) => {
			console.log(error);
		},
	});

	const { isPending, isError, data } = useQuery({
		queryKey: ["address", pageIndex],
		queryFn: () => fetchAddress(pageIndex),
		placeholderData: keepPreviousData,
	});
	if (isPending)
		return (
			<div className="flex flex-col space-y-3">
				<Skeleton className="h-[125px] w-full rounded-xl" />
			</div>
		);
	if (isError)
		return (
			<div className="flex flex-col space-y-3">
				<Skeleton className="h-[125px] w-full rounded-xl" />
			</div>
		);

	return (
		<>
			<div className="padding">
				<div className="flex flex-col w-full gap-2 pt-5">
					<div className="flex items-center justify-between pb-4">
						<h2 className="text-lg font-semibold text-black">
							Địa chỉ của bạn
						</h2>
						<div className="">
							<Button
								onClick={() => handleCreate()}
								className="px-4 text-xs transition-all duration-300 ease-in-out rounded-full bg-gradient-to-r from-gray-600 to-gray-900 hover:from-gray-500 hover:to-gray-800"
							>
								Thêm địa chỉ
							</Button>
						</div>
					</div>
					<div className="grid w-full grid-cols-12 gap-8">
						{data.content.length === 0 ? (
							<div className="w-full min-h-[100px] col-span-12 flex justify-center items-center gap-2">
								<FaLocationDot size={25} className="mb-2" />
								Không có địa chỉ nào
							</div>
						) : (
							data.content?.map((address: any, index: number) => {
								return (
									<div className="w-full col-span-12 " key={index}>
										<div
											className={`w-full p-2 sm:p-5 lg:px-8 bg-white box-shadow border rounded-xl flex justify-between ${address.is_main === true ? `border-2 border-green-500` : ` `}`}
										>
											<div className="flex flex-col gap-2 sm:w-20px sm:col-span-2">
												<p className="text-[14px]">
													{address.username} , {address.phone}
												</p>
												<p className="text-[14px]">{address.address}</p>
												<p className="text-[14px]">{address.detailAddress}</p>
											</div>
											<div className="flex items-center justify-center gap-2">
												<TooltipComponent label="Chọn mặc định">
													<button onClick={() => mutate1.mutate(address._id)}>
														{address.is_main === true ? (
															<BsCheck2Circle className="text-[25px] text-green-400 " />
														) : (
															<BsCircle className="text-[22px] text-gray-400 hover:text-green-500" />
														)}
													</button>
												</TooltipComponent>
												<TooltipComponent label="Sửa địa chỉ">
													<button onClick={() => handleEdit(address._id)}>
														<RiEditCircleLine className="text-[25px] text-blue-400 hover:text-blue-700" />
													</button>
												</TooltipComponent>
												<TooltipComponent label="Xóa địa chỉ">
													<button
														onClick={() => setopenDeleteById(address._id)}
													>
														<CiCircleRemove className="text-[25px] text-red-500 hover:text-red-700" />
													</button>
												</TooltipComponent>
											</div>
										</div>
									</div>
								);
							})
						)}
					</div>
					{data.content.length > 0 && (
						<div className="flex justify-center my-6">
							<Paginations
								forcePage={pageIndex - 1}
								pageCount={data.totalPage}
								handlePageClick={(event: any) => {
									console.log(event.selected);
									setPageIndex(event.selected + 1);
								}}
							/>
						</div>
					)}

					{!!open && <NewAddress open={!!open} handleClose={handleClose} />}
					{!!openDeleteById && (
						<DialogConfirm
							open={!!openDeleteById}
							handleClose={() => setopenDeleteById(null)}
							content={"Bạn có chắc chắn muốn xóa địa chỉ này không?"}
							handleSubmit={() => handleDelete()}
							title="Xóa địa chỉ"
						/>
					)}
					{!!openEditById && (
						<EditAddress
							open={!!openEditById}
							handleClose={handleCLoseEdit}
							id={openEditById}
						/>
					)}
				</div>
			</div>
		</>
	);
};

export default AddressIndex;
