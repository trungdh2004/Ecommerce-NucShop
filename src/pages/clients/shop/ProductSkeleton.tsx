import React from "react";

const ProductSkeleton = () => {
	return (
		<div className="w-full py-9">
			<div className="animate-pulse grid w-full lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
				{Array.from({ length: 8 }).map((_, index) => (
					<div
						className="max-w-full min-w-full box-shadow rounded-lg overflow-hidden  bg-white"
						key={index}
					>
						<div className="w-full">
							<div className="max-w-full min-w-full h-[300px] object-cover bg-slate-200"></div>
						</div>
						<div className="p-3">
							<p className="w-[80px] h-3 rounded bg-slate-200"></p>
							<div className=" w-9 h-3 rounded bg-slate-200 flex items-center justify-start -space-x-1 *:size-3 *:inline-block  *:rounded-full my-1.5"></div>
							<div className="flex items-center justify-between">
								<span className="w-14 h-3 rounded bg-slate-200 text-sm font-medium text-red-500"></span>
								<span className="text-xs w-9 h-3 rounded bg-slate-200"></span>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default ProductSkeleton;
