import Coupon from "@/components/common/Coupon/Coupon";
import Paginations from "@/components/common/Pagination";
import { getPaginatedVouchersClient } from "@/service/voucher";
import { SearchObjectType } from "@/types/searchObjecTypes";
import { typeResponse } from "@/types/typeReponse";
import { IVoucher } from "@/types/voucher";
import { useEffect, useState } from "react";

const VoucherIndex = () => {
	const [vouchers, setVouchers] = useState<IVoucher[]>([]);

	const [searchObject, setSearchObject] = useState<SearchObjectType>({
		pageIndex: 1,
		pageSize: 9,
		keyword: "",
		fieldSort: "",
		sort: 1,
		tab: 1,
	});

	const [response, setResponse] = useState<typeResponse>({
		pageCount: 0,
		totalElement: 0,
		totalOptionPage: 0,
	});

	const handleVouchers = async () => {
		try {
			const { data } = await getPaginatedVouchersClient(searchObject);
			setVouchers(data?.content);
			setResponse({
				pageCount: data.totalPage,
				totalElement: data.totalAllOptions,
				totalOptionPage: data.totalOptionPage,
			});
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		handleVouchers();
	}, [searchObject]);
	const handleChangePag = async (value: any) => {
		try {
			setSearchObject((prev) => ({
				...prev,
				pageIndex: value.selected + 1,
			}));
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div>
			<div className="padding">
				<div className="py-10">
					<h4 className="text-xl mb-4 font-semibold">Danh sách voucher</h4>

					{vouchers.length > 0 ? (
						<div className=" grid md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-2  ">
							{vouchers?.map((voucher) => (
								<div className="" key={voucher?._id}>
									<Coupon voucher={voucher} className="w-full" />
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-[70px] flex flex-col justify-between items-center ">
							<img src="/no-product.png" width={70} alt="" />
							<h2 className="">Không tìm thấy voucher nào</h2>
						</div>
					)}
					<div className="flex justify-center pt-8">
						{response.pageCount > 1 && (
							<Paginations
								forcePage={searchObject.pageIndex - 1}
								pageCount={response.pageCount}
								handlePageClick={handleChangePag}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default VoucherIndex;
