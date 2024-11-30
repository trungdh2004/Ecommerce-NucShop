import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Paginations from "@/components/common/Pagination";
import { selectShipper } from "@/service/order";
interface Props {
	open: boolean;
	closeOpen: (isOpen: boolean) => void;
	dataOrderId: any;
	// handleChangeAddress: (id: string) => void;
	dataShipper: any;
	pageIndex: number;
	setPageIndex: (pageIndex: number) => void;
	getOrderById: any;
}
const OrderSelectShipper = ({
	open,
	closeOpen,
	dataOrderId,
	// dataAddress,
	// handleChangeAddress,
	getOrderById,
	dataShipper,
	pageIndex,
	setPageIndex,
}: Props) => {
	const [shipper, setShipper] = useState<string | undefined>(undefined);
	const id = dataOrderId._id;
	const handleSelectShipper = async () => {
		try {
			const data = await selectShipper({ id, shipper });
			getOrderById();
			return data;
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div>
			<Dialog open={open} onOpenChange={closeOpen}>
				<DialogContent className="w-[90%] sm:max-w-[660px] rounded-md max-h-[90vh] p-4 overflow-y-auto">
					<div className="flex justify-between">
						<h3 className="pb-3">Danh sách shipper</h3>
					</div>
					<hr />
					<div className="flex flex-col gap-4">
						<RadioGroup
							className="mt-1"
							value={shipper ?? undefined}
							onValueChange={setShipper}
						>
							{dataShipper?.content?.map((shipper: any) => {
								return (
									<>
										<div className="flex justify-between" key={shipper?._id}>
											<div className="flex gap-3 items-center">
												<RadioGroupItem
													value={shipper._id}
													// id={`radio-${address._id}`}
													className="lg:w-4 lg:h-4 w-3 h-3"
												/>

												<div className="flex flex-col gap-2">
													<div className="flex gap-5">
														<img
															src={shipper.avatar}
															alt=""
															className="w-20 h-20"
														/>
														<div className="flex flex-col gap-1">
															<span className="font-light text-sm">
																Họ tên : {shipper.fullName}
															</span>
															<span className="font-light text-sm">
																Số điện thoại : {shipper.phone}
															</span>
															<span className="font-light text-sm">
																Căn cước công dân : {shipper.idCitizen}
															</span>
															<span className="font-light text-sm">
																Địa chỉ : {shipper.city.name} -{" "}
																{shipper.district.name} - {shipper.commune.name}
															</span>
														</div>
													</div>
												</div>
											</div>
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
							pageCount={dataShipper?.totalPage}
							handlePageClick={(event: any) => {
								setPageIndex(event.selected + 1);
							}}
						/>
					</div>
					<DialogFooter>
						<Button
							type="submit"
							onClick={() => {
								// handleChangeAddress(selectedValue as string);
								handleSelectShipper();
								closeOpen(false);
							}}
						>
							Xác nhận
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default OrderSelectShipper;
