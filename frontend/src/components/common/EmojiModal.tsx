import { BsEmojiWink } from "react-icons/bs";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useEffect, useState } from "react";

type Props = {
	getEmoji?: (value: any) => void;
};

const EmojiModal = ({ getEmoji }: Props) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			if (!target.closest(".modal-emoji")) {
				setIsOpen(false);
			}
		};

		window.addEventListener("click", handleClickOutside);
		return () => {
			window.removeEventListener("click", handleClickOutside);
		};
	}, []);

	return (
		<div className="relative modal-emoji">
			<BsEmojiWink
				onClick={() => setIsOpen((prev) => !prev)}
				size={20}
				className="cursor-pointer"
			/>
			{isOpen && (
				<div className="absolute z-10 bottom-0">
					<Picker
						data={data}
						onEmojiSelect={(value: any) => {
							getEmoji?.(value);
							setIsOpen(false);
						}}
					/>
				</div>
			)}
		</div>
	);
};

export default EmojiModal;
