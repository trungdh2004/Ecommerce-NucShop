import { formatCurrency } from "@/common/func";
import TableComponent from "@/components/common/TableComponent";
import { Input } from "@/components/ui/input";
import { IPagingPayment } from "@/types/customer";
import { pagingPaymentAdmin } from "@/types/payment";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import SearchPayment from "./SearchPayment";

interface IData {
	_id: string;
	amount: string;
	bankCode: string;
	cardType: string;
	codeOrder: string;
	createdAt: string;
	method: number;
	paymentDate: string;
	transactionId: string;
	updatedAt: string;
	user: string;
	__v: number;
}
const PaymentIndex = () => {
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({}); // xử lí selected
	// const [listRowSeleted, setListRowSelected] = useState<IData[]>([]);
	const [data, setData] = useState([]);
	const [searchObject, setSearchObject] = useState<IPagingPayment>({
		sort: -1,
		pageIndex: 1,
		pageSize: 5,
		keyword: "",
		startDate: "",
		endDate: "",
	});
	const [response, setResponse] = useState({
		pageIndex: 1,
		pageSize: 5,
		pageCount: 0,
		totalElement: 0,
		totalOptionPage: 0,
	});

	useEffect(() => {
		handlePayment();
	}, [searchObject]);
	const handleChangePage = (value: any) => {
		setSearchObject((prev) => ({
			...prev,
			pageIndex: value.selected + 1,
		}));
		setRowSelection({});
		// setListRowSelected([]);
	};
	const handleChangePageSize = (value: number) => {
		setSearchObject((prev) => ({
			...prev,
			pageSize: value,
			pageIndex: 1,
		}));
	};
	const handlePayment = async () => {
		try {
			const { data } = await pagingPaymentAdmin(searchObject);
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
	const debounced = useDebounceCallback((inputValue: string) => {
		setSearchObject((prev) => ({
			...prev,
			pageIndex: 1,
			keyword: inputValue,
		}));
	}, 300);
	const columns: ColumnDef<IData>[] = [
		{
			id: "codeOrder",
			accessorKey: "codeOrder",
			header: () => {
				return <div className="md:text-base text-xs">Mã đơn hàng</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="md:text-base text-xs">{row?.original?.codeOrder}</div>
				);
			},
		},
		{
			accessorKey: "bankCode",
			header: () => {
				return <div className="md:text-base text-xs">Ngân hàng</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="md:text-base text-xs">
						Ngân hàng {row?.original?.bankCode === "NCB" ? "Vnpay" : "Momo"}
					</div>
				);
			},
		},
		{
			accessorKey: "cardType",
			header: () => {
				return <div className="md:text-base text-xs">Thẻ</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="md:text-base text-xs">{row?.original?.cardType}</div>
				);
			},
		},
		{
			accessorKey: "transactionId",
			header: () => {
				return <div className="md:text-base text-xs">Mã giao dịch</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="md:text-base text-xs">
						{row?.original?.transactionId}
					</div>
				);
			},
		},
		{
			accessorKey: "amount",
			header: () => {
				return <div className="md:text-base text-xs">Số tiền thanh toán</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="md:text-base text-xs">
						{formatCurrency(row?.original?.amount)}
					</div>
				);
			},
		},
		{
			accessorKey: "createdAt",
			header: () => {
				return <div className="md:text-base text-xs">Ngày giao dịch</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="md:text-base text-xs">
						{format(row?.original?.createdAt, "yyyy-MM-dd HH:mm:ss")}
					</div>
				);
			},
		},
	];
	return (
		<div>
			<h4 className="font-medium md:text-xl text-base py-4">
				Danh sách giao dịch từ khách hàng
			</h4>
			<div className="flex lg:flex-row md:flex-row flex-col gap-3 justify-between pb-4">
				<Input
					placeholder="Tìm kiếm mã đơn hàng"
					className="w-[40%] md:text-base text-xs"
					onChange={(event) => debounced(event.target.value)}
				/>
				<SearchPayment
					// searchObject={searchObject}
					setSearchObject={setSearchObject}
				/>
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
		</div>
	);
};

export default PaymentIndex;
