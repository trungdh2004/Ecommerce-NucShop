import useStore from "@/store/home.store";
import { Button } from "./ui/button";

const ButtonCrease = () => {
	const { onUpdateCart, cart } = useStore();

	return (
		<Button
			onClick={() => {
				const data = {
					quantity: cart.length + 1,
					name: `sp${cart.length + 1}`,
				};
				onUpdateCart(data);
			}}
		>
			Thêm
		</Button>
	);
};

export default ButtonCrease;
