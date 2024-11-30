import TableComponent from "@/components/common/TableComponent";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { SearchObjectTypeProduct } from "@/types/searchObjecTypes";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { IColor, IProduct } from "@/types/typeProduct";
import {
	keepPreviousData,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import {
	deletedById,
	deleteMany,
	exportServiceProduct,
	importServiceProduct,
	pagingProduct,
	unDeletedById,
	unDeleteMany,
} from "@/service/product";
import { formatQuantity } from "@/common/localFunction";
import { SizeTypes } from "@/types/typeSize";
import { Link } from "react-router-dom";
import useDebounceV2 from "@/hooks/debounce";

import ProductFilter from "./ProductFilter";
import { IFilterProduct } from "@/types/product";
import DialogConfirm from "@/components/common/DialogConfirm";
import { toast } from "sonner";
import { ICategory } from "@/types/category";
import { IoIosRemoveCircle, IoIosCheckmarkCircle } from "react-icons/io";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { FaFileExport } from "react-icons/fa";
import { TooltipComponent } from "@/components/common/TooltipComponent";
import { LuImport } from "react-icons/lu";
import { useProcessBarLoadingEventNone } from "@/store/useSidebarAdmin";

const ProductIndex = () => {
	const queryClient = useQueryClient();
	const { setOpenProcessLoadingEventNone, setCloseProcessLoadingEventNone } =
		useProcessBarLoadingEventNone();
	const [searchObject, setSearchObject] = useState<SearchObjectTypeProduct>({
		pageIndex: 1,
		pageSize: 5,
		keyword: "",
		fieldSort: "",
		sort: -1,
		tab: 1,
		category: "",
		min: null,
		max: null,
		color: [],
		size: [],
	});
	const { data, isLoading } = useQuery({
		queryKey: ["paging", searchObject],
		queryFn: async () => {
			const { data } = await pagingProduct(searchObject);
			return data;
		},
		placeholderData: keepPreviousData,
	});
	const [rowSelection, setRowSelection] = useState<string[]>([]); // xử lí selected
	const [key, setKey] = useState("");
	const keyDebounce = useDebounceV2(key);
	const [openConfirm, setOpenConfirm] = useState<string | null>("");
	const [openConfirmMany, setOpenConfirmMany] = useState<boolean>(false);

	useEffect(() => {
		setSearchObject((prev) => ({
			...prev,
			keyword: keyDebounce,
		}));
	}, [keyDebounce]);

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
	};

	const handleDeleteProduct = async () => {
		try {
			await deletedById(openConfirm as string);
			queryClient.invalidateQueries({
				queryKey: ["paging", searchObject],
			});
			toast.success("Ẩn thành công");
		} catch (error) {
			toast.error("Ẩn thất bại");
		} finally {
			setOpenConfirm(null);
		}
	};

	const handleDeleteManyProduct = async () => {
		try {
			await deleteMany({ listId: rowSelection });
			queryClient.invalidateQueries({
				queryKey: ["paging", searchObject],
			});
			setRowSelection([]);
			toast.success("Ẩn toàn bộ thành công");
		} catch (error) {
			toast.error("Ẩn toàn bộ thất bại");
		} finally {
			setOpenConfirmMany(false);
		}
	};

	const handleUnDeleteProduct = async (id: string) => {
		try {
			await unDeletedById(id);
			queryClient.invalidateQueries({
				queryKey: ["paging", searchObject],
			});
			toast.success("Bỏ ẩn thành công");
		} catch (error) {
			toast.error("Bỏ ẩn thất bại");
		} finally {
			setOpenConfirm(null);
		}
	};
	const handleUnDeleteManyProduct = async () => {
		try {
			await unDeleteMany({ listId: rowSelection });
			queryClient.invalidateQueries({
				queryKey: ["paging", searchObject],
			});
			setRowSelection([]);
			toast.success("Bỏ ẩn thành công");
		} catch (error) {
			toast.error("Bỏ ẩn thất bại");
		} finally {
			setOpenConfirm(null);
		}
	};

	const columns: ColumnDef<IProduct>[] = [
		{
			id: "select",
			header: ({ table }) => "",
			cell: ({ row }) => (
				<Checkbox
					checked={rowSelection.some((item) => item === row.original._id)}
					onCheckedChange={(value) => {
						if (value) {
							setRowSelection((prev) => [
								...prev,
								row?.original?._id as string,
							]);
						} else {
							setRowSelection((prev) => {
								const newList = prev.filter(
									(item) => item !== row.original._id,
								);
								return newList;
							});
						}
					}}
					aria-label="Select row"
				/>
			),
			size: 100,
		},
		{
			accessorKey: "thumbnail",
			header: () => {
				return <div className="md:text-base text-xs">Ảnh</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="w-10 h-10 border">
						<img
							src={row.original.thumbnail}
							alt=""
							className="w-full h-full object-cover"
						/>
					</div>
				);
			},
		},
		{
			accessorKey: "name",
			header: () => {
				return (
					<div className="md:text-base text-xs min-w-[140px] md:min-w-[200px] max-w-[240px] line-clamp-2">
						Tên
					</div>
				);
			},
			cell: ({ row }) => {
				return (
					<div className="md:text-base text-xs font-medium line-clamp-2  max-w-[240px]">
						{row?.original?.name}
					</div>
				);
			},
		},
		{
			accessorKey: "category",
			header: () => {
				return <div className="md:text-base text-xs">Danh mục</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="md:text-base text-xs ">
						{(row.original.category as ICategory).name}
					</div>
				);
			},
		},
		//price
		{
			accessorKey: "price",
			header: () => {
				return <div className="md:text-base text-xs">Giá</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="md:text-base text-xs text-red-500">
						{formatQuantity(row?.original?.price, "đ")}
					</div>
				);
			},
		},
		//discount
		{
			accessorKey: "discount",
			header: () => {
				return <div className="md:text-base text-xs">Giá KM</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="md:text-base text-xs text-red-500">
						{formatQuantity(row?.original?.discount, "đ")}
					</div>
				);
			},
		},
		//SL
		{
			accessorKey: "quantity",
			header: () => {
				return <div className="md:text-base text-xs">SL</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="md:text-base text-xs ">
						{formatQuantity(row?.original?.quantity as number)}
					</div>
				);
			},
		},
		//  SL bán
		{
			accessorKey: "quantitySold",
			header: () => {
				return <div className="md:text-base text-xs">SL bán</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="md:text-base text-xs ">
						{formatQuantity(row?.original?.quantitySold as number)}
					</div>
				);
			},
		},
		// mầu
		{
			accessorKey: "is_simple",
			header: () => {
				return <div className="md:text-base text-xs">Đơn giản</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="flex justify-center text-center">
						{row?.original?.is_simple ? (
							<IoIosCheckmarkCircle className="text-green-500" size={20} />
						) : (
							<IoIosRemoveCircle className="text-rose-500" size={20} />
						)}
					</div>
				);
			},
		},
		//size
		{
			accessorKey: "is_hot",
			header: () => {
				return <div className="md:text-base text-xs">Nổi bật</div>;
			},
			cell: ({ row }) => {
				return (
					<div className=" text-center">
						{row?.original?.is_hot && (
							<Badge className="bg-rose-500">HOT</Badge>
						)}
					</div>
				);
			},
		},
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => {
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<HiOutlineDotsVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="min-w-10">
							<Link to={`/admin/product/update/${row.original._id}`}>
								<DropdownMenuItem className="bg-white text-[#7f7f7f] hover:bg-[#eeeeee] w-full text-start cursor-pointer">
									Sửa
								</DropdownMenuItem>
							</Link>
							{row?.original?.is_deleted ? (
								<DropdownMenuItem
									className="text-green-400 text-center cursor-pointer"
									onClick={() => {
										handleUnDeleteProduct(row.original._id as string);
									}}
								>
									Bỏ ẩn
								</DropdownMenuItem>
							) : (
								<DropdownMenuItem
									className="text-red-400 text-center cursor-pointer"
									onClick={() => {
										setOpenConfirm(row.original._id as string);
									}}
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

	const handleExportProduct = async () => {
		try {
			setOpenProcessLoadingEventNone();
			const { data } = await exportServiceProduct();
			const blob = new Blob([data]);
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.style.display = "none";
			a.href = url;
			a.download = "danh_sach_san_pham.xlsx";
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
		} catch (error) {
		} finally {
			setCloseProcessLoadingEventNone();
		}
	};

	const handleImportExcel = async (file: File) => {
		try {
			setOpenProcessLoadingEventNone();
			const form = new FormData();
			form.append("file", file);

			await importServiceProduct(form);
			queryClient.invalidateQueries({
				queryKey: ["paging", searchObject],
			});
			toast.success("Nhập dữ liệu thành công");
		} catch (error: any) {
			toast.error("Nhập dữ liệu thất bại");
		} finally {
			setCloseProcessLoadingEventNone();
		}
	};

	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-col gap-3">
				<h4 className="font-medium md:text-xl text-base">Danh sách danh mục</h4>
				<div className="flex flex-wrap justify-between gap-2">
					<Input
						placeholder="Tìm kiếm danh mục"
						className="w-full sm:w-[40%] md:text-base text-xs"
						value={key}
						onChange={(e) => setKey(e.target.value)}
					/>
					<div className="justify-between flex-1 sm:justify-end flex items-center gap-4">
						{rowSelection.length > 0 && searchObject.tab === 1 && (
							<Button
								variant={"danger"}
								onClick={() => setOpenConfirmMany(true)}
							>
								Ẩn tất cả
							</Button>
						)}

						{rowSelection.length > 0 && searchObject.tab === 2 && (
							<Button variant={"success"} onClick={handleUnDeleteManyProduct}>
								Bỏ ẩn tất cả
							</Button>
						)}
						<TooltipComponent label="Xuất dữ liệu hiện tại">
							<>
								<label
									htmlFor="importPro"
									className="h-10 p-2 bg-white rounded-sm font-medium text-sm border flex items-center text-[#7f7f7f] hover:bg-gray-100 cursor-pointer"
								>
									<LuImport size={20} className="mr-1" /> Nhập
								</label>
								<input
									type="file"
									id="importPro"
									className="hidden"
									accept=".xlsx,.xls"
									onChange={(e) => {
										const files = e.target.files as FileList;
										handleImportExcel(files[0]);
									}}
								/>
							</>
						</TooltipComponent>

						<TooltipComponent label="Xuất dữ liệu hiện tại">
							<Button
								variant={"secondary"}
								onClick={() => handleExportProduct()}
							>
								<FaFileExport size={20} className="mr-1" /> Xuất
							</Button>
						</TooltipComponent>

						<Link to={"/admin/product/add"}>
							<Button variant={"add"}>Thêm sản phẩm</Button>
						</Link>

						<ProductFilter
							onSubmit={(obj: IFilterProduct) => {
								setSearchObject((prev) => ({
									...prev,
									...obj,
								}));
							}}
						/>
					</div>
				</div>
			</div>
			<Tabs value={`${searchObject.tab}`} className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger
						value="1"
						onClick={() => {
							setSearchObject((prev) => ({ ...prev, tab: 1, pageIndex: 1 }));
							setRowSelection([]);
						}}
					>
						Danh sách
					</TabsTrigger>
					<TabsTrigger
						value="2"
						onClick={() => {
							setSearchObject((prev) => ({ ...prev, tab: 2, pageIndex: 1 }));
							setRowSelection([]);
						}}
					>
						Danh sách ẩn
					</TabsTrigger>
				</TabsList>
			</Tabs>
			<TableComponent
				data={data?.content || []}
				columns={columns}
				// phân trang
				handleChangePage={handleChangePage}
				pageIndex={searchObject.pageIndex}
				pageSize={searchObject.pageSize}
				pageCount={data?.totalPage}
				totalElement={data?.totalAllOptions}
				handleChangePageSize={handleChangePageSize}
				isLoading={isLoading}
				dataPageSize={[1, 2, 3, 4, 5]}
			/>
			{!!openConfirm && (
				<DialogConfirm
					open={!!openConfirm}
					title="Xác nhận ẩn sản phẩm"
					handleClose={() => setOpenConfirm(null)}
					handleSubmit={handleDeleteProduct}
					content="Bạn có chắc muốn ẩn sản phẩm này ?"
					labelConfirm="Ẩn"
				/>
			)}
			{openConfirmMany && (
				<DialogConfirm
					open={!!openConfirmMany}
					title="Xác nhận ẩn sản phẩm"
					handleClose={() => setOpenConfirmMany(false)}
					handleSubmit={handleDeleteManyProduct}
					content="Bạn có chắc muốn ẩn toàn bộ sản phẩm đã chọn?"
					labelConfirm="Bỏ ẩn"
				/>
			)}
			{/* {!!openManyCate && (
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
			)}  */}
		</div>
	);
};

export default ProductIndex;
