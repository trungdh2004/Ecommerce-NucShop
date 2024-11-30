import React from "react";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/common/func";
import OrderInforAddress from "./OrderInforAddress";

const OrderInformation = ({ data, getOrderById }: any) => {
	const arrayTotal = data?.orderItems?.map((product: any) => {
		return product.totalMoney;
	});

	const totalCost = arrayTotal?.reduce(
		(acc: number, value: number) => acc + value,
		0,
	);

	return (
		<div className="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-4">
			<div className="lg:col-span-2 md:col-span-2 col-span-1 ">
				<div className="flex flex-col gap-5">
					<div className="bg-main rounded-md border border-1 border-gray-100 box-shadow p-4">
						<h3 className="font-medium">Sản phẩm đơn hàng</h3>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="">Sản phẩm</TableHead>
									<TableHead className=""></TableHead>
									<TableHead>Phân loại</TableHead>
									<TableHead>Số lượng</TableHead>
									<TableHead>Giá</TableHead>
									<TableHead className="text-right">Thành tiền</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data?.orderItems?.map((pro: any) => (
									<TableRow key={pro._id}>
										<TableCell className="font-medium" colSpan={2}>
											<div className="flex items-center gap-3">
												<img
													src={pro.product.thumbnail}
													alt=""
													className="w-12 h-12"
												/>
												<h4 className="w-32 truncate">
													{pro.product.name}
												</h4>
											</div>
										</TableCell>
										<TableCell >
											{pro.variant}
										</TableCell>
										<TableCell >
											{pro.quantity}
										</TableCell>
										<TableCell >{formatCurrency(pro.price)}</TableCell>
										<TableCell className="text-right">
											{formatCurrency(pro.totalMoney)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
							<TableFooter>
								<TableRow>
									<TableCell colSpan={5}>Tổng tiền</TableCell>
									<TableCell className="text-right text-red-500">
										{formatCurrency(totalCost)}
									</TableCell>
								</TableRow>
							</TableFooter>
						</Table>
					</div>
					<div className="bg-main rounded-md border border-1 border-gray-100 box-shadow p-4">
						<h3 className="pb-5 font-medium">Thông tin thanh toán</h3>
						<hr />
						<div className="flex flex-col gap-4">
							<div className="flex justify-between pt-4">
								<p className="font-medium text-sm text-gray-500">Thông tin</p>
								<p className="font-medium text-sm text-gray-500 pr-3">
									Giá tiền
								</p>
							</div>
							<hr />
							<div className="flex justify-between">
								<p className="font-medium text-sm text-black">Giá tiền</p>
								<p className="font-normal text-sm text-black pr-3">
									{formatCurrency(totalCost)}
								</p>
							</div>
							<hr />
							<div className="flex justify-between">
								<p className="font-medium text-sm text-black">Phí vận chuyển</p>
								<p className="font-normal text-sm text-black pr-3">
									{formatCurrency(data.shippingCost)}
								</p>
							</div>
							<hr />
							<div className="flex justify-between">
								<p className="font-medium text-sm text-black">Voucher</p>
								<p className="font-normal text-sm text-black pr-3">
									- {formatCurrency(data.voucherAmount)}
								</p>
							</div>
							<hr />
							<div className="flex justify-between bg-main">
								<p className="font-medium text-sm text-black">
									Tổng thanh toán
								</p>
								<p className="font-medium text-sm text-red-500 pr-3">
									{formatCurrency(data.amountToPay)}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<OrderInforAddress data={data} getOrderById={getOrderById} />
		</div>
	);
};

export default OrderInformation;
