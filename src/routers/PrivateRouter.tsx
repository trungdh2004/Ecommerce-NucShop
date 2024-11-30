import { useAuth } from "@/hooks/auth";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
type PrivateRouterType = {
	children: ReactNode;
};
const PrivateRouter = ({ children }: PrivateRouterType) => {
	//
	const { authUser, isLoggedIn } = useAuth();
	if (!isLoggedIn) {
		return <Navigate to={"/auth/login"} />;
	}
	if (!authUser?.is_admin && !authUser?.is_staff) {
		return <Navigate to={"/"} />;
	}
	return isLoggedIn && children;
};

export default PrivateRouter;
