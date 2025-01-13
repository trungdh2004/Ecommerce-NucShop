import { useEffect, useState } from "react";

import TableComponent from "@/components/common/TableComponent";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { pagingOrderShipperById } from "@/service/shipper";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { TbBasketCancel, TbClipboardPlus } from "react-icons/tb";
import { FaTruckFast } from "react-icons/fa6";
import { LiaMapMarkedAltSolid } from "react-icons/lia";
import { IShipperListOrder } from "@/types/shipper.interface";
import { AxiosError } from "axios";
import { formatCurrency } from "@/common/func";
import { Link } from "react-router-dom";
import { IoEyeSharp } from "react-icons/io5";
interface ISearchObjectOderShipper {
	pageIndex: number;
	status: number;
}
type Props = {
	id: string;
};
const ListOrder = ({ id }: Props) => {
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({}); // xử lí selected
	const [response, setResponse] = useState({
		pageIndex: 1,
		pageSize: 5,
		pageCount: 0,
		totalElement: 0,
		totalOptionPage: 0,
	});
	const [searchObject, setSearchObject] = useState<ISearchObjectOderShipper>({
		pageIndex: 1,
		status: 2,
	});
	const [data, setData] = useState<IShipperListOrder[]>([]);
	useEffect(() => {
		handlePagingOder();
	}, [searchObject]);

	const handlePagingOder = async () => {
		try {
			const { data } = await pagingOrderShipperById(id, searchObject);
			setData(data.content);
			setResponse({
				pageIndex: data.pageIndex,
				pageSize: data.pageSize,
				pageCount: data.totalPage,
				totalElement: data.totalAllOptions,
				totalOptionPage: data.totalOptionPage,
			});
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error?.response?.data?.message);
			}
		}
	};
	const handleChangePageSize = (value: number) => {
		setSearchObject((prev) => ({
			...prev,
			pageSize: value,
			pageIndex: 1,
		}));
	};

	const columns: ColumnDef<IShipperListOrder>[] = [
		{
			accessorKey: "code",
			header: () => {
				return <div className="text-xs md:text-base">Mã</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="text-xs md:text-base">{row?.original?.code}</div>
				);
			},
		},
		{
			accessorKey: "address.username",
			header: () => {
				return <div className="text-xs md:text-base">Tên người nhận</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="text-xs md:text-base">
						{row?.original?.address.username}
					</div>
				);
			},
		},
		{
			accessorKey: "address.phone",
			header: () => {
				return <div className="text-xs md:text-base">Số điện thoại</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="text-xs md:text-base">
						{row?.original?.address.phone}
					</div>
				);
			},
		},
		{
			accessorKey: "address.address",
			header: () => {
				return <div className="text-xs md:text-base">Địa chỉ</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="text-xs md:text-base">
						{row?.original?.address.address}
					</div>
				);
			},
		},
		{
			accessorKey: "address.detailAddress",
			header: () => {
				return <div className="text-xs md:text-base">Địa chỉ cụ thể</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="text-xs md:text-base">
						{row?.original?.address.detailAddress}
					</div>
				);
			},
		},
		{
			accessorKey: "totalMoney",
			header: () => {
				return <div className="text-xs md:text-base">Tổng tiền đơn hàng</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="text-xs text-red-500 md:text-base">
						{formatCurrency(row?.original?.totalMoney)}
					</div>
				);
			},
		},
		{
			accessorKey: "createdAt",
			header: () => {
				return <div className="text-xs md:text-base">Ngày tạo</div>;
			},
			cell: ({ row }) => {
				const parsedDate = parseISO(row.original.createdAt);
				const formattedDate = format(parsedDate, "dd/MM/yyyy");
				return <div className="text-xs md:text-base">{formattedDate}</div>;
			},
		},
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
	];

	const handleChangePage = (value: any) => {
		setSearchObject((prev) => ({
			...prev,
			pageIndex: value.selected + 1,
		}));
		setRowSelection({});
	};

	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-col gap-3">
				<h4 className="text-base font-medium md:text-xl">
					Danh sách đơn hàng giao
				</h4>
			</div>
			<Tabs value={`${searchObject.status}`} className="w-full">
				<TabsList className="grid w-full grid-cols-4 ">
					<TabsTrigger
						value="2"
						onClick={() => {
							setRowSelection({});
							setSearchObject((prev) => ({ ...prev, status: 2, pageIndex: 1 }));
						}}
					>
						<div className="flex items-center gap-x-1">
							<TbClipboardPlus size={18} className="text-blue-300" />
							<p className="hidden md:block">Đơn hàng mới</p>
						</div>
					</TabsTrigger>
					<TabsTrigger
						value="3"
						onClick={() => {
							setRowSelection({});
							setSearchObject((prev) => ({ ...prev, status: 3, pageIndex: 1 }));
						}}
					>
						<div className="flex items-center gap-x-1">
							<FaTruckFast size={18} className="text-blue-500" />
							<p className="hidden md:block">Đơn hàng đang giao</p>
						</div>
					</TabsTrigger>
					<TabsTrigger
						value="4"
						onClick={() => {
							setRowSelection({});
							setSearchObject((prev) => ({ ...prev, status: 4, pageIndex: 1 }));
						}}
					>
						<div className="flex items-center gap-x-1">
							<LiaMapMarkedAltSolid size={18} className="text-green-500" />
							<p className="hidden md:block">Đơn hàng giao thành công</p>
						</div>
					</TabsTrigger>
					<TabsTrigger
						value="6"
						onClick={() => {
							setRowSelection({});
							setSearchObject((prev) => ({ ...prev, status: 6, pageIndex: 1 }));
						}}
					>
						<div className="flex items-center gap-x-1">
							<TbBasketCancel size={18} className="text-red-500" />
							<p className="hidden md:block">Đơn hàng giao thất bại</p>
						</div>
					</TabsTrigger>
				</TabsList>
			</Tabs>
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

export default ListOrder;
