import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getCategoryActive } from "@/service/category-admin";
import { useEffect, useState } from "react";
import { GrFormNextLink } from "react-icons/gr";
import { Link } from "react-router-dom";
import ProductsByCategory from "./ProductsByCategory";
import { motion } from "framer-motion";

type CategoryType = {
	_id: string;
	deleted: string;
	description: string;
	name: string;
	slug: string;
};

const ProductByCategory = () => {
	const [categorySelect, setCategorySelect] = useState("");
	const [categorys, setCategorys] = useState<CategoryType[]>();

	useEffect(() => {
		(async () => {
			const { data } = await getCategoryActive();
			setCategorySelect((data?.data as CategoryType[])[0]?._id);
			setCategorys(data?.data);
		})();
	}, []);

	return (
		<div className="py-8 mt-20 padding">
			<div className="flex flex-col items-center justify-center gap-y-12">
				<h2 className="text-2xl font-semibold text-center sm:text-4xl sm:font-bold">
					Đa dạng mẫu mã sản phẩm
				</h2>
				<div className="p-1 overflow-hidden bg-white border border-gray-100 shadow-md rounded-xl">
				  <div className="relative">
  					{/* Nền trượt */}
  					<motion.div
  						className="absolute top-0 left-0 h-full transition-all duration-300 ease-in-out bg-blue-500 rounded-lg"
  						layoutId="activeCategoryBackground"
  						initial={false}
  						transition={{ type: "spring", stiffness: 300, damping: 30 }}
  						style={{
  							width: `calc(100% / ${categorys?.length || 1})`,
  							left: `${categorys?.findIndex((item) => item._id === categorySelect) as number * (100 / (categorys?.length || 1))}%`,
  						}}
  					/>
  					<ul className="relative flex items-center gap-2 text-sm font-medium">
  						{categorys?.map((item) => (
  							<motion.li
  								key={item._id}
  								transition={{ duration: 0.3 }}
  								onClick={() => setCategorySelect(item._id)}
  								className="flex-1 cursor-pointer"
  							>
  								<p
  									className={cn(
  										"relative flex text-nowrap items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-500 hover:text-white text-gray-500 transition-all duration-300",
  										item._id === categorySelect && "text-white"
  									)}
  								>
  									{item.name}
  								</p>
  							</motion.li>
  						))}
  					</ul>
  				</div>
				</div>

				{/* Nội dung của danh mục đã chọn */}
				<motion.div
					key={categorySelect}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					transition={{ duration: 0.3 }}
					className="w-full"
				>
					<ProductsByCategory id={categorySelect} />
				</motion.div>
				<div className="flex items-center justify-center">
					<Link
						to={"/shop"}
						className="flex items-center py-2 text-white transition-colors duration-300 bg-blue-400 rounded-lg px-7 hover:bg-blue-700"
					>
						Xem thêm <GrFormNextLink />
					</Link>
				</div>
			</div>
		</div>
	);
};

export default ProductByCategory;
