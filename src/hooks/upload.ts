import { uploadFileService, uploadMultipleFileService } from "@/service/upload";
import { ChangeEvent, useState } from "react";

export const useUploadFile = () => {
	const [preview, setPreview] = useState<string>();
	const uploadFile = async (
		file: FileList,
		width?: number,
		height?: number,
	) => {
		if (typeof file === "object") {
			const formData = new FormData();
			formData.append("image", file[0]);
			const { data } = await uploadFileService(formData, width, height);
			return data;
		}
	};
	const setPreviewImage = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const src = URL.createObjectURL(e.target.files?.[0]);
			setPreview(src);
		}
	};
	return {
		preview,
		setPreviewImage,
		uploadFile,
	};
};
export const useMultipleImage = () => {
	const uploadMultipleImage = async (
		files: FileList,
		width?: number,
		height?: number,
	) => {
		if (typeof files === "object") {
			const formData = new FormData();
			for (let i = 0; i < files.length; i++) {
				formData.append("images", files[i]);
			}
			await uploadMultipleFileService(formData, width, height).then(
				({ data }) => {
					return data;
				},
			);
		}
	};
	return { uploadMultipleImage };
};
