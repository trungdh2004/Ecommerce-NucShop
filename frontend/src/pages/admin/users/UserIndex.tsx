import { useEffect, useState } from "react";

import DialogConfirm from "@/components/common/DialogConfirm";
import TableComponent from "@/components/common/TableComponent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	BanManyUser,
	banUser,
	pagingUser,
	unBanManyUser,
	unBanUser,
} from "@/service/user-admin";
import { SearchObjectType } from "@/types/searchObjecTypes";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoFilter } from "react-icons/io5";
import { toast } from "sonner";
import { useDebounceCallback } from "usehooks-ts";
import DiaLogDecentralization from "./DiaLogDecentralization";
import { useAuth } from "@/hooks/auth";
interface IData {
	_id: string;
	full_name: string;
	email: string;
	provider: string | null;
	avatarUrl: string;
	is_admin: boolean;
	is_staff: boolean;
	blocked_at: boolean;
	createdAt: string;
	quyen: any;
	status: any;
}

const UserIndex = () => {
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({}); // xử lí selected
	const [listRowSeleted, setListRowSelected] = useState<IData[]>([]);
	const listIdUser: any = listRowSeleted.map((user) => {
		return user._id;
	});
	const [openBanId, setopenBanId] = useState<string | null>(null);
	const [openUnbanId, setopenUnbanId] = useState<string | null>(null);
	const [openBanManyId, setopenBanManyId] = useState<string | boolean | null>(
		null,
	);
	const [openUnbanManyId, setopenUnbanManyId] = useState<
		string | boolean | null
	>(null);
	const [openIdUpdated, setopenIdUpdated] = useState<string | boolean>(false);
	const debounced = useDebounceCallback((inputValue: string) => {
		setSearchObject((prev) => ({
			...prev,
			pageIndex: 1,
			keyword: inputValue,
		}));
	}, 300);
	const [isStaff, setisStaff] = useState<null | boolean>(null);
	const [response, setResponse] = useState({
		pageIndex: 1,
		pageSize: 5,
		pageCount: 0,
		totalElement: 0,
		totalOptionPage: 0,
	});
	const [searchObject, setSearchObject] = useState<SearchObjectType>({
		pageIndex: 1,
		pageSize: 5,
		keyword: "",
		sort: 1,
		fieldSort: "",
		tab: 1,
		provider: "",
	});
	const [data, setData] = useState<IData[]>([]);
	const { authUser } = useAuth();
	useEffect(() => {
		handlePagingUser();
	}, [searchObject]);

	const handlePagingUser = async () => {
		try {
			const { data } = await pagingUser(searchObject);
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

	const handleBlock = async (id: string) => {
		try {
			await banUser(id);
			setopenBanId(null);
			handlePagingUser();
			toast.success("Đã cấm người dùng thành công");
		} catch (error) {
			toast.error("Cấm người dùng thất bại");
		}
	};

	const handleUnBlock = async (id: string) => {
		try {
			await unBanUser(id);
			setopenUnbanId(null);
			handlePagingUser();
			toast.success("Bỏ cấm người dùng thành công");
		} catch (error) {
			toast.error("Bỏ Cấm người dùng thất bại");
		}
	};

	const handleBanMany = async (id: string) => {
		try {
			await BanManyUser(id);
			setopenBanManyId(null);
			handlePagingUser();
			setListRowSelected([]);
			setRowSelection({});
			toast.success("Cấm mục người dùng thành công");
		} catch (error) {
			toast.error("Cấm mục người dùng thất bại");
		}
	};

	const handleUnBanMany = async (id: string) => {
		try {
			await unBanManyUser(id);
			setopenUnbanManyId(null);
			setListRowSelected([]);
			setRowSelection({});
			handlePagingUser();
			toast.success("Bỏ cấm mục người dùng thành công");
		} catch (error) {
			toast.error("Bỏ Cấm mục người dùng thất bại");
		}
	};
	const handleChangePageSize = (value: number) => {
		setSearchObject((prev) => ({
			...prev,
			pageSize: value,
			pageIndex: 1,
		}));
	};

	const columns: ColumnDef<IData>[] = [
		// {
		// 	id: "select",
		// 	accessorKey: "select",
		// 	header: ({ table }) => (
		// 		<Checkbox
		// 			checked={
		// 				table.getIsAllPageRowsSelected() ||
		// 				(table.getIsSomePageRowsSelected() && "indeterminate")
		// 			}
		// 			onCheckedChange={(value) => {
		// 				table.toggleAllPageRowsSelected(!!value);
		// 				if (value) setListRowSelected(data);
		// 				if (!value) setListRowSelected([]);
		// 			}}
		// 			aria-label="Select all"
		// 		/>
		// 	),
		// 	cell: ({ row }) => (
		// 		<Checkbox
		// 			checked={row.getIsSelected()}
		// 			onCheckedChange={(value) => {
		// 				row.toggleSelected(!!value);
		// 				if (value) setListRowSelected((prev) => [...prev, row.original]);
		// 				if (!value)
		// 					setListRowSelected((prev) => {
		// 						return prev.filter((item) => item._id !== row.original._id);
		// 					});
		// 			}}
		// 			aria-label="Select row"
		// 		/>
		// 	),
		// 	size: 100,
		// },
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
			id: "quyen",
			accessorKey: "quyen",
			header: () => {
				return <div className="text-xs md:text-base">Quyền</div>;
			},
			cell: ({ row }) => {
				let quyen;
				if (row.original.is_admin) {
					quyen = "Admin";
				} else if (row.original.is_staff) {
					quyen = "Nhân viên";
				} else {
					quyen = "Khách";
				}
				return <div className="text-xs md:text-base">{quyen}</div>;
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
			accessorKey: "Hoạt động",
			enableHiding: false,
			cell: ({ row }) => {
				return (
					<div>
						{authUser?.is_admin && !row?.original?.is_admin && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" className="w-8 h-8 p-0">
										<span className="sr-only">Open menu</span>
										<HiOutlineDotsVertical className="w-4 h-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									{/* <DropdownMenuItem
										onClick={() => {
											setopenIdUpdated(row?.original?._id);
											setisStaff(row?.original?.is_staff);
										}}
										className="cursor-pointer"
									>
										Phân quyền
									</DropdownMenuItem> */}
									{row?.original?.blocked_at ? (
										<DropdownMenuItem
											className="text-green-400 cursor-pointer"
											onClick={() => setopenUnbanId(row?.original?._id)}
										>
											Mở
										</DropdownMenuItem>
									) : (
										<DropdownMenuItem
											className="text-red-400 cursor-pointer"
											onClick={() => setopenBanId(row?.original?._id)}
										>
											Cấm
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

	const handleChangePage = (value: any) => {
		setSearchObject((prev) => ({
			...prev,
			pageIndex: value.selected + 1,
		}));
		setRowSelection({});
		setListRowSelected([]);
	};

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
					<div className="flex items-center justify-center gap-3">
						{listIdUser.length !== 0 && searchObject.tab == 1 ? (
							<Button
								onClick={() => {
									setopenBanManyId(true);
								}}
								className="bg-white text-[#7f7f7f] hover:bg-[#eeeeee] w-full border"
							>
								Ẩn nhiều
							</Button>
						) : (
							""
						)}
						{listIdUser.length !== 0 && searchObject.tab == 2 && (
							<Button
								onClick={() => {
									setopenUnbanManyId(true);
								}}
								className="bg-white text-[#7f7f7f] hover:bg-[#eeeeee] w-full border"
							>
								Bỏ Ẩn nhiều
							</Button>
						)}
						<div className="pr-5">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<div className="cursor-pointer">
										<IoFilter size={20} />
									</div>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-[150px]" align="end">
									<DropdownMenuLabel>Sắp xếp theo</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuRadioGroup
										className="cursor-pointer"
										value={`${searchObject.fieldSort}`}
										onValueChange={(e) => {
											setSearchObject((prev) => ({
												...prev,
												pageIndex: 1,
												fieldSort: e,
											}));
										}}
									>
										<DropdownMenuRadioItem
											value="email"
											className="cursor-pointer"
										>
											Email
										</DropdownMenuRadioItem>
										<DropdownMenuRadioItem
											value="full_name"
											className="cursor-pointer"
										>
											Tên
										</DropdownMenuRadioItem>
										<DropdownMenuRadioItem
											value="createdAt"
											className="cursor-pointer"
										>
											Ngày tạo
										</DropdownMenuRadioItem>
									</DropdownMenuRadioGroup>
									<DropdownMenuSeparator />
									<DropdownMenuLabel>Sắp xếp theo chiều</DropdownMenuLabel>
									<DropdownMenuRadioGroup
										value={`${searchObject.sort}`}
										onValueChange={(e) => {
											const sortNumber = parseInt(e) as 1 | -1;
											console.log(sortNumber);

											setSearchObject((prev) => ({
												...prev,
												pageIndex: 1,
												sort: sortNumber,
											}));
										}}
									>
										<DropdownMenuRadioItem value="1" className="cursor-pointer">
											Tăng dần
										</DropdownMenuRadioItem>
										<DropdownMenuRadioItem
											value="-1"
											className="cursor-pointer"
										>
											Giảm dần
										</DropdownMenuRadioItem>
									</DropdownMenuRadioGroup>
									<DropdownMenuSeparator />
									<DropdownMenuLabel>Sắp xếp theo Login</DropdownMenuLabel>
									<DropdownMenuRadioGroup
										value={searchObject.provider}
										onValueChange={(e) => {
											setSearchObject((prev) => ({
												...prev,
												pageIndex: 1,
												provider: e,
											}));
										}}
									>
										<DropdownMenuRadioItem
											value="google.com"
											className="cursor-pointer"
										>
											Google
										</DropdownMenuRadioItem>
										<DropdownMenuRadioItem
											value="credential"
											className="cursor-pointer"
										>
											Đăng ký
										</DropdownMenuRadioItem>
									</DropdownMenuRadioGroup>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() =>
											setSearchObject({
												pageIndex: 1,
												pageSize: 5,
												keyword: "",
												sort: 1,
												fieldSort: "",
												tab: 1,
												provider: "",
											})
										}
										className="cursor-pointer bg-[#f0f0f0] text-red-500 pl-8"
									>
										Mặc định
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
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
						Người dùng
					</TabsTrigger>
					<TabsTrigger
						value="2"
						onClick={() => {
							setRowSelection({});
							setListRowSelected([]);
							setSearchObject((prev) => ({ ...prev, tab: 2, pageIndex: 1 }));
						}}
					>
						Người dùng bị cấm
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
			{!!openBanId && (
				<DialogConfirm
					open={!!openBanId}
					handleClose={() => setopenBanId(null)}
					content="Cấm người dùng"
					handleSubmit={() => handleBlock(openBanId)}
					labelConfirm="Cấm"
				/>
			)}
			{!!openUnbanId && (
				<DialogConfirm
					open={!!openUnbanId}
					handleClose={() => setopenUnbanId(null)}
					content="Bỏ cấm người dùng"
					handleSubmit={() => handleUnBlock(openUnbanId)}
					labelConfirm="Bỏ cấm"
				/>
			)}
			{!!openBanManyId && (
				<DialogConfirm
					open={!!openBanManyId}
					handleClose={() => setopenBanManyId(null)}
					content="Cấm mục người dùng"
					handleSubmit={() => handleBanMany(listIdUser)}
					labelConfirm="Cấm"
				/>
			)}
			{!!openUnbanManyId && (
				<DialogConfirm
					open={!!openUnbanManyId}
					handleClose={() => setopenUnbanManyId(null)}
					content="Bỏ cấm mục người dùng"
					handleSubmit={() => handleUnBanMany(listIdUser)}
					labelConfirm="Bỏ cấm"
				/>
			)}
			{!!openIdUpdated && (
				<DiaLogDecentralization
					open={openIdUpdated}
					close={() => setopenIdUpdated(false)}
					isStaff={isStaff}
					handlePagingUser={handlePagingUser}
				/>
			)}
		</div>
	);
};

export default UserIndex;
