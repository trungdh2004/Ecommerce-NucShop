import { IShipper } from "@/types/shipper.interface";
import { create } from "zustand";

interface IStoreShipper {
	current: IShipper | null;
	setCurrent: (value: IShipper) => void;
}

const useStoreShipper = create<IStoreShipper>((set) => ({
	current: null,
	setCurrent: (value: IShipper) =>
		set(() => ({
			current: value,
		})),
}));

export default useStoreShipper;
