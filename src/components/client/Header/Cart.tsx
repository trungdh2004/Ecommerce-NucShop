import { formatCurrency } from "@/common/func";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useAuth } from "@/hooks/auth";
import { useCurrentRouteAndNavigation } from "@/hooks/router";
import { cn } from "@/lib/utils";
import useCart from "@/store/cart.store";
import { LucideShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import CartPreview from "./CartPreview";

const Cart = () => {
	const { totalCart, cartsPreviews } = useCart();
	const { isLoggedIn } = useAuth();
	const navigateIsLogin = useCurrentRouteAndNavigation();	
	return (
		<Link
			to={"/cart"}
			onClick={(e) => {
				if (!isLoggedIn) {
					e.preventDefault();
					navigateIsLogin();
				}
			}}
			className="hidden md:block"
		>
			<HoverCard>
				<HoverCardTrigger asChild>
					<div
						className="relative hover:bg-[#919eab27] rounded-full p-1"
						id="cartHeader"
					>
						<span
							className={cn(
								" rounded-full bg-red-500 text-center text-white absolute w-4 h-4 text-xs flex items-center justify-center top-0 -right-1 ",
								isLoggedIn && "inline-block",
							)}
						>
							{totalCart}
						</span>
						<LucideShoppingCart strokeWidth={1.5} size={20} />
					</div>
				</HoverCardTrigger>
				<HoverCardContent align="end" className="w-80">
					<div className={cn("")}>
						{!totalCart ? (
							<div className="flex items-center justify-center py-14">
								<div className="flex flex-col items-center justify-center">
									<div className="w-24 h-24 mx-auto">
										<img
											src="/cart-is-empty.png"
											alt=""
											className="object-cover w-full h-full"
										/>
									</div>
									<p>Chưa có sản phẩm</p>
								</div>
							</div>
						) : (
							<CartPreview carts={cartsPreviews} totalCart={totalCart} />
						)}
					</div>
				</HoverCardContent>
			</HoverCard>
		</Link>
	);
};

export default Cart;
