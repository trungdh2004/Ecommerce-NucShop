import { pagingCustomer } from "@/service/customer";
import { ICustomer } from "@/types/customer";
import { typeResponse } from "@/types/typeReponse";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import TableComponent from "@/components/common/TableComponent";
import { useDebounceCallback } from "usehooks-ts";
import { parseISO, format } from "date-fns";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/common/func";

interface User {
	_id: string;
	avatarUrl: string;
	email: string;
	full_name: string;
}
interface IData {
	_id: string;
	user: User;
	totalMoney: number;
	totalOrder: number;
	totalOrderCancel: number;
	totalOrderSuccess: number;
	totalProductSuccess: number;
	blocked_at: boolean;
	createdAt: string;
	rank: number;
}
const CustomerList = () => {
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({}); // xử lí selected
	const [listRowSeleted, setListRowSelected] = useState<IData[]>([]);
	const [data, setData] = useState([]);
	const [searchObject, setSearchObject] = useState<ICustomer>({
		sort: -1,
		pageIndex: 1,
		pageSize: 5,
	});
	const [response, setResponse] = useState({
		pageIndex: 1,
		pageSize: 5,
		pageCount: 0,
		totalElement: 0,
		totalOptionPage: 0,
	});

	useEffect(() => {
		handleCustomer();
	}, [searchObject]);
	const handleChangePage = (value: any) => {
		setSearchObject((prev) => ({
			...prev,
			pageIndex: value.selected + 1,
		}));
		setRowSelection({});
		setListRowSelected([]);
	};
	const handleChangePageSize = (value: number) => {
		setSearchObject((prev) => ({
			...prev,
			pageSize: value,
			pageIndex: 1,
		}));
	};
	const handleCustomer = async () => {
		try {
			const { data } = await pagingCustomer(searchObject);
			setData(data.content);
			setResponse({
				pageIndex: data.pageIndex,
				pageSize: data.pageSize,
				pageCount: data.totalPage,
				totalElement: data.totalAllOptions,
				totalOptionPage: data.totalOptionPage,
			});
		} catch (error) {
			console.error("Error fetching data", error);
		}
	};
	const columns: ColumnDef<IData>[] = [
		{
			accessorKey: "full_name",
			header: () => {
				return <div className="md:text-base text-xs">Tên</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="md:text-base text-xs">
						{row?.original?.user?.full_name}
					</div>
				);
			},
		},
		{
			accessorKey: "avatarUrl",
			header: () => {
				return <div className="md:text-base text-xs">Ảnh</div>;
			},
			cell: ({ row }) => {
				return (
					<img
						src={row.original?.user?.avatarUrl || "/avatar_25.jpg"}
						className="md:w-[40px] md:h-[40px] w-[30px] h-[30px] rounded-full"
					/>
				);
			},
		},
		{
			accessorKey: "totalOrder",
			header: () => {
				return <div className="md:text-base text-xs">Số đơn hàng</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="md:text-base text-xs text-center">
						{row?.original?.totalOrder}
					</div>
				);
			},
		},
		{
			accessorKey: "totalOrderCancel",
			header: () => {
				return <div className="md:text-base text-xs">Số đơn hủy hàng</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="md:text-base text-xs text-center">
						{row?.original?.totalOrderCancel}
					</div>
				);
			},
		},
		{
			accessorKey: "totalOrderSuccess",
			header: () => {
				return (
					<div className="md:text-base text-xs">Số đơn hàng thành công</div>
				);
			},
			cell: ({ row }) => {
				return (
					<div className="md:text-base text-xs text-center">
						{row?.original?.totalOrderSuccess}
					</div>
				);
			},
		},
		{
			accessorKey: "totalOrder",
			header: () => {
				return <div className="md:text-base text-xs">Số tiền hàng</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="md:text-base text-xs text-center">
						{formatCurrency(row?.original?.totalMoney)}
					</div>
				);
			},
		},
		{
			accessorKey: "totalOrder",
			header: () => {
				return <div className="md:text-base text-xs">Xếp hạng</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="md:text-base text-xs text-center">
						{row?.original?.rank}
					</div>
				);
			},
		},
		// {
		// 	id: "actions",
		// 	enableHiding: false,
		// 	cell: ({ row }) => {
		// 		return (
		// 			<DropdownMenu>
		// 				<DropdownMenuTrigger asChild>
		// 					<Button variant="ghost" className="h-8 w-8 p-0">
		// 						<span className="sr-only">Open menu</span>
		// 						<HiOutlineDotsVertical className="h-4 w-4" />
		// 					</Button>
		// 				</DropdownMenuTrigger>
		// 				<DropdownMenuContent align="end">
		// 					<DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
		// 					{row?.original?.blocked_at ? (
		// 						<DropdownMenuItem
		// 							className="text-green-400"
		// 							onClick={() => setopenUnbanId(row?.original?._id)}
		// 						>
		// 							Mở
		// 						</DropdownMenuItem>
		// 					) : (
		// 						<DropdownMenuItem
		// 							className="text-red-400"
		// 							onClick={() => setopenBanId(row?.original?._id)}
		// 						>
		// 							Cấm
		// 						</DropdownMenuItem>
		// 					)}
		// 				</DropdownMenuContent>
		// 			</DropdownMenu>
		// 		);
		// 	},
		// },
	];
	return (
		<div>
			<h4 className="font-medium md:text-xl text-base py-4">
				Danh sách khách hàng
			</h4>
			<TableComponent
				data={data}
				columns={columns}
				// selected
				rowSelection={rowSelection}
				setRowSelection={setRowSelection}
				// phân trang
				handleChangePage={handleChangePage}
				pageIndex={response.pageIndex}
				pageSize={response.pageSize}
				pageCount={response.pageCount}
				totalElement={response.totalElement}
				handleChangePageSize={handleChangePageSize}
			/>
		</div>
	);
};

export default CustomerList;
