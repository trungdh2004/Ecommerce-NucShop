import Paginations from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { IAddress } from "@/types/address";
import { useState } from "react";
import AddAddressOrder from "./AddAddressOrder";
import EditAddressOrder from "./EditAddressOrder";

interface Props {
	open: boolean;
	closeOpen: (isOpen: boolean) => void;
	dataAddress: IAddress;
	handleChangeAddress: (id: string) => void;
	address: any;
	pageIndex: number;
	setPageIndex: (pageIndex: number) => void;
}
const ListAddressOrderDetail = ({
	open,
	closeOpen,
	dataAddress,
	handleChangeAddress,
	address,
	pageIndex,
	setPageIndex,
}: Props) => {
	const [openEditById, setOpenEditById] = useState<string | null>(null);
	const handleClose = () => {
		setOpenEditById(null);
	};
	const [openAdd, setOpenAdd] = useState(false);

	const [selectedValue, setSelectedValue] = useState<string | undefined>(
		dataAddress?._id || undefined,
	);
	return (
		<div>
			<Dialog open={open} onOpenChange={closeOpen}>
				<DialogContent className="w-[90%] sm:max-w-[660px] rounded-md max-h-[90vh] p-4 overflow-y-auto">
					<div className="flex justify-between">
						<h3 className="pb-3">Địa chỉ của bạn</h3>
						<button
							className="border border-[#ff6200] text-sm px-2 mr-7 text-[#ff6200]"
							onClick={() => setOpenAdd(true)}
						>
							Thêm địa chỉ
						</button>
					</div>
					<hr />
					<div className="flex flex-col gap-4">
						<RadioGroup
							className="mt-1"
							value={selectedValue ?? undefined}
							onValueChange={setSelectedValue}
						>
							{address?.content?.map((address: any) => {
								return (
									<>
										<div className="flex justify-between" key={address?._id}>
											<div className="flex gap-3">
												<RadioGroupItem
													value={address._id}
													// id={`radio-${address._id}`}
													className="w-3 h-3 lg:w-4 lg:h-4"
												/>

												<div className="flex flex-col gap-2">
													<div className="flex gap-3">
														<h3 className="text-sm font-medium lg:text-base md:text-base">
															{address.username}
														</h3>
														<span className="text-sm font-light lg:text-base md:text-base">
															|
														</span>
														<span className="text-sm font-light lg:text-base md:text-base">
															{address.phone}
														</span>
													</div>
													<span className="text-sm font-light lg:text-base md:text-base">
														{address.detailAddress}
													</span>
													<span className="text-sm font-light lg:text-base md:text-base">
														{address.address}
													</span>
													{address.is_main && (
														<div className="border border-[#ff6200] flex items-center justify-center lg:w-[70px] md:w-[70px] w-[50px]">
															<span className="text-[#ff6200] lg:text-xs text-[9px] p-1 py-0 font-medium">
																Mặc định
															</span>
														</div>
													)}
												</div>
											</div>
											<h3
												className="text-xs text-blue-400 cursor-pointer lg:text-sm md:text-sm"
												onClick={() => setOpenEditById(address._id)}
											>
												Cập nhật
											</h3>
										</div>
										<hr />
									</>
								);
							})}
						</RadioGroup>
					</div>
					<div className="flex justify-center">
						<Paginations
							forcePage={pageIndex - 1}
							pageCount={address?.totalPage}
							handlePageClick={(event: any) => {
								setPageIndex(event.selected + 1);
							}}
						/>
					</div>
					<DialogFooter>
						<Button
							type="submit"
							onClick={() => {
								handleChangeAddress(selectedValue as string);
								closeOpen(false);
							}}
						>
							Xác nhận
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{!!openEditById && (
				<EditAddressOrder
					open={!!openEditById}
					handleClose={handleClose}
					id={openEditById}
					dataAddress={dataAddress}
					handleChangeAddress={handleChangeAddress}
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

export default ListAddressOrderDetail;
