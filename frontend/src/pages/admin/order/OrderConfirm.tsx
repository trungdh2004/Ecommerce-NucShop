import { formatCurrency } from "@/common/func";
import TableComponent from "@/components/common/TableComponent";
import { pagingOrderAdmin } from "@/service/order";
import { SearchObjectOrder } from "@/types/searchObjectOrder";
import { typeResponse } from "@/types/typeReponse";
import { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { IoEyeSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import SearchOrder from "./SearchOrder";

const OrderConfirm = () => {
	interface IOrder {
		_id: string;
		code: string;
		createdAt: string;
		totalMoney: number;
		user: {
			full_name: string;
		};
		paymentMethod: number;
		orderItems: any;
		orderDate: string;
	}

	const [orderNeed, setOrderNeed] = useState<any>({});
	const [searchObjectOrder, setSearchObjectOrder] = useState<SearchObjectOrder>(
		{
			status: 2,
			pageIndex: 1,
			pageSize: 5,
			sort: -1,
			method: null,
			startDate: null,
			endDate: null,
			paymentStatus: null,
			is_shipper: null,
		},
	);
	useEffect(() => {
		handleOrderNeed();
	}, [searchObjectOrder]);
	const [response, setResponse] = useState<typeResponse>({
		pageCount: 0,
		totalElement: 0, //tổng số phần tử
		totalOptionPage: 0, //tổng số phần tử trong 1 trang
	});
	const handleOrderNeed = async () => {
		try {
			const { data } = await pagingOrderAdmin(searchObjectOrder);
			setOrderNeed(data.data.content);
			setResponse({
				pageCount: data.data.totalPage,
				totalElement: data.data.totalAllOptions,
				totalOptionPage: data.data.totalOptionPage,
			});
			return data.data;
		} catch (error) {
			console.log(error);
		}
	};
	const handleChangePageSize = (value: number) => {
		setSearchObjectOrder((prev) => ({
			...prev,
			pageSize: value,
		}));
	};
	const handleChangePage = (value: any) => {
		console.log("value change page", value);
		setSearchObjectOrder((prev) => ({
			...prev,
			pageIndex: value.selected + 1,
		}));
	};
	const columns: ColumnDef<IOrder>[] = [
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => {
				return (
					<div>
						<Link to={`/admin/order/${row.original._id}`}>
							<IoEyeSharp className="text-blue-400 cursor-pointer" size={25} />
						</Link>
					</div>
				);
			},
		},

		{
			accessorKey: "code",
			header: "Mã đơn hàng",
			cell: ({ row }) => {
				return <div className="font-medium">{row?.original?.code}</div>;
			},
		},
		{
			accessorKey: "user",
			header: "Người đặt hàng",
			cell: ({ row }) => {
				return (
					<div className="font-medium">{row?.original?.user?.full_name}</div>
				);
			},
		},
		{
			accessorKey: "payment",
			header: "Thanh toán",
			cell: ({ row }) => {
				return (
					<div className="font-medium">
						{row?.original?.paymentMethod === 1
							? "Thanh toán khi nhận"
							: "Thanh toán Banking"}
					</div>
				);
			},
		},
		{
			accessorKey: "OrderItems",
			header: "Số sản phẩm",
			cell: ({ row }) => {
				return (
					<div className="font-medium text-center">
						{row.original.orderItems.length}
					</div>
				);
			},
		},
		{
			accessorKey: "totalMoney",
			header: "Tổng tiền",
			cell: ({ row }) => {
				return (
					<div className="font-medium text-red-500">
						{formatCurrency(row.original.totalMoney)}
					</div>
				);
			},
		},
		{
			accessorKey: "orderDate",
			header: "Ngày đặt hàng",
			cell: ({ row }) => {
				const parsedDate = parseISO(row.original.orderDate);
				const formattedDate = format(parsedDate, "dd/MM/yyyy");
				return <div className="font-medium">{formattedDate}</div>;
			},
		},
	];

	return (
		<div>
			<div className="flex flex-col gap-3">
				<div className="flex flex-col gap-3">
					<h4 className="text-xl font-medium">
						Danh sách đơn hàng đã xác nhận
					</h4>
					<SearchOrder
						searchObjectOrder={searchObjectOrder}
						setSearchObjectOrder={setSearchObjectOrder}
					/>
				</div>
				<TableComponent
					data={orderNeed}
					columns={columns}
					// selected
					// rowSelection={rowSelection}
					// setRowSelection={setRowSelection}
					// phân trang
					handleChangePage={handleChangePage}
					pageIndex={searchObjectOrder.pageIndex as number}
					pageSize={searchObjectOrder.pageSize as number}
					pageCount={response.pageCount}
					totalElement={response.totalElement}
					handleChangePageSize={handleChangePageSize}
				/>
			</div>
		</div>
	);
};

export default OrderConfirm;
