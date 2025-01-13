import React, { useRef } from "react";
import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import FroalaEditorComponent from "react-froala-wysiwyg";
import Froalaeditor from "froala-editor";
import { useAuth } from "@/hooks/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
type Size = "small" | "medium";
interface CommentEditorProps {
	onSubmit: () => void;
	openComment?: boolean;
	avatar: string;
	handleClose?: () => void;
	content: string;
	handleChange: (content: string) => void;
	handleOpen?: () => void;
	size?: Size;
}

const CommentEditor: React.FC<CommentEditorProps> = ({
	onSubmit,
	openComment = false,
	avatar,
	handleClose,
	content,
	handleChange,
	handleOpen,
	size = "medium",
}) => {
	const editorRef = useRef<FroalaEditorComponent | null>(null);
	const { isLoggedIn } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	Froalaeditor.DefineIcon("insertLink", {
		NAME: "link",
		SVG_KEY: "insertLink",
	});
	Froalaeditor.RegisterCommand("insertLink", {
		title: "Nhập link",
		focus: true,
		undo: true,
		refreshAfterCallback: true,
		callback: function () {
			const url = window.prompt("Nhập link");
			if (url) {
				this.link.insert(url, url, {
					class: "link",
				});
			}
		},
	});
	const config = {
		tableStyles: {
			"no-border": "No border",
		},
		placeholderText: "Nhập bình luận mới của bạn",
		charCounterCount: false,
		toolbarButtons: ["bold", "italic", "underline", "emoticons", "insertLink"],
		lineBreaks: true,
		quickInsertButtons: false,
		selector: {
			useClasses: false,
		},
		pluginsEnabled: false,
		quickInsertTags: null,
	};
	return (
		<div className="">
			<div className="flex items-start w-full gap-1 fr-body md:gap-3">
				<div
					className={cn(
						" rounded-full flex items-center overflow-hidden justify-center bg-white border",
						size == "medium" ? "size-7 md:size-10" : "size-4 md:size-7",
					)}
				>
					<img src={avatar} alt="" className="object-cover w-full h-full" />
				</div>

				{openComment ? (
					<div className="flex-1">
						<FroalaEditor
							tag="textarea"
							config={config}
							model={content}
							onModelChange={handleChange}
							ref={editorRef}
						/>
						<div className="flex justify-end mt-2">
							<button
								className="px-3 py-1 mr-2 text-xs bg-gray-100 border-none rounded-sm cursor-pointer hover:bg-gray-200 sm:text-sm"
								onClick={handleClose}
							>
								HỦY
							</button>
							<button
								className="px-3 py-1 text-xs text-white bg-blue-500 border-none rounded-sm cursor-pointer sm:text-sm hover:bg-blue-600"
								onClick={onSubmit}
							>
								BÌNH LUẬN
							</button>
						</div>
					</div>
				) : (
					<div
						className="flex items-center flex-1 px-2 text-gray-300 border-b rounded-sm cursor-pointer h-7 md:h-8"
						onClick={() => {
							if (!isLoggedIn) {
								const productUrl = location.pathname;
								navigate(
									`/auth/login?product=${encodeURIComponent(productUrl)}`,
								);
								return;
							}
							if (handleOpen) {
								handleOpen();
							}
						}}
					>
						Mời bạn nhập bình luận
					</div>
				)}
			</div>
		</div>
	);
};

export default CommentEditor;
