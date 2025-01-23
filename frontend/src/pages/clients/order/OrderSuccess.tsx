import { getCountMyShoppingCart, pagingNewCart } from "@/service/cart";
import useCart from "@/store/cart.store";
import { useEffect } from "react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

const OrderSuccess = () => {
	const navigate = useNavigate();
	const { setCartsPreview, setTotalCart } = useCart();
	useEffect(() => {
		(async () => {
			const [carts, totalCountCart] = await Promise.all([
				pagingNewCart({ pageSize: 5 }),
				getCountMyShoppingCart(),
			]);
			setCartsPreview(carts?.data?.content);
			setTotalCart(totalCountCart?.data?.count);
		})();
		const timeout = setTimeout(() => {
			navigate("/");
		}, 5000);
		return () => clearTimeout(timeout);
	}, [navigate]);
	return (
		<div className="container">
			<div className="flex flex-col items-center justify-center gap-5 py-11">
				<IoIosCheckmarkCircleOutline size={80} className="text-green-500" />
				<h3 className="text-lg">Đặt hàng thành công </h3>
				<p>
					Chúng tôi sẽ liên hệ Quý khách để xác nhận đơn hàng trong thời gian
					sớm nhất
				</p>
				<div className="flex gap-3 ">
					<Link
						to="/account/purchase"
						className="p-2 font-light border border-gray-200 rounded-lg hover:bg-slate-100"
					>
						Quản lý đơn hàng
					</Link>
					<Link
						to="/shop"
						className="bg-[#36bd2a] text-white font-light p-2 hover:bg-[#479346] rounded-lg"
					>
						Tiếp tục mua hàng
					</Link>
				</div>
			</div>
		</div>
	);
};

export default OrderSuccess;
