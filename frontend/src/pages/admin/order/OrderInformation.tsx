import { formatCurrency } from "@/common/func";
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import OrderInforAddress from "./OrderInforAddress";

const OrderInformation = ({ data, getOrderById }: any) => {
	console.log(data.is_shipper);

	const arrayTotal = data?.orderItems?.map((product: any) => {
		return product.totalMoney;
	});

	const totalCost = arrayTotal?.reduce(
		(acc: number, value: number) => acc + value,
		0,
	);

	return (
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-3">
			<div className="col-span-1 lg:col-span-2 md:col-span-2 ">
				<div className="flex flex-col gap-5">
					<div className="p-4 border border-gray-200 rounded-md bg-main border-1 box-shadow">
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
												<h4 className="w-32 truncate">{pro.product.name}</h4>
											</div>
										</TableCell>
										<TableCell>{pro.variant}</TableCell>
										<TableCell>{pro.quantity}</TableCell>
										<TableCell>{formatCurrency(pro.price)}</TableCell>
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
					<div className="p-4 border border-gray-200 rounded-md bg-main border-1 box-shadow">
						<h3 className="pb-5 font-medium">Thông tin thanh toán</h3>
						<hr />
						<div className="flex flex-col gap-4">
							<div className="flex justify-between pt-4">
								<p className="text-sm font-medium text-gray-500">Thông tin</p>
								<p className="pr-3 text-sm font-medium text-gray-500">
									Giá tiền
								</p>
							</div>
							<hr />
							<div className="flex justify-between">
								<p className="text-sm font-medium text-black">Giá tiền</p>
								<p className="pr-3 text-sm font-normal text-black">
									{formatCurrency(totalCost)}
								</p>
							</div>
							<hr />
							<div className="flex justify-between">
								<p className="text-sm font-medium text-black">Phí vận chuyển</p>
								<p className="pr-3 text-sm font-normal text-black">
									{formatCurrency(data.shippingCost)}
								</p>
							</div>
							<hr />

							<div className="flex justify-between">
								<p className="text-sm font-medium text-black">Voucher</p>
								<p className="pr-3 text-sm font-normal text-black">
									- {formatCurrency(data.voucherAmount)}
								</p>
							</div>
							<hr />
							<div className="flex justify-between">
								<p className="text-sm font-medium text-black">Đã thanh toán</p>
								<p className="pr-3 text-sm font-normal text-black">
									- {formatCurrency(data.paymentAmount)}
								</p>
							</div>
							<hr />
							<div className="flex justify-between bg-main">
								<p className="text-sm font-medium text-black">
									Thanh toán khi nhận hàng
								</p>
								<p className="pr-3 text-sm font-medium text-red-500">
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
