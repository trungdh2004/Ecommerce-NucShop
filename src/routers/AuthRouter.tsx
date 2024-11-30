import AuthLayout from "@/layout/AuthLayout";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

const AuthRouter = [
	{
		path: "/auth",
		element: <AuthLayout />,
		children: [
			{
				path: "login",
				element: <Login />,
			},
			{ path: "register", element: <Register /> },
			{
				path: "forgot-password",
				element: <ForgotPassword />,
			},
		],
	},
];
export default AuthRouter;
