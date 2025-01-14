import { formatCurrency } from "@/common/func";
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
import {
  deleteProductComing,
  pagingProductComing,
  updateActiveProductComing,
} from "@/service/product";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { toast } from "sonner";
import ProductComingAdd from "./ProductComingAdd";

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
	const [confirm, setConfirm] = useState<boolean | string>(false);

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
			setConfirm(false);
		} catch (error) {
			console.error("Error updating product", error);
		}
	};
	const columns: ColumnDef<IData>[] = [
		{
			accessorKey: "name",
			header: () => {
				return <div className="text-xs md:text-base">Tên</div>;
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
				return <div className="text-xs md:text-base">Ảnh</div>;
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
				return <div className="text-xs md:text-base">Giá</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="text-xs md:text-base">
						{formatCurrency(row?.original?.product?.price)}
					</div>
				);
			},
		},
		{
			accessorKey: "discount",
			header: () => {
				return <div className="text-xs md:text-base">Giảm giá</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="text-xs md:text-base">
						{formatCurrency(row?.original?.product?.discount)}
					</div>
				);
			},
		},
		{
			accessorKey: "quantity",
			header: () => {
				return <div className="text-xs md:text-base">Số lượng</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="text-xs md:text-base">
						{row?.original?.product?.quantity}
					</div>
				);
			},
		},
		{
			accessorKey: "date",
			header: () => {
				return <div className="text-xs md:text-base">Ngày kết thúc</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="text-xs md:text-base">
						{format(new Date(row.original.date), "dd/MM/yyyy")}
					</div>
				);
			},
		},
		{
			accessorKey: "active",
			header: () => {
				return <div className="text-xs md:text-base">Hoạt động</div>;
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
							<Button variant="ghost" className="w-8 h-8 p-0">
								<span className="sr-only">Open menu</span>
								<HiOutlineDotsVertical className="w-4 h-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								className="text-red-400 cursor-pointer"
								onClick={() => setConfirm(row?.original?._id)}
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
				<h4 className="text-base font-medium md:text-xl ">
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
			{!!confirm && (
				<DialogConfirm
					open={!!confirm}
					title="Xác nhận xóa bỏ sản phẩm chờ"
					handleClose={() => setConfirm(false)}
					handleSubmit={() => handleDelete(confirm as string)}
					content="Bạn có chắc muốn xóa sản phẩm chờ này?"
					labelConfirm="Xóa"
				/>
			)}
		</div>
	);
};

export default ProductComing;
