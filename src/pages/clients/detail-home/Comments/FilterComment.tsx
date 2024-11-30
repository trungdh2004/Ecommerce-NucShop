import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdOutlineSort } from "react-icons/md";

const FilterComment = () => {
	return (
		<div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="outline"
						className="outline-none border-none hover:bg-transparent bg-transparent flex items-center gap-2"
					>
						<MdOutlineSort size={24} />{" "}
						<span className="text-base">Sắp xếp theo</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56">
					<DropdownMenuCheckboxItem>
						Bình luận hằng đầu
					</DropdownMenuCheckboxItem>
					<DropdownMenuCheckboxItem>
						Bình luận sắp xếp trước
					</DropdownMenuCheckboxItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export default FilterComment;
