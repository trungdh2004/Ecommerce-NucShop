import TableComponent from "@/components/common/TableComponent";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import DialogConfirm from "@/components/common/DialogConfirm";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  hiddenListTag,
  hiddentag,
  pagingTags,
  unhiddenListTag,
  unhiddentag,
} from "@/service/tags-admin";
import { SearchObjectType } from "@/types/searchObjecTypes";
import { typeResponse } from "@/types/typeReponse";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { toast } from "sonner";
import { useDebounceCallback } from "usehooks-ts";
import TagAdd from "./TagAddandUpdate";

const TagIndex = () => {
	interface IData {
		_id: string;
		name: string;
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
	const [openUnhiddenTag, setopenUnhiddenTag] = useState<string | boolean>(
		false,
	);
	const [openHiddenTag, setOpenHiddenTag] = useState<string | boolean>(false);
	const [openManyTag, setOpenManyTag] = useState<string | boolean>(false);
	const [openUnManyTag, setOpenUnManyTag] = useState<string | boolean>(false);
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
		handleTags();
	}, [searchObject]);

	const handleTags = async () => {
		try {
			const { data } = await pagingTags(searchObject);
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
			await hiddentag(id);
			setOpenHiddenTag(false);
			handleTags();
			toast.success("Đã ẩn thẻ tag thành công");
		} catch (error) {
			toast.error("Ẩn thẻ tag thất bại");
		}
	};

	const handleUnhiddenCate = async (id: string | boolean) => {
		try {
			await unhiddentag(id);
			setopenUnhiddenTag(false);
			handleTags();
			toast.success("Bỏ ẩn thẻ tag thành công");
		} catch (error) {
			toast.error("Bỏ ẩn thẻ tag thất bại");
		}
	};
	const handleManyTag = async (listId: any) => {
		try {
			await hiddenListTag(listId);
			setOpenManyTag(false);
			handleTags();
			setRowSelection({});
			setListRowSelected([]);
			toast.success("Ẩn nhiều danh mục danh mục nhiều thành công");
		} catch (error) {
			toast.error("Ẩn danh mục nhiều thất bại");
		}
	};

	const handleUnManyTag = async (listId: any) => {
		try {
			await unhiddenListTag(listId);
			setOpenUnManyTag(false);
			handleTags();
			setRowSelection({});
			setListRowSelected([]);
			toast.success("Bỏ ẩn nhiều danh mục danh mục nhiều thành công");
		} catch (error) {
			toast.error("Bỏ ẩn danh mục nhiều thất bại");
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
		setListRowSelected([]);
		setRowSelection({});
	};
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
			accessorKey: "description",
			header: () => {
				return <div className="text-xs md:text-base">Mô tả</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="text-xs md:text-base">
						{row?.original?.description}
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
								Sửa thẻ tag
							</DropdownMenuItem>
							{row?.original?.deleted ? (
								<DropdownMenuItem
									className="text-green-400"
									onClick={() => setopenUnhiddenTag(row?.original?._id)}
								>
									Bỏ ẩn
								</DropdownMenuItem>
							) : (
								<DropdownMenuItem
									className="text-red-400"
									onClick={() => setOpenHiddenTag(row?.original?._id)}
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
				<h4 className="text-base font-medium md:text-xl">Danh sách thẻ nhãn</h4>
				<div className="flex justify-between">
					<Input
						placeholder="Tìm kiếm thẻ tag"
						className="w-[40%] md:text-base text-xs"
						onChange={(event) => debounced(event.target.value)}
					/>
					<div className="flex items-center gap-4">
						{listId.length !== 0 && searchObject.tab == 1 ? (
							<Button
								onClick={() => setOpenManyTag(true)}
								className="bg-white text-[#7f7f7f] hover:bg-[#eeeeee] w-full border"
							>
								Ẩn nhiều
							</Button>
						) : (
							""
						)}
						{listId.length !== 0 && searchObject.tab == 2 && (
							<Button
								onClick={() => setOpenUnManyTag(true)}
								className="bg-white text-[#7f7f7f] hover:bg-[#eeeeee] w-full border"
							>
								Bỏ Ẩn nhiều
							</Button>
						)}
						<Button
							onClick={() => setOpenId(true)}
							className="bg-white text-[#7f7f7f] hover:bg-[#eeeeee] w-full border"
						>
							Thêm nhãn
						</Button>
					</div>
				</div>
			</div>
			<Tabs value={`${searchObject.tab}`} className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger
						value="1"
						onClick={() =>
							setSearchObject((prev) => ({ ...prev, tab: 1, pageIndex: 1 }))
						}
					>
						Nhãn
					</TabsTrigger>
					<TabsTrigger
						value="2"
						onClick={() =>
							setSearchObject((prev) => ({ ...prev, tab: 2, pageIndex: 1 }))
						}
					>
						Nhãn ẩn
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
				dataPageSize={[1, 3, 5, 10]}
			/>
			{!!openHiddenTag && (
				<DialogConfirm
					open={!!openHiddenTag}
					title="Xác nhận ẩn thẻ tag"
					handleClose={() => setOpenHiddenTag(false)}
					handleSubmit={() => handleHiddenCate(openHiddenTag)}
					content="Bạn có chắc muốn ẩn thẻ tag này?"
					labelConfirm="Ẩn"
				/>
			)}
			{!!openUnhiddenTag && (
				<DialogConfirm
					open={!!openUnhiddenTag}
					title="Xác nhận bỏ ẩn thẻ tag"
					handleClose={() => setopenUnhiddenTag(false)}
					handleSubmit={() => handleUnhiddenCate(openUnhiddenTag)}
					content="Bạn có chắc muốn bỏ ẩn thẻ tag này?"
					labelConfirm="Bỏ ẩn"
				/>
			)}
			{!!openManyTag && (
				<DialogConfirm
					open={!!openManyTag}
					title="Xác nhận ẩn nhiều thẻ tag"
					handleClose={() => setOpenManyTag(false)}
					handleSubmit={() => handleManyTag(listId)}
					content="Bạn có chắc muốn ẩn các thẻ tag này?"
					labelConfirm="Ẩn"
				/>
			)}

			{!!openUnManyTag && (
				<DialogConfirm
					open={!!openUnManyTag}
					title="Xác nhận bỏ ẩn nhiều thẻ tag"
					handleClose={() => setOpenUnManyTag(false)}
					handleSubmit={() => handleUnManyTag(listId)}
					content="Bạn có chắc muốn bỏ ẩn các thẻ tag này?"
					labelConfirm="Bỏ ẩn"
				/>
			)}
			{!!openId && (
				<TagAdd
					open={openId}
					title="Cập nhật"
					handleClose={() => setOpenId(false)}
					handlePaging={() => handleTags()}
				/>
			)}
		</div>
	);
};

export default TagIndex;
