import OverlayViolet from "@/components/OverlayViolet";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ShipperPending = () => {
	const [time, setTime] = useState(5);

	useEffect(() => {
		let timeout = setInterval(() => {
			setTime(prev => --prev);
		}, 1000);

        return () => {
            clearTimeout(timeout);
        }
	}, []);

    if(time === 0) {
        return <Navigate to={"/"} />;
    }

	return (
		<div className="h-[100vh] ">
			<OverlayViolet />
			<div className="flex items-center justify-center min-h-screen py-4 px-2 w-full">
				<div className="max-w-[320px] p-4  shadow-md border bg-white border-gray-200 rounded-2xl">
					<div className="w-full flex justify-center">
						<img
							src="/shipperAuth.png"
							alt=""
							className="w-[120px] h-[100px]"
						/>
					</div>
					<div className="">
						<h1 className="text-center mt-2 text-xl font-medium">
							Tài khoản của bạn đã đăng kí vui lòng chờ chủ shop xác nhận thông
							tin
						</h1>
						<h2 className="text-sm  mt-2">Tự chuyển về trang chủ sau : <span className="font-medium">{time}</span> giây</h2>
						<p className="text-center text-xs mt-2 pt-2 border-t border-gray-300 text-gray-400">
							Cảm ơn bạn đã đăng kí shipper tại shop chúng tôi
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ShipperPending;
