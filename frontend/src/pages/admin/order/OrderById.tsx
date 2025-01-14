import { getOrderById } from "@/service/order";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OrderTracking from "./OrderTracking";
import OrderInformation from "./OrderInformation";
import OrderDetailTime from "./OrderDetailTime";
import { toast } from "sonner";

const OrderById = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [data, setData] = useState({});
	const [dataTrackings, setDataTracking] = useState([]);
	useEffect(() => {
		handleGetOrderById();
	}, [id]);
	useEffect(() => {
		const isEmptyObject = JSON.stringify(data) === "{}";
		if (isEmptyObject) {
			const timeout = setTimeout(() => {
				navigate("/admin/order");
			}, 2000);

			return () => clearTimeout(timeout);
		}
	}, [data, navigate]);
	const handleGetOrderById = async () => {
		try {
			const data = await getOrderById(id as string);
			setDataTracking(data.data.listStatusOrderDate);
			setData(data.data.data);
			return data;
		} catch (error) {
			console.log(error);
			toast.error("Không có đơn hàng này");
		}
	};
	return (
		<div className="grid grid-cols-1 gap-4">
			<OrderTracking data={dataTrackings} />
			<OrderInformation data={data} getOrderById={handleGetOrderById} />
			<OrderDetailTime data={data} />
		</div>
	);
};

export default OrderById;
