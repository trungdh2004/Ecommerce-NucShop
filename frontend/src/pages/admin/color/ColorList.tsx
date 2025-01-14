import DialogConfirm from "@/components/common/DialogConfirm";
import TableComponent from "@/components/common/TableComponent";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import instance from "@/config/instance";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { toast } from "sonner";
import { useDebounceCallback } from "usehooks-ts";
import ColorForm from "./ColorForm";
import { hiddenListColor, unHiddenListColor } from "@/service/color";
interface IData {
	_id: string;
	name: string;
	code: string;
	deleted: boolean;
	createdAt: string;
	updatedAt: string;
	slug: string;
}

export const hiddencolor = async (id: string | boolean) => {
	const data = await instance.delete(`color/delete/${id}`);
	return data;
};

export const unhiddencolor = async (id: string | boolean) => {
	const data = await instance.put(`color/unDelete/${id}`);
	return data;
};

const ColorList = () => {
	const [openId, setOpenId] = useState<string | boolean>(false);
	const [data, setData] = useState<IData[]>([]);
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({}); // xử lí selected
	const [listRowSelected, setListRowSelected] = useState<IData[]>([]);
	const [openHiddenColor, setOpenHiddenColor] = useState<string | boolean>(
		false,
	);
	const [openUnhiddenColor, setopenUnhiddenColor] = useState<string | boolean>(
		false,
	);
	const [openHiddenListColors, setOpenHiddenListColors] = useState<
		string | boolean
	>(false);
	const [openUnHiddenListColors, setOpenUnHiddenListColors] = useState<
		string | boolean
	>(false);

	const [searchObject, setSearchObject] = useState<any>({
		pageIndex: 1,
		pageSize: 5,
		keyword: "",
		fieldSort: "",
		sort: 1,
		tab: 1,
	});
	// console.log(searchObject);
	const listIdColor = listRowSelected.map((color: any) => {
		return color._id;
	});
	const [response, setResponse] = useState<any>({
		pageCount: 0,
		totalElement: 0, //tổng số phần tử
		totalOptionPage: 0, //tổng số phần tử trong 1 trang
	});
	const handleColor = async () => {
		try {
			const { data } = await instance.post("/color/paging", searchObject);
			setData(data.content);
			setResponse({
				pageCount: data.totalPage,
				totalElement: data.totalAllOptions,
				totalOptionPage: data.totalOptionPage,
			});
		} catch (error) {
			console.error(`color`, error);
		}
	};
	useEffect(() => {
		handleColor();
	}, [searchObject]);
	const handleHiddenColor = async (id: string | boolean) => {
		try {
			await hiddencolor(id);
			setOpenHiddenColor(false);
			handleColor();
			toast.success("Đã ẩn danh mục thành công");
		} catch (error) {
			toast.error("Ẩn danh mục thất bại");
		}
	};
	const handleUnhiddenColor = async (id: string | boolean) => {
		try {
			 await unhiddencolor(id);
			setopenUnhiddenColor(false);
			handleColor();
			toast.success("Ẩn màu sắc thành công");
		} catch (error) {
			toast.error("Ẩn màu sắc thất bại");
		}
	};
	const handleHiddenListColors = async (listId: any) => {
		try {
			await hiddenListColor(listId);
			setOpenHiddenListColors(false);
			handleColor();
			setRowSelection({});
			setListRowSelected([]);
			toast.success("Ẩn màu sắc thành công");
		} catch (error) {
			toast.error("Ẩn  màu sắc thất bại");
		}
	};
	const handleUnhiddenListColors = async (listId: any) => {
		try {
		 await unHiddenListColor(listId);
			setOpenUnHiddenListColors(false);
			handleColor();
			setRowSelection({});
			setListRowSelected([]);
			toast.success("Bỏ ẩn thành công");
		} catch (error) {
			toast.error("Bỏ ấn mục màu sắc thất bại");
		}
	};
	const handleChangePageSize = (value: number) => {
		setSearchObject((prev: any) => ({
			...prev,
			pageSize: value,
			pageIndex: 1,
		}));
	};
	const handleChangePage = (value: any) => {
		setRowSelection({});
		setListRowSelected([]);
		setSearchObject((prev: any) => ({
			...prev,
			pageIndex: value.selected + 1,
		}));
	};
	const debounced = useDebounceCallback((inputValue: string) => {
		setSearchObject((prev: any) => ({
			...prev,
			pageIndex: 1,
			keyword: inputValue,
		}));
	}, 300);
	const columns: ColumnDef<IData>[] = [
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
						if (value) setListRowSelected(data);
						if (!value) setListRowSelected([]);
					}}
					aria-label="Select all"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => {
						row.toggleSelected(!!value);
						if (value) setListRowSelected((prev) => [...prev, row.original]);
						if (!value)
							setListRowSelected((prev) => {
								return prev.filter((item) => item._id !== row.original._id);
							});
					}}
					aria-label="Select row"
				/>
			),
			size: 100,
		},
		{
			accessorKey: "name",
			header: () => {
				return <div className="text-xs md:text-base">Tên</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="text-xs md:text-base">{row?.original?.name}</div>
				);
			},
		},
		{
			accessorKey: "code",
			header: () => {
				return <div className="text-xs md:text-base">Mã màu</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="text-xs md:text-base">{row?.original?.code}</div>
				);
			},
		},
		{
			accessorKey: "color",
			header: () => {
				return <div className="text-xs md:text-base">Màu</div>;
			},
			cell: ({ row }) => {
				return (
					<div
						className="w-8 h-8 text-xs border rounded-full md:text-base"
						style={{ backgroundColor: `${row.original.code}` }}
					></div>
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
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="w-8 h-8 p-0">
								<span className="sr-only">Open menu</span>
								<HiOutlineDotsVertical className="w-4 h-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<Button
								onClick={() => setOpenId(row?.original?._id)}
								className="bg-white text-[#7f7f7f] hover:bg-[#eeeeee] w-full"
							>
								Sửa danh mục
							</Button>
							{row?.original?.deleted ? (
								<DropdownMenuItem
									className="pl-4 text-center text-green-400"
									onClick={() => setopenUnhiddenColor(row?.original?._id)}
								>
									Bỏ ẩn
								</DropdownMenuItem>
							) : (
								<DropdownMenuItem
									className="pl-4 text-center text-red-400"
									onClick={() => setOpenHiddenColor(row?.original?._id)}
								>
									Ẩn
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];
	return (
		<>
			<div className="flex flex-col gap-3 mb-5">
				<h4 className="text-base font-medium md:text-xl">Danh sách màu sắc</h4>
				<div className="flex justify-between">
					<Input
						placeholder="Tìm kiếm màu sắc"
						className="w-[40%] md:text-base text-xs"
						onChange={(event) => debounced(event.target.value)}
					/>
					<div className="flex items-center gap-4">
						{listIdColor.length !== 0 && searchObject.tab === 1 ? (
							<Button
								variant="danger"
								onClick={() => setOpenHiddenListColors(true)}
							>
								Ẩn nhiều
							</Button>
						) : (
							""
						)}
						{listIdColor.length !== 0 && searchObject.tab === 2 ? (
							<Button
								onClick={() => setOpenUnHiddenListColors(true)}
								variant="success"
							>
								Khôi phục
							</Button>
						) : (
							""
						)}
						<Button
							onClick={() => setOpenId(true)}
							className="bg-white text-[#7f7f7f] hover:bg-[#eeeeee] w-full border"
						>
							Thêm màu sắc
						</Button>
					</div>
				</div>
			</div>
			{
				<Tabs value={`${searchObject.tab}`} className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger
							value="1"
							onClick={() => {
								setSearchObject((prev: any) => ({
									...prev,
									tab: 1,
									pageIndex: 1,
								}));
								setRowSelection({});
								setListRowSelected([]);
							}}
						>
							Màu sắc
						</TabsTrigger>
						<TabsTrigger
							value="2"
							onClick={() => {
								setSearchObject((prev: any) => ({
									...prev,
									tab: 2,
									pageIndex: 1,
								}));
								setRowSelection({});
								setListRowSelected([]);
							}}
						>
							Màu sắc ẩn
						</TabsTrigger>
					</TabsList>
				</Tabs>
			}
			<TableComponent
				data={data}
				columns={columns}
				// selected
				rowSelection={rowSelection}
				setRowSelection={setRowSelection}
				// phân trang
				handleChangePage={handleChangePage}
				pageIndex={searchObject.pageIndex}
				pageSize={searchObject.pageSize}
				pageCount={response.pageCount}
				totalElement={response.totalElement}
				handleChangePageSize={handleChangePageSize}
			/>
			{!!openHiddenColor && (
				<DialogConfirm
					open={!!openHiddenColor}
					title="Xác nhận ẩn màu sắc"
					handleClose={() => setOpenHiddenColor(false)}
					handleSubmit={() => handleHiddenColor(openHiddenColor)}
					content="Bạn có chắc muốn ẩn màu sắc này không?"
					labelConfirm="Ẩn"
				/>
			)}
			{!!openUnhiddenColor && (
				<DialogConfirm
					open={!!openUnhiddenColor}
					title="Xác nhận bỏ ẩn màu sắc"
					handleClose={() => setopenUnhiddenColor(false)}
					handleSubmit={() => handleUnhiddenColor(openUnhiddenColor)}
					content="Bạn có chắc muốn bỏ ẩn màu sắc này?"
					labelConfirm="Bỏ ẩn"
				/>
			)}
			{!!openId && (
				<ColorForm
					open={openId}
					title="Cập nhật"
					handleClose={() => setOpenId(false)}
					handlePaging={() => handleColor()}
				/>
			)}

			{!!openHiddenListColors && (
				<DialogConfirm
					open={!!openHiddenListColors}
					title="Xác nhận ẩn mục màu sắc"
					handleClose={() => setOpenHiddenListColors(false)}
					handleSubmit={() => handleHiddenListColors(listIdColor)}
					content="Bạn có chắc muốn ẩn mục này?"
					labelConfirm="Ẩn"
				/>
			)}
			{!!openUnHiddenListColors && (
				<DialogConfirm
					open={!!openUnHiddenListColors}
					title="Xác nhận khôi phục mục màu sắc"
					handleClose={() => setOpenUnHiddenListColors(false)}
					handleSubmit={() => handleUnhiddenListColors(listIdColor)}
					content="Bạn có chắc muốn bỏ ẩn mục này?"
					labelConfirm="Khôi phục"
				/>
			)}
		</>
	);
};

export default ColorList;
