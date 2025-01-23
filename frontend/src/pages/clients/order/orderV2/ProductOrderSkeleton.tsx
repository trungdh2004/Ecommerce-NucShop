
const ProductOrderSkeleton = () => {
	return (
		<div className="flex flex-col gap-4 py-6 border border-gray-200 rounded-md px-7">
			{" "}
			<div className="flex items-center justify-between max-w-full animate-pulse">
				<div className="flex items-center gap-3">
					<div className="w-[90px] lg:h-[90px] h-[110px] bg-gray-300 rounded object-cover"></div>
					<div className="flex flex-col w-full gap-2">
						<div className="h-6 bg-gray-300 rounded w-[230px]"></div>
						<div className="flex items-center gap-3">
							<div className="w-16 h-4 bg-gray-300 rounded"></div>
							<div className="w-[1px] h-5 bg-gray-300"></div>
							<div className="w-16 h-4 bg-gray-300 rounded"></div>
						</div>
						<div className="block lg:hidden md:block">
							<div className="w-12 h-4 bg-gray-300 rounded"></div>
						</div>
						<div className="block lg:hidden md:block">
							<div className="w-24 h-4 bg-gray-300 rounded"></div>
						</div>
						<div className="block lg:hidden md:block">
							<div className="w-24 h-4 bg-gray-300 rounded"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductOrderSkeleton;
