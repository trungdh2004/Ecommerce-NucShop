import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

import AdminRouter from "./routers/AdminRouter";
import AuthRouter from "./routers/AuthRouter";
import MainRouter from "./routers/MainRouter";
import ProgessBarLoading from "./components/common/ProgessBarLoading";
import LoadingProvider from "./components/common/LoadingProvider";
import { useLoadingModal } from "./store/useLoadingModal";
import ShipperRouter from "./routers/ShipperRouter";
import OrderRouter from "./routers/OrderRouter";
import ProgessBarLoadingEventNone from "./components/common/ProgessBarLoadingEventNone";
const router = createBrowserRouter([
	...MainRouter,
	...AuthRouter,
	...AdminRouter,
	...ShipperRouter,
	...OrderRouter,
]);
const App = () => {
	const { isOpen } = useLoadingModal();

	return (
		<>
			<ProgessBarLoadingEventNone />
			<ProgessBarLoading />
			<RouterProvider router={router} />
			{isOpen && <LoadingProvider />}
		</>
	);
};
export default App;
