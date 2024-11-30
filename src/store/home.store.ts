import { create } from "zustand";

interface IHomeStore {
	cart: {
		quantity: number;
		name: string;
	}[];
	onUpdateCart: (value: { quantity: number; name: string }) => void;
}

const useStore = create<IHomeStore>((set) => ({
	cart: [],
	// onUpdateIndex: () => set((state) => ({})),
	onUpdateCart: (value: { quantity: number; name: string }) =>
		set((state) => ({
			cart: [...state.cart, value],
		})),
}));

export default useStore;
