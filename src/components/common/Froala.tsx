import { uploadFileService } from "@/service/upload";
import { useProcessBarLoadingEventNone } from "@/store/useSidebarAdmin";
import { AxiosError } from "axios";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/js/languages/es";
import "froala-editor/js/plugins.pkgd.min.js";
import Froala from "react-froala-wysiwyg";
import { toast } from "sonner";

type FroalaEditorType = {
	content: string;
	onChangeContext: (value: string) => void;
	props?: any;
};
const FroalaEditor = ({
	content,
	onChangeContext,
	props,
}: FroalaEditorType) => {
	const { setOpenProcessLoadingEventNone, setCloseProcessLoadingEventNone } =
		useProcessBarLoadingEventNone();
	const froalaEditorConfig = {
		attribution: false,
		quickInsertEnabled: false,
		imageDefaultWidth: 0,
		imageResizeWithPercent: true,
		imageMultipleStyles: false,
		imageOutputSize: true,
		imageRoundPercent: true,
		fontFamilySelection: true,
		imageMaxSize: 1024 * 1024 * 2.5,
		imageEditButtons: [
			"imageReplace",
			"imageAlign",
			"imageRemove",
			"imageSize",
			"-",
			"imageLink",
			"linkOpen",
			"linkEdit",
			"linkRemove",
		],
		imageInsertButtons: ["imageBack", "|", "imageUpload"],
		placeholderText: "Nội dung của bạn ở đây!",
		colorsStep: 5,
		colorsText: [
			"#000000",
			"#2C2E2F",
			"#6C7378",
			"#FFFFFF",
			"#009CDE",
			"#003087",
			"#FF9600",
			"#00CF92",
			"#DE0063",
			"#640487",
			"REMOVE",
		],

		colorsBackground: [
			"#000000",
			"#2C2E2F",
			"#6C7378",
			"#FFFFFF",
			"#009CDE",
			"#003087",
			"#FF9600",
			"#00CF92",
			"#DE0063",
			"#640487",
			"REMOVE",
		],
		toolbarButtons: {
			moreText: {
				buttons: [
					"paragraphFormat",
					"|",
					"fontSize",
					"fontFamily",
					"textColor",
					"backgroundColor",
					"insertImage",
					"alignLeft",
					"alignRight",
					"alignJustify",
					"formatOL",
					"formatUL",
					"indent",
					"outdent",
					"emoticons",
				],
				buttonsVisible: 6,
			},
			moreRich: {
				buttons: [
					"|",
					"bold",
					"italic",
					"underline",
					"insertHR",
					"insertLink",
					"insertTable",
				],
				name: "additionals",
				buttonsVisible: 3,
			},
			dummySection: {
				buttons: ["|"],
			},
			moreMisc: {
				buttons: ["|", "undo", "redo", "help", "|"],
				align: "right",
				buttonsVisible: 2,
			},
		},
		tableEditButtons: [
			"tableHeader",
			"tableRemove",
			"tableRows",
			"tableColumns",
			"tableStyle",
			"-",
			"tableCells",
			"tableCellBackground",
			"tableCellVerticalAlign",
			"tableCellHorizontalAlign",
		],
		tableStyles: {
			grayTableBorder: "Gray Table Border",
			blackTableBorder: "Black Table Border",
			noTableBorder: "No Table Border",
		},
		toolbarSticky: true,
		pluginsEnabled: [
			"align",
			"colors",
			"entities",
			"fontSize",
			"help",
			"image",
			"link",
			"lists",
			"paragraphFormat",
			"paragraphStyle",
			"save",
			"table",
			"wordPaste",
		],
		imageAllowedTypes: ["jpeg", "jpg", "png"], // định dạng file
		events: {
			"image.beforeUpload": function (this: any, images: File[]): boolean {
				const editor = this;
				// editor.image.showProgressBar(0);
				setOpenProcessLoadingEventNone();
				const formData = new FormData();
				formData.append("image", images[0]);

				uploadFileService(formData)
					.then((response: any) => {
						editor.image.insert(
							response.data.path,
							null,
							null,
							editor.image.get(),
						);
						// editor.image.hideProgressBar();
						setCloseProcessLoadingEventNone();
					})
					.catch((error) => {
						if (error instanceof AxiosError) {
							toast.error(error.response?.data?.error || "Upload ảnh thất bại");
						}
						// editor.image.hideProgressBar();
						setCloseProcessLoadingEventNone();
						// Xử lý lỗi ở đây
					});

				return false;
			},
			"image.inserted": function (this: any, $img: any, response: any): void {
				// Không cần làm gì ở đây
			},
		},
	};
	return (
		<div className="z-0">
			<Froala
				model={content}
				onModelChange={onChangeContext}
				tag="textarea"
				config={{ ...froalaEditorConfig, ...props }}
			></Froala>
		</div>
	);
};

export default FroalaEditor;
