import { Table } from "@tanstack/react-table";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import Paginations from "./Pagination";

interface DataTablePaginationProps<TData> {
	table: Table<TData>;
	handleChangePage: ({ selected }: { selected: number }) => void;
	totalElement: number;
	pageCount: number;
	dataPageSize?: number[];
	handleChangePageSize: (value: number) => void;
	pageSize: number;
	pageIndex:number
}

export function DataTablePagination<TData>({
	table,
	handleChangePage,
	totalElement,
	pageCount,
	handleChangePageSize,
	dataPageSize,
	pageSize,
	pageIndex
}: DataTablePaginationProps<TData>) {
	const listSize = dataPageSize ? dataPageSize : [5, 10, 15, 20, 25];

	return (
		<div className="block sm:flex items-center justify-between px-2">
			<div className="flex-1 text-sm text-muted-foreground">
				Tổng : {totalElement}
			</div>
			<div className="flex space-y-2 sm:flex-row flex-col items-center space-x-2">
				<div className="flex items-center space-x-2">
					<p className="text-sm font-medium">Số lượng</p>
					<Select
						value={`${pageSize}`}
						onValueChange={(value) => {
							handleChangePageSize(+value as number);
						}}
					>
						<SelectTrigger className="h-8 w-[70px]">
							<SelectValue placeholder={table.getState().pagination.pageSize} />
						</SelectTrigger>
						<SelectContent side="top">
							{listSize.map((pageSize) => (
								<SelectItem key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="hidden sm:flex w-[100px] items-center justify-center text-sm font-medium">
					Trang {table.getState().pagination.pageIndex + 1} / {pageCount}
				</div>
				<div className="flex items-center space-x-2">
					<Paginations
						forcePage={pageIndex - 1}
						size="sm"
						pageCount={pageCount}
						handlePageClick={handleChangePage}
					/>
				</div>
			</div>
		</div>
	);
}
