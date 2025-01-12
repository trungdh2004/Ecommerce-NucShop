import { useEffect, useState, useTransition } from "react";

import TableComponent from "@/components/common/TableComponent";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import instance from "@/config/instance";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { Link } from "react-router-dom";

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

const UserIndex = () => {
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({}); // xử lí selected
	const [listRowSeleted, setListRowSelected] = useState<IData[]>([]);

	const [response, setResponse] = useState({
		pageIndex: 1,
		pageSize: 5,
		pageCount: 0,
		totalElement: 0,
		totalOptionPage: 0,
	});
	const [searchObject, setSearchObject] = useState({
		pageIndex: 1,
		pageSize: 5,
	});
	const [] = useTransition();
	const [data, setData] = useState<IData[]>([]);

	useEffect(() => {
		(async () => {
			const { data } = await instance.post("/admin/list-user", searchObject);
			setData(data.content);
			setResponse({
				pageIndex: data.pageIndex,
				pageSize: data.pageSize,
				pageCount: data.totalPage,
				totalElement: data.totalAllOptions,
				totalOptionPage: data.totalOptionPage,
			});
		})();
	}, [searchObject]);

	const handleChangePageSize = (value: number) => {
		setSearchObject((prev) => ({
			...prev,
			pageSize: value,
		}));
	};

	const onDelete = (id: string) => {
		console.log("id:", id);
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
			accessorKey: "full_name",
			header: () => {
				return <div className="text-red-500">Name</div>;
			},
		},
		{
			accessorKey: "email",
			header: "Email",
		},
		{
			accessorKey: "avatarUrl",
			header: "AvatarUrl",
			cell: ({ row }) => {
				return (
					<img
						src={row.original.avatarUrl || "/avatar_25.jpg"}
						className="w-[40px] h-[40px] rounded-full"
					/>
				);
			},
		},
		{
			accessorKey: "provider",
			header: ({}) => {
				return <div>Phương thức</div>;
			},
			cell: ({ row }) => {
				const value = `${row.getValue("provider") ? "google" : "Create"}`;
				return <div className="font-medium">{value}</div>;
			},
		},
		{
			accessorKey: "createdAt",
			header: "Ngày tạo",
		},
		{
			id: "action",
			header: () => {
				return <div>Action</div>;
			},
			cell: ({ row }) => {
				return (
					<div>
						<Button
							variant={"danger"}
							onClick={() => onDelete(row?.original?._id)}
							asChild
						>
							<Link to={row.original._id}>Chi tiết</Link>
						</Button>
						<Button
							variant={"danger"}
							onClick={() => onDelete(row?.original?._id)}
						>
							Xóa
						</Button>
					</div>
				);
			},
		},
	];

	const handleChangePage = (value: any) => {
		console.log("value change page", value);

		setSearchObject((prev) => ({
			...prev,
			pageIndex: value.selected + 1,
		}));
	};

	const handleSubmit = () => {
		console.log("rowSelection:", listRowSeleted);
	};

	return (
		<div>
			<h4 className="">Danh sách test</h4>
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
				dataPageSize={[1, 2, 3, 5]}
			/>
			<button onClick={handleSubmit}>click</button>
		</div>
	);
};

export default UserIndex;
