import { ICart, ICartItem, ICartPreview } from "@/types/cart";
import { create } from "zustand";
interface ICartStore {
	carts: ICart[] | [];
	cartsPreviews: ICartPreview[] | [];
	totalCart: number;
	itemCart: ICartItem | null;
	setCarts: (payload: ICart[]) => void;
	updateTotalCart: (value: number) => void;
	setTotalCart: (value: number) => void;
	setItemCart: (payload: ICartItem | null) => void;
	setCartsPreview: (payload: ICartPreview[] | []) => void;
	clearStateCart:()=>void;
}
const useCart = create<ICartStore>((set) => ({
	carts: [],
	cartsPreviews: [],
	totalCart: 0,
	itemCart: null,
	setCarts: (payload: ICart[]) => set({ carts: payload }),
	setCartsPreview: (payload: ICartPreview[]) => set({ cartsPreviews: payload }),
	setTotalCart: (value: number) => set(() => ({ totalCart: value })),
	updateTotalCart: (value: number) =>
		set((state) => ({ totalCart: state.totalCart + value })),
	setItemCart: (payload: ICartItem | null) =>
		set(() => ({ itemCart: payload })),
	clearStateCart:()=>set({ carts: [],cartsPreviews:[],totalCart:0,itemCart:null })
}));
export default useCart;
