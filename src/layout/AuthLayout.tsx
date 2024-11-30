import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
	return (
		<div className="fixed inset-0">
			{/*  */}

			<Outlet />
		</div>
	);
};

export default AuthLayout;
