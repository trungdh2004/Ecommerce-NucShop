import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

interface ShowImageState {
	src: string;
	left: number;
	top: number;
	width: number;
	height: number;
	opacity: number;
}

const useCartAnimation = () => {
	const [showImage, setShowImage] = useState<ShowImageState>({
		src: "",
		left: 0,
		top: 0,
		width: 200,
		height: 200,
		opacity: 1,
	});
	const [isAnimating, setIsAnimating] = useState<boolean>(false);
	const startAnimation = useCallback((item: HTMLDivElement, imgSrc: string) => {
		const cartElement = document.querySelector("#cartHeader");
		if (!cartElement) return;

		const itemRect = item.getBoundingClientRect();
		// const cartRect = cartElement.getBoundingClientRect();

		setShowImage({
			src: imgSrc,
			left: itemRect.left,
			top: itemRect.top,
			width: itemRect.width,
			height: itemRect.height,
			opacity: 1,
		});
		setIsAnimating(true);

		setTimeout(() => {
			setIsAnimating(false);
		}, 1100);
	}, []);

	const RenderAnimation = useCallback(() => {
		const cartElement = document.querySelector("#cartHeader");
		if (!isAnimating || !cartElement) return null;

		const cartRect = cartElement.getBoundingClientRect();

		return (
			<motion.div
				initial={{
					left: showImage.left,
					top: showImage.top,
					width: showImage.width,
					height: showImage.height,
					opacity: 1,
				}}
				animate={{
					left: cartRect.left,
					top: cartRect.top,
					width: 20,
					opacity: 0,
				}}
				transition={{ duration: 0.8, ease: "easeInOut" }}
				style={{
					position: "fixed",
					zIndex: 1000,
					overflow: "hidden",
				}}
			>
				<img src={showImage.src} alt="Animation" style={{ width: "100%" }} />
			</motion.div>
		);
	}, [isAnimating, showImage]);

	useEffect(() => {
		const handleResize = () => {
			setIsAnimating(false);
		};

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return {
		startAnimation,
		RenderAnimation,
	};
};

export default useCartAnimation;
