import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useExitsColorSizeAttribute } from "@/hooks/cart";
import {
	IAttribute,
	IListColorAttribute,
	IListSizeAttribute,
} from "@/types/product";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { RiArrowDownSFill } from "react-icons/ri";
import ListColor from "../detail-home/ListColor";
import ListSize from "../detail-home/ListSize";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";

type Props = {
	isOpen: boolean;
	product?: {
		_id?: string;
		listColor?: IListColorAttribute[];
		listSize?: IListSizeAttribute[];
	};
	attributeAlreadyExists?: {
		listColor?: string[];
		listSize?: string[];
	};
	errors?: {
		color: boolean;
		size: boolean;
	};
	isSubmitted?: boolean;
	setIsOpen: (value: boolean) => void;
	setErrors?: Dispatch<SetStateAction<{ color: boolean; size: boolean }>>;
	attribute?: IAttribute;
	handleChangeAttributes?: (colorId: string, sizeId: string) => void;
};

const Attribute = ({
	isOpen,
	product,
	attribute,
	errors,
	setIsOpen,
	setErrors,
	isSubmitted,
	attributeAlreadyExists,
	handleChangeAttributes,
}: Props) => {
	const isMobile = useMediaQuery("(max-width: 768px)");
	const [attributesId, setAttributesId] = useState({
		sizeId: "",
		colorId: "",
	});
	const [exitsListSize, setExitsListSize] = useState<string[]>([]);
	const [exitsListColor, setExitsListColor] = useState<string[]>([]);
	const { listSizeExist, listColorExist } = useExitsColorSizeAttribute(
		product as any,
	);

	useEffect(() => {
		if (!isOpen) {
			resetAttributes();
		}
	}, [isOpen]);

	const resetAttributes = () => {
		setAttributesId({ sizeId: "", colorId: "" });
		setExitsListColor([]);
		setExitsListSize([]);
	};

	const handleColorChange = (colorId: string) => {
		setAttributesId((prev) => ({ ...prev, colorId }));
		if (colorId && isSubmitted) {
			setErrors?.((prev) => ({ ...prev, color: false }));
		}
	};

	const handleSizeChange = (sizeId: string) => {
		setAttributesId((prev) => ({ ...prev, sizeId }));
		if (sizeId && isSubmitted) {
			setErrors?.((prev) => ({ ...prev, size: false }));
		}
	};

	const handleConfirm = () => {
		handleChangeAttributes?.(attributesId.colorId, attributesId.sizeId);
	};

	const animationMenu = {
		open: { rotate: "180deg" },
		closed: { rotate: 0 },
	};

	return (
		<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenuTrigger asChild className="outline-none">
				<button className="inline-block text-sm text-left text-gray-500 outline-none">
					<div className="flex items-start gap-1 w-min">
						<span className="text-nowrap">Phân loại sản phẩm</span>{" "}
						<motion.div
							initial={false}
							animate={isOpen ? "open" : "closed"}
							variants={animationMenu}
						>
							<RiArrowDownSFill size={20} />
						</motion.div>
					</div>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="min-w-72 p-1.5"
				// align={!attribute?.color && !attribute?.size ? "end" : "center"}
				align="start"
			>
				<div
					className={cn(
						"space-y-3 p-1.5 rounded",
						errors?.color && errors?.size && "bg-red-50",
					)}
				>
					<div className={cn("w-full p-1", errors?.color && "bg-red-50")}>
						<ListColor
							onChoose={handleColorChange}
							validExits
							widthLabel={120}
							listColorExist={listColorExist}
							exitsListColor={exitsListColor}
							colorIdChecked={attribute?.color?._id}
							sizeInput={isMobile ? "mobile" : "small"}
							selectedColor={attributeAlreadyExists?.listColor}
							setExitsListSize={setExitsListSize}
						/>
						<span
							className={cn(
								"text-red-500 hidden text-xs",
								errors?.color && !errors?.size && "inline-block",
							)}
						>
							Bạn chưa chọn màu sắc cho sản phẩm
						</span>
					</div>
					<div className={cn("w-full p-1", errors?.size && "bg-red-50")}>
						<ListSize
							validExits
							widthLabel={120}
							listSizeExist={listSizeExist}
							exitsListSize={exitsListSize}
							sizeIdChecked={attribute?.size?._id}
							setExitsListColor={setExitsListColor}
							sizeInput={isMobile ? "mobile" : "small"}
							selectedSize={attributeAlreadyExists?.listSize}
							onChoose={handleSizeChange}
						/>
						<span
							className={cn(
								"text-red-500 hidden text-xs",
								errors?.size && !errors?.color && "inline-block",
							)}
						>
							Bạn chưa chọn kích thước cho sản phẩm
						</span>
					</div>
					<span
						className={cn(
							"text-red-500 hidden text-xs",
							errors?.color && errors?.size && "inline-block",
						)}
					>
						Bạn biến thể cho sản phẩm
					</span>
				</div>
				<div className="flex items-center justify-end gap-3 mt-5">
					<Button
						onClick={() => {
							setErrors?.({ color: false, size: false });
							setIsOpen(false);
						}}
						className="bg-transparent hover:bg-gray-50 outline-none text-gray-500 w-24 h-8 md:h-10 md:w-40 py-0.5"
					>
						Trở lại
					</Button>
					<Button
						onClick={handleConfirm}
						className="bg-blue-500 hover:bg-blue-600 outline-none w-24 h-8 md:h-10 md:w-40 py-0.5"
					>
						Xác nhận
					</Button>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default Attribute;
