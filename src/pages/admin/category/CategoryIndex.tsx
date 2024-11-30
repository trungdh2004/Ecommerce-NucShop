import TableComponent from "@/components/common/TableComponent";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
	activeCategory,
	hiddencate,
	hiddenManyCate,
	paddingCate,
	unhiddencate,
	unhiddenManyCate,
} from "@/service/category-admin";
import { SearchObjectType } from "@/types/searchObjecTypes";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { parseISO, format } from "date-fns";
import CategoryAdd from "./CategoryAddandUpdate";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { typeResponse } from "@/types/typeReponse";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import DialogConfirm from "@/components/common/DialogConfirm";
import { AxiosError } from "axios";

const CategoryIndex = () => {
	interface IData {
		_id: string;
		name: string;
		thumbnail: string;
		description: string;
		deleted: boolean;
		createdAt: string;
		updatedAt: string;
		slug: string;
	}
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({}); // xử lí selected
	const [listRowSeleted, setListRowSelected] = useState<IData[]>([]);
	const listId = listRowSeleted.map((data: any) => {
		return data._id;
	});
	const [data, setData] = useState<IData[]>([]);
	const [openId, setOpenId] = useState<string | boolean>(false);
	const [openUnhiddenCategory, setopenUnhiddenCategory] = useState<
		string | boolean
	>(false);
	const [openHiddenCategory, setOpenHiddenCategory] = useState<
		string | boolean
	>(false);
	const [openManyCate, setOpenManyCate] = useState<string | boolean>(false);
	const [openUnManyCate, setOpenUnManyCate] = useState<string | boolean>(false);
	const debounced = useDebounceCallback((inputValue: string) => {
		setSearchObject((prev) => ({
			...prev,
			pageIndex: 1,
			keyword: inputValue,
		}));
	}, 300);
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
		totalElement: 0, //tổng số phần tử
		totalOptionPage: 0, //tổng số phần tử trong 1 trang
	});

	useEffect(() => {
		handleCategory();
	}, [searchObject]);

	const handleCategory = async () => {
		try {
			const { data } = await paddingCate(searchObject);
			setData(data.content);
			setResponse({
				pageCount: data.totalPage,
				totalElement: data.totalAllOptions,
				totalOptionPage: data.totalOptionPage,
			});
		} catch (error) {
			console.error("Error fetching data", error);
		}
	};

	const handleHiddenCate = async (id: string | boolean) => {
		try {
			const { data } = await hiddencate(id);
			setOpenHiddenCategory(false);
			handleCategory();
			toast.success("Đã ẩn danh mục thành công");
		} catch (error) {
			toast.error("Ẩn danh mục thất bại");
		}
	};

	const handleManyCate = async (listId: any) => {
		try {
			const { data } = await hiddenManyCate(listId);
			setOpenManyCate(false);
			handleCategory();
			setRowSelection({});
			setListRowSelected([]);
			toast.success("Ẩn nhiều danh mục danh mục nhiều thành công");
		} catch (error) {
			toast.error("Ẩn danh mục nhiều thất bại");
		}
	};

	const handleUnManyCate = async (listId: any) => {
		try {
			const { data } = await unhiddenManyCate(listId);
			setOpenUnManyCate(false);
			handleCategory();
			setRowSelection({});
			setListRowSelected([]);
			toast.success("Bỏ ẩn nhiều danh mục danh mục nhiều thành công");
		} catch (error) {
			toast.error("Bỏ ẩn danh mục nhiều thất bại");
		}
	};

	const handleUnhiddenCate = async (id: string | boolean) => {
		try {
			const { data } = await unhiddencate(id);
			setopenUnhiddenCategory(false);
			handleCategory();
			toast.success("Bỏ ẩn danh mục thành công");
		} catch (error) {
			toast.error("Bỏ ẩn danh mục thất bại");
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
	const handleUpdateActive = async (id: string, active: boolean) => {
		try {
			const { data } = await activeCategory({
				id,
				active,
			});
			toast.success(data?.message);
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error?.response?.data?.message);
			}
		}
	};
	const columns: ColumnDef<IData>[] = [
		{
			accessorKey: "select",
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
			id: "name",
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
			accessorKey: "thumbnail",
			id: "thumbnail",
			header: () => {
				return <div className="text-xs md:text-base">Ảnh</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="w-14 h-14">
						<img
							src={row?.original?.thumbnail}
							alt="Chưa có ảnh"
							className="w-full h-full"
						/>
					</div>
				);
			},
		},
		{
			accessorKey: "description",
			id: "description",

			header: () => {
				return <div className="text-xs md:text-base ">Mô tả</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="md:text-base text-xs lg:w-[450px] md:w-[300px] w-[250px] truncate">
						{row?.original?.description}
					</div>
				);
			},
		},

		{
			accessorKey: "createdAt",
			id: "createdAt",
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
			accessorKey: "actions",
			id: "actions",
			enableHiding: false,
			header: () => {
				return <div className="text-xs md:text-base">Hành động</div>;
			},
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
							<DropdownMenuItem
								className="bg-white text-[#7f7f7f] hover:bg-[#eeeeee] w-full text-start cursor-pointer"
								onClick={() => setOpenId(row?.original?._id)}
							>
								Sửa danh mục
							</DropdownMenuItem>
							{row?.original?.deleted ? (
								<DropdownMenuItem
									className="text-center text-green-400"
									onClick={() => setopenUnhiddenCategory(row?.original?._id)}
								>
									Bỏ ẩn
								</DropdownMenuItem>
							) : (
								<DropdownMenuItem
									className="text-center text-red-400"
									onClick={() => setOpenHiddenCategory(row?.original?._id)}
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
		<div className="flex flex-col gap-3">
			<div className="flex flex-col gap-3">
				<h4 className="text-base font-medium md:text-xl">Danh sách danh mục</h4>
				<div className="flex justify-between">
					<Input
						placeholder="Tìm kiếm danh mục"
						className="w-[40%] md:text-base text-xs"
						onChange={(event) => debounced(event.target.value)}
					/>
					<div className="flex items-center gap-4">
						<Button
							onClick={() => setOpenId(true)}
							className="bg-white text-[#7f7f7f] hover:bg-[#eeeeee] w-full border"
						>
							Thêm danh mục
						</Button>
						{listId.length !== 0 && searchObject.tab == 1 ? (
							<Button
								onClick={() => setOpenManyCate(true)}
								className="bg-white text-[#7f7f7f] hover:bg-[#eeeeee] w-full border"
							>
								Ẩn nhiều
							</Button>
						) : (
							""
						)}
						{listId.length !== 0 && searchObject.tab == 2 && (
							<Button
								onClick={() => setOpenUnManyCate(true)}
								className="bg-white text-[#7f7f7f] hover:bg-[#eeeeee] w-full border"
							>
								Bỏ Ẩn nhiều
							</Button>
						)}
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
						Danh mục
					</TabsTrigger>
					<TabsTrigger
						value="2"
						onClick={() => {
							setRowSelection({});
							setListRowSelected([]);
							setSearchObject((prev) => ({ ...prev, tab: 2, pageIndex: 1 }));
						}}
					>
						Danh mục ẩn
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
				pageIndex={searchObject.pageIndex}
				pageSize={searchObject.pageSize}
				pageCount={response.pageCount}
				totalElement={response.totalElement}
				handleChangePageSize={handleChangePageSize}
			/>
			{!!openHiddenCategory && (
				<DialogConfirm
					open={!!openHiddenCategory}
					title="Xác nhận ẩn danh mục"
					handleClose={() => setOpenHiddenCategory(false)}
					handleSubmit={() => handleHiddenCate(openHiddenCategory)}
					content="Bạn có chắc muốn ẩn danh mục này?"
					labelConfirm="Ẩn"
				/>
			)}
			{!!openUnhiddenCategory && (
				<DialogConfirm
					open={!!openUnhiddenCategory}
					title="Xác nhận bỏ ẩn danh mục"
					handleClose={() => setopenUnhiddenCategory(false)}
					handleSubmit={() => handleUnhiddenCate(openUnhiddenCategory)}
					content="Bạn có chắc muốn bỏ ẩn danh mục này?"
					labelConfirm="Bỏ ẩn"
				/>
			)}
			{!!openManyCate && (
				<DialogConfirm
					open={!!openManyCate}
					title="Xác nhận ẩn nhiều  danh mục"
					handleClose={() => setOpenManyCate(false)}
					handleSubmit={() => handleManyCate(listId)}
					content="Bạn có chắc muốn ẩn các danh mục này?"
					labelConfirm="Ẩn"
				/>
			)}

			{!!openUnManyCate && (
				<DialogConfirm
					open={!!openUnManyCate}
					title="Xác nhận bỏ ẩn nhiều  danh mục"
					handleClose={() => setOpenUnManyCate(false)}
					handleSubmit={() => handleUnManyCate(listId)}
					content="Bạn có chắc muốn bỏ ẩn các danh mục này?"
					labelConfirm="Bỏ ẩn"
				/>
			)}
			{!!openId && (
				<CategoryAdd
					open={openId}
					title="Cập nhật"
					handleClose={() => setOpenId(false)}
					handlePaging={() => handleCategory()}
				/>
			)}
		</div>
	);
};

export default CategoryIndex;
