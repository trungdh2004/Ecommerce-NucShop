import React from "react";

const ContactPage: React.FC = () => {
	return (
		<div className="bg-green-500 h-screen flex items-center justify-center">
			{/* Main container */}
			<div className="bg-gray-900 text-white w-full max-w-4xl rounded-lg shadow-lg flex overflow-hidden">
				{/* Sidebar */}
				<div className="w-1/4 bg-gray-800 p-4 space-y-4">
					<button className="text-white text-2xl">&times;</button>
					<nav className="space-y-3 mt-6">
						<a href="#" className="block text-gray-400 hover:text-white">
							Create a website
						</a>
						<a href="#" className="block text-gray-400 hover:text-white">
							Web site
						</a>
						<a href="#" className="block text-gray-400 hover:text-white">
							Mobile app
						</a>
						<a
							href="#"
							className="block text-green-500 bg-green-600 px-3 py-1 rounded"
						>
							Domain
						</a>
						<a href="#" className="block text-gray-400 hover:text-white">
							Hosting
						</a>
						<a href="#" className="block text-gray-400 hover:text-white">
							Reseller
						</a>
						<a href="#" className="block text-gray-400 hover:text-white">
							VPS
						</a>
						<a href="#" className="block text-gray-400 hover:text-white">
							Server
						</a>
						<a href="#" className="block text-gray-400 hover:text-white">
							Portfolio
						</a>
						<a href="#" className="block text-gray-400 hover:text-white">
							Clients
						</a>
						<a href="#" className="block text-gray-400 hover:text-white">
							News
						</a>
						<a href="#" className="block text-gray-400 hover:text-white">
							Career
						</a>
					</nav>
					<div className="mt-auto">
						<p className="text-gray-500 text-xs">&copy; 2018 Ayxhan Hasnaly</p>
					</div>
				</div>

				{/* Main Content */}
				<div className="w-3/4 p-8">
					<h2 className="text-3xl font-bold mb-4">
						CONTACT <span className="text-green-500">US</span>
					</h2>

					{/* Contact Information and Map */}
					<div className="flex space-x-8 mb-6">
						<div>
							<p>445 Mount Eden Road, Mount Eden, Auckland.</p>
							<p className="mt-2">+994 999-99-99</p>
							<p>+994 888-88-88</p>
							<p>support@say.az</p>
							<p className="mt-4 text-gray-500 text-sm">
								Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima
								natus ea doloremque.
							</p>
						</div>
						<img
							src="https://via.placeholder.com/150x100"
							alt="Map"
							className="rounded-lg shadow-md"
						/>
					</div>

					{/* Login Form */}
					<p className="text-gray-500 mb-4">
						You can log in to the site with your E-mail and password or sign up
					</p>
					<form className="space-y-4">
						<div className="flex space-x-4">
							<input
								type="email"
								placeholder="Email"
								className="w-1/2 p-2 rounded bg-gray-800 border border-gray-700 placeholder-gray-500 focus:outline-none focus:border-green-500"
							/>
							<input
								type="password"
								placeholder="Password"
								className="w-1/2 p-2 rounded bg-gray-800 border border-gray-700 placeholder-gray-500 focus:outline-none focus:border-green-500"
							/>
						</div>
						<button
							type="submit"
							className="bg-green-500 text-white px-6 py-2 rounded font-bold hover:bg-green-600"
						>
							Sign in
						</button>
						<div className="flex justify-between text-sm mt-2">
							<a href="#" className="text-gray-400 hover:text-white">
								Forgot Password
							</a>
							<a href="#" className="text-gray-400 hover:text-white">
								Register
							</a>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ContactPage;
