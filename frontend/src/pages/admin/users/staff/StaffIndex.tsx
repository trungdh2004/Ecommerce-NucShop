import DialogConfirm from "@/components/common/DialogConfirm";
import TableComponent from "@/components/common/TableComponent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/auth";
import { Decentralization, pagingStaff } from "@/service/user-admin";
import { SearchObjectType } from "@/types/searchObjecTypes";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { toast } from "sonner";
import { useDebounceCallback } from "usehooks-ts";
interface IData {
	_id: string;
	full_name: string;
	email: string;
	provider: string | null;
	avatarUrl: string;
	is_admin: boolean;
	blocked_at: boolean;
	createdAt: string;
}
const StaffIndex = () => {
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [searchObject, setSearchObject] = useState<SearchObjectType>({
		pageIndex: 1,
		pageSize: 5,
		keyword: "",
	});
	const [data, setData] = useState<IData[]>([]);
	const [response, setResponse] = useState({
		pageIndex: 1,
		pageSize: 5,
		pageCount: 0,
		totalElement: 0,
		totalOptionPage: 0,
	});
	const [open, setOpen] = useState<string | boolean>(false);
	const { authUser } = useAuth();
	useEffect(() => {
		handlePagingUser();
	}, [searchObject]);
	const debounced = useDebounceCallback((inputValue: string) => {
		setSearchObject((prev) => ({
			...prev,
			pageIndex: 1,
			keyword: inputValue,
		}));
	}, 300);
	const handlePagingUser = async () => {
		try {
			const { data } = await pagingStaff(searchObject);
			setData(data.content);
			setResponse({
				pageIndex: data.pageIndex,
				pageSize: data.pageSize,
				pageCount: data.totalPage,
				totalElement: data.totalAllOptions,
				totalOptionPage: data.totalOptionPage,
			});
		} catch (error) {
			toast.error("Không lấy được data người dùng");
		}
	};
	const handleUpdate = async (id: string) => {
		try {
			const { data } = await Decentralization(id as string, 1);
			toast.success("Cập nhật thành công");
			handlePagingUser();
			setOpen(false);
			return data;
		} catch (error) {
			console.log(error);
			toast.success("Cập nhật thật bại ");
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
	};
	const columns: ColumnDef<IData>[] = [
		{
			id: "full_name",
			accessorKey: "full_name",
			header: () => {
				return <div className="text-xs md:text-base">Tên</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="text-xs md:text-base">{row?.original?.full_name}</div>
				);
			},
		},
		{
			id: "email",
			accessorKey: "email",
			header: () => {
				return <div className="text-xs md:text-base">Email</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="text-xs md:text-base">{row?.original?.email}</div>
				);
			},
		},
		{
			id: "avatarUrl",
			accessorKey: "avatarUrl",
			header: () => {
				return <div className="text-xs md:text-base">Ảnh</div>;
			},
			cell: ({ row }) => {
				return (
					<img
						src={row.original.avatarUrl || "/avatar_25.jpg"}
						className="md:w-[40px] md:h-[40px] w-[30px] h-[30px] rounded-full"
					/>
				);
			},
		},
		{
			id: "provider",
			accessorKey: "provider",
			header: () => {
				return <div className="text-xs md:text-base">Phương thức</div>;
			},
			cell: ({ row }) => {
				const value = `${row.getValue("provider") === "google.com" ? "Google" : "Đăng ký"}`;
				return <div className="text-xs font-medium md:text-base">{value}</div>;
			},
		},
		{
			id: "createdAt",
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
			id: "status",
			accessorKey: "status",
			header: () => {
				return <div className="text-xs md:text-base">Trạng thái</div>;
			},
			cell: ({ row }) => {
				const status = row.original.blocked_at ? "Bị cấm" : "Hoạt động";
				return (
					<Badge
						className={`font-medium ${row.original.blocked_at ? "bg-[#cf4040]" : "bg-green-500"} text-center items-center text-xs text-nowrap leading-[14px]`}
					>
						{status}
					</Badge>
				);
			},
		},
		{
			id: "actions",
			accessorKey: "Chức năng",
			enableHiding: false,
			cell: ({ row }) => {
				return (
					<div>
						{authUser?.is_admin && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" className="w-8 h-8 p-0">
										<span className="sr-only">Open menu</span>
										<HiOutlineDotsVertical className="w-4 h-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									{!row?.original?.is_admin && (
										<DropdownMenuItem
											onClick={() => setOpen(row?.original?._id)}
											className="cursor-pointer"
										>
											Chuyển sang khách
										</DropdownMenuItem>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>
				);
			},
		},
	];
	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-col gap-3">
				<h4 className="text-base font-medium md:text-xl">
					Danh sách người dùng
				</h4>
				<div className="flex justify-between">
					<Input
						placeholder="Tìm kiếm người dùng"
						className="w-[40%] md:text-base text-xs"
						onChange={(event) => debounced(event.target.value)}
					/>
				</div>
			</div>
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
			{!!open && (
				<DialogConfirm
					open={!!open}
					handleClose={() => setOpen(false)}
					content="Bạn muốn thay đổi quyền người này"
					handleSubmit={() => handleUpdate(open as string)}
					labelConfirm="Xác nhận"
				/>
			)}
		</div>
	);
};

export default StaffIndex;
