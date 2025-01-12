import EmojiModal from "@/components/common/EmojiModal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import he from "he";
import { Remarkable } from "remarkable";

type Props = {
	sizeAvatar?: number;
};
const SendComment = ({ sizeAvatar = 40 }: Props) => {
	const avatarSize = sizeAvatar + "px";
	const [stateValue, setStateValue] = useState("");
	const [isOpen, setIsOpen] = useState({
		actions: false,
		focus: false,
		sendComment: true,
	});
	const elements = useRef<{
		content: null | HTMLElement;
		sendComment: null | HTMLButtonElement;
	}>({
		content: null,
		sendComment: null,
	});

	const updateState = (focus: boolean, contentNotEmpty: boolean) => {
		setIsOpen({
			actions: true,
			focus,
			sendComment: !contentNotEmpty,
		});
	};

	const handleFocusOrChange = () => {
		const content = elements.current.content;
		console.log("n", content);

		console.log("content", content?.textContent);
		console.log("content inner", content?.innerHTML);

		const contentNotEmpty = content && content.innerHTML.trim().length > 0;
		updateState(true, contentNotEmpty as boolean);
	};

	const handleBlur = () => {
		const content = elements.current.content;
		const contentNotEmpty = content && content.innerHTML.trim().length > 0;
		updateState(false, contentNotEmpty as boolean);
	};

	const handleCancel = () => {
		const content = elements.current.content;
		if (content) {
			console.log("he.encode(content.innerHTML)", he.encode(content.innerHTML));

			setStateValue(content.innerHTML);
			content.innerHTML = "";
			setIsOpen({ actions: false, focus: false, sendComment: true });
		}
	};
	const sendComment = () => {
		const content = elements.current.content;
		if (content) {
			content.innerHTML = `${content.innerHTML}&nbsp;&nbsp;`;
			handleFocusOrChange();
		}
	};

	const md = new Remarkable({
		html: true, // Cho phép HTML bên trong Markdown
		xhtmlOut: false, // Xuất ra HTML với các tag tự đóng
		breaks: false, // Tự động ngắt dòng thành <br>
		langPrefix: "language-", // Tiền tố cho class của các khối code
		linkify: true, // Tự động chuyển đổi URL thành liên kết
		typographer: true, // Thay thế các ký tự đặc biệt như quotes, dashes thành kiểu typographic
	});
	return (
		<div>
			<div className="flex items-start gap-3 my-1">
				<div
					className={`w-[${avatarSize}] h-[${avatarSize}] min-w-[${avatarSize}] min-h-[${avatarSize}] max-w-[${avatarSize}] max-h-[${avatarSize}]`}
				>
					<img
						src="https://i.pinimg.com/564x/71/07/3d/71073d78daf2072dc0a785160a530439.jpg"
						alt="User avatar"
						className="w-full h-full object-cover rounded-full"
					/>
				</div>
				<div className="flex-1 flex flex-col items-end gap-3">
					<span
						onBlur={handleBlur}
						onFocus={handleFocusOrChange}
						onInput={handleFocusOrChange}
						ref={(e) => (elements.current.content = e)}
						className={cn(
							"w-full border-b border-gray-200 outline-none break-all transition-all duration-500",
							isOpen.focus && "border-custom",
						)}
						contentEditable
						data-lexical-editor="true"
						data-placeholder="Viết bình luận..."
						role="textbox"
						spellCheck="false"
						tabIndex={0}
					/>

					<div
						className={cn(
							"w-full items-center justify-between gap-3 hidden",
							isOpen.actions && "flex",
						)}
					>
						<div>
							<EmojiModal
								getEmoji={(value) => {
									const content = elements.current.content;
									if (content) {
										content.textContent += value?.native;
										handleFocusOrChange();
									}
								}}
							/>
						</div>
						<div>
							<Button
								onClick={handleCancel}
								className="bg-transparent hover:bg-black/5 text-slate-500 rounded-lg px-5"
							>
								Huỷ
							</Button>
							<Button
								onClick={sendComment}
								disabled={isOpen.sendComment}
								ref={(e) => (elements.current.sendComment = e)}
								className="bg-custom-500 text-white px-5 hover:bg-custom-600"
							>
								Bình luận
							</Button>
						</div>
					</div>
				</div>
			</div>

			<div
				dangerouslySetInnerHTML={{ __html: md.render(stateValue) }}
				className="w-full break-all"
			/>
		</div>
	);
};

export default SendComment;
