import { Textarea } from "@/components/ui/textarea";
import useDebounce from "@/hooks/shared";
import { ObjectCheckoutOrder } from "@/types/ObjectCheckoutOrder";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
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
			<div className="flex-col gap-3 px-4 py-2 bg-white border border-gray-200 rounded-none lg:flex lg:rounded-md md:rounded-md box-shadow">
				<h3>Ghi chú</h3>
				<Textarea onChange={handleNote} />
			</div>
		</div>
	);
};

export default NoteOrder;
