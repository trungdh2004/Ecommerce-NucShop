import { create } from "zustand";

interface useOpenProps {
	openChat: boolean;
	setOpen: () => void;
	setClose: () => void;
}

export const useLoadingModal = create<useOpenProps>((set) => ({
	openChat: false,
	setOpen: () => set(() => ({ openChat: true })),
	setClose: () => set(() => ({ openChat: false })),
}));
