import OverlayViolet from "@/components/OverlayViolet";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ShipperPending = () => {
	const [time, setTime] = useState(5);

	useEffect(() => {
		const timeout = setInterval(() => {
			setTime((prev) => --prev);
		}, 1000);

		return () => {
			clearTimeout(timeout);
		};
	}, []);

	if (time === 0) {
		return <Navigate to={"/"} />;
	}

	return (
		<div className="h-[100vh] ">
			<OverlayViolet />
			<div className="flex items-center justify-center w-full min-h-screen px-2 py-4">
				<div className="max-w-[320px] p-4  shadow-md border bg-white border-gray-200 rounded-2xl">
					<div className="flex justify-center w-full">
						<img
							src="/shipperAuth.png"
							alt=""
							className="w-[120px] h-[100px]"
						/>
					</div>
					<div className="">
						<h1 className="mt-2 text-xl font-medium text-center">
							Tài khoản của bạn đã đăng kí vui lòng chờ chủ shop xác nhận thông
							tin
						</h1>
						<h2 className="mt-2 text-sm">
							Tự chuyển về trang chủ sau :{" "}
							<span className="font-medium">{time}</span> giây
						</h2>
						<p className="pt-2 mt-2 text-xs text-center text-gray-400 border-t border-gray-300">
							Cảm ơn bạn đã đăng kí shipper tại shop chúng tôi
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ShipperPending;
