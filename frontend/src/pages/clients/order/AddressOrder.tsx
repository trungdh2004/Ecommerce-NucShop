import { Skeleton } from "@/components/ui/skeleton";
import { fetchAddress } from "@/service/address";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import AddAddressOrder from "./AddAddressOrder";
import ListAddressOrderDetail from "./ListAddressOrderDetail";
const AddressOrder = ({ data, handleChangeAddress }: any) => {
	const [openListAddress, setOpenListAddress] = useState(false);
	const [openAdd, setOpenAdd] = useState(false);
	const [pageIndex, setPageIndex] = useState(1);
	const {
		isPending,
		isError,
		data: address,
	} = useQuery({
		queryKey: ["address", pageIndex],
		queryFn: () => fetchAddress(pageIndex),
		placeholderData: keepPreviousData,
	});

	return (
		<div className="">
			{isPending && (
				<div className="flex flex-col space-y-3">
					<Skeleton className="h-[125px] w-full rounded-xl" />
				</div>
			)}
			{isError && (
				<div className="flex flex-col space-y-3">
					<Skeleton className="h-[125px] w-full rounded-xl" />
				</div>
			)}
			<div className="flex flex-col gap-3 py-4 bg-white border border-gray-200 rounded-none lg:rounded-md md:rounded-md box-shadow">
				<div className="flex gap-3 pl-3">
					<FiMapPin size={25} className="text-[#f78138]" />
					<p className="lg:text-lg md:text-base text-sm text-[#f78138]">
						Địa chỉ nhận hàng
					</p>
				</div>
				<div className="flex flex-col items-start justify-between gap-3 pl-4">
					{data?.address === null ? (
						<div className="flex gap-3">
							<p>Bạn chưa chọn địa chỉ nào</p>
							<button
								className="border border-[#ff6200] text-sm px-2 mr-7 text-[#ff6200] flex items-center gap-2"
								onClick={() => setOpenAdd(true)}
							>
								<FaPlus />
								Thêm địa chỉ
							</button>
						</div>
					) : (
						<div className="flex flex-col gap-3">
							<span className="pr-3 text-sm tracking-normal">
								<span>
									<strong>Họ tên : </strong>
								</span>
								{data?.address?.username}
							</span>
							<span className="pr-3 text-sm tracking-normal">
								<span>
									<strong>Số điện thoại : </strong>
								</span>
								{data?.address?.phone}
							</span>
							<p className="pr-3 text-sm tracking-normal">
								<span>
									<strong>Địa chỉ : </strong>
								</span>
								{data?.address?.detailAddress} , {data?.address?.address}
							</p>
							{data?.address?.is_main && (
								<div className="border border-[#ff6200] flex items-center justify-center lg:w-[70px] md:w-[70px] w-[50px]">
									<span className="text-[#ff6200] lg:text-xs text-[9px] p-1 py-0 font-medium">
										Mặc định
									</span>
								</div>
							)}
						</div>
					)}
					{address?.content?.length != 0 && (
						<button
							className="mr-4 text-xs font-medium text-blue-400 lg:text-sm"
							onClick={() => setOpenListAddress(true)}
						>
							Thay đổi
						</button>
					)}
				</div>
			</div>
			{!!openListAddress && (
				<ListAddressOrderDetail
					open={openListAddress}
					closeOpen={() => setOpenListAddress(false)}
					dataAddress={data?.address}
					handleChangeAddress={handleChangeAddress}
					address={address}
					pageIndex={pageIndex}
					setPageIndex={setPageIndex}
				/>
			)}
			{!!openAdd && (
				<AddAddressOrder
					open={openAdd}
					closeOpen={() => setOpenAdd(false)}
					handleChangeAddress={handleChangeAddress}
					address={address}
				/>
			)}
		</div>
	);
};

export default AddressOrder;
