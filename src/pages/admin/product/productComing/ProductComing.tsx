import { Button } from "@/components/ui/button";
import {
	deleteProductComing,
	pagingProductComing,
	updateActiveProductComing,
	updateProductComing,
} from "@/service/product";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import ProductComingAdd from "./ProductComingAdd";
import TableComponent from "@/components/common/TableComponent";
import { formatCurrency } from "@/common/func";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { toast } from "sonner";

interface Search {
	pageIndex: number;
	pageSize: number;
}
interface Product {
	_id: string;
	name: string;
	price: number;
	quantity: number;
	thumbnail: string;
	discount: number;
}
interface IData {
	_id: string;
	active: boolean;
	date: Date;
	updatedAt: string;
	createdAt: string;
	product: Product;
}
const ProductComing = () => {
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({}); // xử lí selected
	const [data, setData] = useState([]);
	const [searchObject, setSearchObject] = useState<Search>({
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
			const { data } = await pagingProductComing(searchObject);
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
	const handleUpdateComing = async (id: string) => {
		try {
			await updateActiveProductComing(id);
			toast.success("Bạn cập nhật thành công");
			handleCustomer();
		} catch (error) {
			console.error("Error updating product", error);
		}
	};
	const handleDelete = async (id: string) => {
		try {
			await deleteProductComing(id);
			toast.success("Bạn xóa thành công");
			handleCustomer();
		} catch (error) {
			console.error("Error updating product", error);
		}
	};
	const columns: ColumnDef<IData>[] = [
		{
			accessorKey: "name",
			header: () => {
				return <div className="md:text-base text-xs">Tên</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="md:text-base text-xs w-[400px] truncate">
						{row?.original?.product?.name}
					</div>
				);
			},
		},
		{
			accessorKey: "thumbnail",
			header: () => {
				return <div className="md:text-base text-xs">Ảnh</div>;
			},
			cell: ({ row }) => {
				return (
					<img
						src={row.original?.product?.thumbnail || "/avatar_25.jpg"}
						className="md:w-[40px] md:h-[40px] w-[30px] h-[30px] rounded-full"
					/>
				);
			},
		},
		{
			accessorKey: "price",
			header: () => {
				return <div className="md:text-base text-xs">Giá</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="md:text-base text-xs">
						{formatCurrency(row?.original?.product?.price)}
					</div>
				);
			},
		},
		{
			accessorKey: "discount",
			header: () => {
				return <div className="md:text-base text-xs">Giảm giá</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="md:text-base text-xs">
						{formatCurrency(row?.original?.product?.discount)}
					</div>
				);
			},
		},
		{
			accessorKey: "quantity",
			header: () => {
				return <div className="md:text-base text-xs">Số lượng</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="md:text-base text-xs">
						{row?.original?.product?.quantity}
					</div>
				);
			},
		},
		{
			accessorKey: "date",
			header: () => {
				return <div className="md:text-base text-xs">Ngày kết thúc</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="md:text-base text-xs">
						{format(new Date(row.original.date), "dd/MM/yyyy")}
					</div>
				);
			},
		},
		{
			accessorKey: "active",
			header: () => {
				return <div className="md:text-base text-xs">Hoạt động</div>;
			},
			cell: ({ row }) => {
				const status = row.original.active ? "Hoạt động" : "Không hoạt động";
				return (
					<Badge
						className={`font-medium ${row.original.active ? "bg-green-500" : "bg-[#cf4040]"} text-center items-center text-xs text-nowrap leading-[14px]`}
					>
						{status}
					</Badge>
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
								<span className="sr-only">Open menu</span>
								<HiOutlineDotsVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								className="text-red-400 cursor-pointer"
								onClick={() => handleDelete(row?.original?._id)}
							>
								Xóa
							</DropdownMenuItem>
							<DropdownMenuItem
								className="text-blue-400 cursor-pointer"
								onClick={() => setOpen(row?.original?._id)}
							>
								Cập nhật
							</DropdownMenuItem>
							{!row?.original?.active && (
								<DropdownMenuItem
									className="text-green-400 cursor-pointer"
									onClick={() => handleUpdateComing(row?.original?._id)}
								>
									Bật
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];
	const [open, setOpen] = useState<boolean | string>(false);
	return (
		<div>
			<div className="flex justify-between py-4">
				<h4 className="font-medium md:text-xl text-base ">
					Danh sách sản phẩm chờ
				</h4>
				<Button
					onClick={() => {
						setOpen(true);
					}}
					className="bg-white text-[#7f7f7f] hover:bg-[#eeeeee] border"
				>
					Thêm sản phẩm chờ
				</Button>
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
				<ProductComingAdd
					open={open}
					close={() => {
						setOpen(false);
					}}
          handleCustomer={handleCustomer}
          
				/>
			)}
		</div>
	);
};

export default ProductComing;
