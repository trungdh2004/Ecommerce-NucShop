import { useAuth } from "@/hooks/auth";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
type ProtectedRouterType = {
	children: ReactNode;
};
const ProtectedRouter = ({ children }: ProtectedRouterType) => {
	const { isLoggedIn } = useAuth();
	return isLoggedIn ? children : <Navigate to={"/auth/login"} />;
};

export default ProtectedRouter;
