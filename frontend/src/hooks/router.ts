import { useNavigate, useSearchParams } from "react-router-dom";

export const useRouterHistory = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const handleRouterHistory = () => {
		const routerHistory = searchParams.get("routerHistory");
		if (routerHistory) {
			navigate(routerHistory);
		} else {
			navigate("/");
		}
	};
	return handleRouterHistory;
};
export const useCurrentRouteAndNavigation = () => {
	const navigate = useNavigate();
	const handleCurrentRoute = () => {
		const currentRouter = location.pathname;
		navigate(`/auth/login?routerHistory=${currentRouter}`);
	};
	return handleCurrentRoute;
};
