const LoadingFixed = () => {
	return (
		<div className="fixed inset-0 bg-white flex items-center justify-center">
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

export default LoadingFixed;
