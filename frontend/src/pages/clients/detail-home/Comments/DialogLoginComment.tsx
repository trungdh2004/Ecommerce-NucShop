import { Dialog, DialogContent } from "@/components/ui/dialog";
import Login from "@/pages/auth/Login";
interface Props {
	open: boolean;
	close: () => void;
}
const DialogLoginComment = ({ open, close }: Props) => {
	return (
		<div>
			<Dialog open={open} onOpenChange={close}>
				<DialogContent className="sm:max-w-[425px]">
					<Login />
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default DialogLoginComment;
