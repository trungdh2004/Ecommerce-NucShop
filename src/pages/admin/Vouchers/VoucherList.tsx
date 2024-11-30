import React, { useEffect, useState } from "react";
import TableComponent from "@/components/common/TableComponent";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { parseISO, format } from "date-fns";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import DialogConfirm from "@/components/common/DialogConfirm";
import { SearchObjectType } from "@/types/searchObjecTypes";
import { typeResponse } from "@/types/typeReponse";

// Cập nhật services import
import {
	activeVoucherById,
	deActiveVoucherById,
	getPaginatedVouchers,
	updateVoucherById,
} from "@/service/voucher";
import { formatCurrency } from "@/common/func";
import { Link } from "react-router-dom";

interface IVoucher {
	code: string;
	createdAt: string;
	description: string;
	discountType: number;
	discountValue: number;
	endDate: string;
	minimumOrderValue: number;
	modifiedBy: string;
	modifiedDate: string;
	name: string;
	startDate: string;
	status: number;
	updatedAt: string;
	usageCount: number;
	usageLimit: number;
	user: string;
	_id: string;
}

const VoucherList = () => {
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [listRowSelected, setListRowSelected] = useState<IVoucher[]>([]);
	const [data, setData] = useState<IVoucher[]>([]);
	const [openActivateVoucher, setOpenActivateVoucher] = useState<string>("");
	const [openDeactivateVoucher, setOpenDeactivateVoucher] =
		useState<string>("");

	const [searchObject, setSearchObject] = useState<SearchObjectType>({
		pageIndex: 1,
		pageSize: 5,
		keyword: "",
		fieldSort: "",
		sort: 1,
		tab: 1,
	});

	const [response, setResponse] = useState<typeResponse>({
		pageCount: 0,
		totalElement: 0,
		totalOptionPage: 0,
	});

	const debounced = useDebounceCallback((inputValue: string) => {
		setSearchObject((prev) => ({
			...prev,
			pageIndex: 1,
			keyword: inputValue,
		}));
	}, 300);

	useEffect(() => {
		fetchVouchers();
	}, [searchObject]);

	const fetchVouchers = async () => {
		try {
			const { data } = await getPaginatedVouchers(searchObject);
			setData(data.content);
			setResponse({
				pageCount: data.totalPage,
				totalElement: data.totalAllOptions,
				totalOptionPage: data.totalOptionPage,
			});
		} catch (error) {
			console.error("Error fetching vouchers", error);
			toast.error("Không thể tải danh sách voucher");
		}
	};

	const handleActivateVoucher = async (id: string) => {
		try {
			setOpenActivateVoucher("");
			await activeVoucherById(id);
			await fetchVouchers();
			toast.success("Kích hoạt voucher thành công");
		} catch (error) {
			toast.error("Kích hoạt voucher thất bại");
		}
	};

	const handleDeactivateVoucher = async (id: string) => {
		try {
			setOpenDeactivateVoucher("");
			await deActiveVoucherById(id);
			await fetchVouchers();
			toast.success("Vô hiệu hóa voucher thành công");
		} catch (error) {
			toast.error("Vô hiệu hóa voucher thất bại");
		}
	};

	const handleChangePageSize = (value: number) => {
		setSearchObject((prev) => ({
			...prev,
			pageSize: value,
			pageIndex: 1,
		}));
	};

	const handleChangePage = (value: any) => {
		setSearchObject((prev) => ({
			...prev,
			pageIndex: value.selected + 1,
		}));
		setRowSelection({});
		setListRowSelected([]);
	};

	const columns: ColumnDef<IVoucher>[] = [
		{
			id: "select",
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && "indeterminate")
					}
					onCheckedChange={(value) => {
						table.toggleAllPageRowsSelected(!!value);
						setListRowSelected(value ? data : []);
					}}
					aria-label="Select all"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => {
						row.toggleSelected(!!value);
						setListRowSelected((prev) =>
							value
								? [...prev, row.original]
								: prev.filter((item) => item._id !== row.original._id),
						);
					}}
					aria-label="Select row"
				/>
			),
			size: 100,
		},
		{
			accessorKey: "code",
			header: () => <div className="text-xs md:text-base">Mã code</div>,
			cell: ({ row }) => (
				<div className="text-xs md:text-base">{row.original.code}</div>
			),
		},
		{
			accessorKey: "startDate",
			header: () => <div className="text-xs md:text-base">Ngày bắt đầu</div>,
			cell: ({ row }) => {
				const parsedDate = parseISO(row.original.startDate);
				const formattedDate = format(parsedDate, "dd/MM/yyyy");
				return (
					<div className="text-xs md:text-base">
						{formattedDate}
					</div>
				);
			},
		},
		{
			accessorKey: "endDate",
			header: () => <div className="text-xs md:text-base">Ngày kết thúc</div>,
			cell: ({ row }) => {
				const parsedDate = parseISO(row.original.endDate);
				const formattedDate = format(parsedDate, "dd/MM/yyyy");
				return (
					<div className="text-xs md:text-base">
						{formattedDate}
					</div>
				);
			},
		},
		{
			accessorKey: "discountType",
			header: () => <div className="text-xs md:text-base">Loại giảm giá</div>,
			cell: ({ row }) => {
				const formatterTypeDiscount =
					row.original.discountType === 1 ? "Số tiền" : "Số phần trăm";

				return (
					<div className="text-xs md:text-base">{formatterTypeDiscount}</div>
				);
			},
		},
		{
			accessorKey: "discountValue",
			header: () => (
				<div className="text-xs md:text-base">Giá trị giảm giá</div>
			),
			cell: ({ row }) => {
				const formattedValue =
					row.original.discountType === 1
						? formatCurrency(row.original.discountValue)
						: `${row.original.discountValue}%`;
				return <div className="text-xs md:text-base">{formattedValue}</div>;
			},
		},
		{
			accessorKey: "usageLimit",
			header: () => <div className="text-xs md:text-base">Giá hạn sử dụng</div>,
			cell: ({ row }) => (
				<div className="text-xs md:text-base">{row.original.usageLimit}</div>
			),
		},
		{
			accessorKey: "minimumOrderValue",
			header: () => <div className="text-xs md:text-base">Giá tối thiểu</div>,
			cell: ({ row }) => (
				<div className="text-xs text-red-500 md:text-base">
					{formatCurrency(row.original.minimumOrderValue)}
				</div>
			),
		},
		{
			accessorKey: "usageCount",
			header: () => <div className="text-xs md:text-base">Lượt sử dụng</div>,
			cell: ({ row }) => (
				<div className="text-xs md:text-base ">{row.original.usageCount}</div>
			),
		},
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => {
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="w-8 h-8 p-0">
								<span className="sr-only">Open menu</span>
								<HiOutlineDotsVertical className="w-4 h-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem className="bg-white text-[#7f7f7f] hover:bg-[#eeeeee] w-full text-start cursor-pointer">
								<Link to={`/admin/product/voucher/${row.original?._id}/edit`}>
									Sửa voucher
								</Link>
							</DropdownMenuItem>
							{row.original.status === 1 ? (
								<DropdownMenuItem
									className="text-center text-red-400"
									onClick={() => setOpenDeactivateVoucher(row.original._id)}
								>
									Vô hiệu hóa
								</DropdownMenuItem>
							) : (
								<DropdownMenuItem
									className="text-center text-green-400"
									onClick={() => setOpenActivateVoucher(row.original._id)}
								>
									Kích hoạt
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-col gap-3">
				<h4 className="text-base font-medium md:text-xl">Danh sách voucher</h4>
				<div className="flex justify-between">
					<Input
						placeholder="Tìm kiếm voucher"
						className="w-[40%] md:text-base text-xs"
						onChange={(event) => debounced(event.target.value)}
					/>
					<div className="flex items-center gap-4">
						<Link
							to={"/admin/product/voucher/add"}
							className="bg-white text-[#7f7f7f] hover:bg-[#eeeeee] w-full border px-5 py-1.5 rounded"
						>
							Thêm voucher
						</Link>
					</div>
				</div>
			</div>
			<Tabs value={`${searchObject.tab}`} className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger
						value="1"
						onClick={() => {
							setRowSelection({});
							setListRowSelected([]);
							setSearchObject((prev) => ({ ...prev, tab: 1, pageIndex: 1 }));
						}}
					>
						Voucher hoạt động
					</TabsTrigger>
					<TabsTrigger
						value="2"
						onClick={() => {
							setRowSelection({});
							setListRowSelected([]);
							setSearchObject((prev) => ({ ...prev, tab: 2, pageIndex: 1 }));
						}}
					>
						Voucher không hoạt động
					</TabsTrigger>
				</TabsList>
			</Tabs>
			<TableComponent
				data={data}
				columns={columns}
				rowSelection={rowSelection}
				setRowSelection={setRowSelection}
				handleChangePage={handleChangePage}
				pageIndex={searchObject.pageIndex}
				pageSize={searchObject.pageSize}
				pageCount={response.pageCount}
				totalElement={response.totalElement}
				handleChangePageSize={handleChangePageSize}
			/>
			{!!openActivateVoucher && (
				<DialogConfirm
					open={!!openActivateVoucher}
					title="Xác nhận kích hoạt voucher"
					handleClose={() => setOpenActivateVoucher("")}
					handleSubmit={() => handleActivateVoucher(openActivateVoucher)}
					content="Bạn có chắc muốn kích hoạt voucher này?"
					labelConfirm="Kích hoạt"
				/>
			)}
			{!!openDeactivateVoucher && (
				<DialogConfirm
					open={!!openDeactivateVoucher}
					title="Xác nhận vô hiệu hóa voucher"
					handleClose={() => setOpenDeactivateVoucher("")}
					handleSubmit={() => handleDeactivateVoucher(openDeactivateVoucher)}
					content="Bạn có chắc muốn vô hiệu hóa voucher này?"
					labelConfirm="Vô hiệu hóa"
				/>
			)}
		</div>
	);
};

export default VoucherList;
