import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GoPencil } from "react-icons/go";
import { HiOutlineTrash } from "react-icons/hi";
import { IoFlagOutline } from "react-icons/io5";
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
					className="outline-none border-none bg-transparent hover:bg-transparent focus-visible:right-0 p-0"
				>
					{" "}
					<TbDotsVertical />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-auto min-w-[2rem]" align="end">
				<DropdownMenuItem>
					<div className="flex items-center gap-2.5 cursor-pointer">
						<GoPencil /> <span className="text-nowrap">Chỉnh sửa</span>
					</div>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<div className="flex items-center gap-2.5 cursor-pointer">
						<HiOutlineTrash /> <span className="text-nowrap" onClick={()=>handleDelete()}>Xoá</span>
					</div>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default Actions;
