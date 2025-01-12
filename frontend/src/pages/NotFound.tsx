import { Link } from "react-router-dom";

const NotFound = () => {
	return (
		<div className="fixed inset-0 z-50 grid h-screen px-4 bg-white">
			<Link
				className="flex items-center justify-center gap-2 pt-6 lg:justify-start lg:pt-0 h-1/3"
				to={"/"}
			>
				<img src="/NUC.svg" alt="" className="size-12 lg:size-16" />
				<p className="text-base font-semibold lg:text-lg">
					Website thời trang uy tín
				</p>
			</Link>
			<div className="flex flex-col items-center gap-3 text-center">
				<h1 className="text-6xl font-black lg:text-9xl text-custom-400">404</h1>

				<p className="text-lg font-bold tracking-tight text-gray-900 lg:text-2xl sm:text-4xl">
					Không tìm thấy nội dung
				</p>
				<div className="flex flex-col">
					<p className="mt-4 text-gray-500 text-[15px] lg:text-[18px]">
						URL của nội dung này đã bị thay đổi hoặc không còn tồn tại.
					</p>
					<p className="mt-4 text-gray-500 text-[15px] lg:text-[18px]">
						{" "}
						Nếu bạn đang lưu URL này, hãy thử truy cập lại từ trang chủ thay vì
						dùng URL đã lưu.
					</p>
				</div>

				<Link
					to="/"
					className="w-[200px] mt-6 inline-block bg-custom-300 px-4 py-2 lg:px-5 lg:py-3 text-sm font-medium text-white hover:bg-custom-500 focus:outline-none focus:ring rounded-full"
				>
					Trở về trang chủ
				</Link>
			</div>
		</div>
	);
};

export default NotFound;
