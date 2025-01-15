import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HiOutlineTrash } from "react-icons/hi";
import { TbDotsVertical } from "react-icons/tb";

interface Props {
	handleDelete: () => void;
}
const Actions = ({ handleDelete }: Props) => {
	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					className="p-0 bg-transparent border-none outline-none hover:bg-transparent focus-visible:right-0"
				>
					{" "}
					<TbDotsVertical />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-auto min-w-[2rem]" align="end">
				<DropdownMenuItem>
					<div className="flex items-center gap-2.5 cursor-pointer">
						<HiOutlineTrash />{" "}
						<span className="text-nowrap" onClick={() => handleDelete()}>
							Xoá
						</span>
					</div>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default Actions;
