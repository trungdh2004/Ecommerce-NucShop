const LoadingProvider = () => {
	return (
		<div className="fixed top-0 left-0 right-0 bottom-0 inset-0 bg-neutral-500/30 flex justify-center items-center z-[1000000000]">
			<div className="loadingspinner">
				<div id="square1"></div>
				<div id="square2"></div>
				<div id="square3"></div>
				<div id="square4"></div>
				<div id="square5"></div>
			</div>
		</div>
	);
};

export default LoadingProvider;
