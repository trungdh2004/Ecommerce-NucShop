import productEmpty from "@/assets/productEmpty.jpg";

const ProductEmpty = () => {
	return (
		<div className="flex flex-col items-center justify-center py-8">
			<img
				src="/no-product.png"
				alt=""
				className="lg:w-[300px] lg:h-[300px] md:w-[250px] md:h-[250px] w-[200px] h-[200px] object-cover"
			/>
			<h3 className="text-sm lg:text-base md:text-sm">
				Không tìm thấy sản phẩm nào theo yêu cầu
			</h3>
			<h3 className="text-sm lg:text-base md:text-sm">
				Hãy thử sử dụng các từ khóa chung chung hơn
			</h3>
		</div>
	);
};

export default ProductEmpty;
