import { Textarea } from "@/components/ui/textarea";
import useDebounceV2 from "@/hooks/debounce";
import useDebounce from "@/hooks/shared";
import { ObjectCheckoutOrder } from "@/types/ObjectCheckoutOrder";
import React, { ChangeEvent, Dispatch, SetStateAction } from "react";
interface Props {
	setOrderCheckout: Dispatch<SetStateAction<ObjectCheckoutOrder>>;
}
const NoteOrder = ({ setOrderCheckout }: Props) => {
	const handleNote = useDebounce((e: ChangeEvent<HTMLTextAreaElement>) => {
		const target = e.target as HTMLTextAreaElement;
		setOrderCheckout((prev) => {
			return { ...prev, note: target.value };
		});
	}, 1000);

	return (
		<div className="py-2 pb-4">
			<div className="lg:flex flex-col gap-3 bg-white lg:rounded-md md:rounded-md rounded-none border border-gray-200 box-shadow px-4 py-2">
				<h3>Ghi chú</h3>
				<Textarea onChange={handleNote} />
			</div>
		</div>
	);
};

export default NoteOrder;
