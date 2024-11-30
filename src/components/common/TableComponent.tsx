import React, { useState } from "react";

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getSortedRowModel,
	SortingState,
	VisibilityState,
	RowSelectionState,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DataTablePagination } from "./DataTablePagination";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]; //!column các cột dùng
	data: TData[]; //!data
	pageCount: number; //! số lượng trang
	pageIndex: number; //! trang hiện tại
	totalElement: number; //!số lượng sản phẩm
	handleChangePage: ({ selected }: { selected: number }) => void; //!hàm thay đổi trang
	rowSelection?: RowSelectionState; //! lưu trữ các row selected
	setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>>; //! hàm để selected
	dataPageSize?: number[]; //! data mảng các size tùy chỉnh
	pageSize: number; //! số lượng phàn tử trong trang
	handleChangePageSize: (value: number) => void; //! thay đổi phần tử trang
	isLoading?: boolean;
}

const TableComponent = <TData, TValue>({
	columns,
	data,
	pageIndex,
	handleChangePage,
	pageSize = 10,
	pageCount = 0,
	totalElement = 0,
	rowSelection,
	setRowSelection,
	handleChangePageSize,
	dataPageSize,
	isLoading = false,
}: DataTableProps<TData, TValue>) => {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onRowSelectionChange: setRowSelection,
		state: {
			rowSelection,
		},
	});

	return (
		<div className="space-y-2">
			<div className="border rounded-md">
				<Table>
					<TableHeader className="scroll-custom">
						{table.getHeaderGroups().map((headerGroup) => {
							return (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id}>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
											</TableHead>
										);
									})}
								</TableRow>
							);
						})}
					</TableHeader>

					<TableBody className="scroll-custom relative">
						{isLoading && (
							<div className="inset-0 absolute bg-gray-300/40 flex justify-center items-center">
								<AiOutlineLoading3Quarters
									size={20}
									className="text-blue-500 animate-spin"
								/>
							</div>
						)}
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									// data-state={(row.getIsSelected() && "selected") || ""}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									Không có giá trị
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<DataTablePagination
				table={table}
				handleChangePage={handleChangePage}
				pageCount={pageCount}
				totalElement={totalElement}
				handleChangePageSize={handleChangePageSize}
				dataPageSize={dataPageSize}
				pageSize={pageSize}
				pageIndex={pageIndex}
			/>
		</div>
	);
};

export default TableComponent;
