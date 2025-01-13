import { useAuth } from "@/hooks/auth";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
type PrivateRouterType = {
	children: ReactNode;
};
const PrivateAdmin = ({ children }: PrivateRouterType) => {
	//
	const { authUser, isLoggedIn } = useAuth();
	if (!isLoggedIn) {
		return <Navigate to={"/auth/login"} />;
	}
	if (!authUser?.is_admin) {
		return <Navigate to={"/admin"} />;
	}
	return isLoggedIn && children;
};

export default PrivateAdmin;
