import React from "react";

const ContactUs: React.FC = () => {
	return (
		<div className="bg-gray-100 min-h-screen flex">
			{/* Left Side (Decorative area) */}
			<div className="w-1/2 bg-white flex items-center justify-center">
				<div className="p-10">
					<div className="border-b border-gray-200 pb-8">
						<h2 className="text-gray-800 font-semibold text-xl mb-6">
							Contact Us
						</h2>
						<p className="text-gray-600">
							Contact us for a quote, help or to join the team.
						</p>
					</div>
					<div className="mt-8">
						<h3 className="text-gray-800 font-medium text-lg">Address</h3>
						<p className="text-gray-600">2713 Lowe Haven</p>
						<h3 className="text-gray-800 font-medium text-lg mt-4">Email</h3>
						<p className="text-gray-600">hi@studio.com</p>
						<h3 className="text-gray-800 font-medium text-lg mt-4">Phone</h3>
						<p className="text-gray-600">071-246-3165</p>
					</div>
				</div>
			</div>

			{/* Right Side (Contact Form) */}
			<div className="w-1/2 bg-white p-10 flex flex-col">
				<h2 className="text-2xl font-semibold mb-6">Get a quote</h2>
				<form action="#" method="POST" className="space-y-6">
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-medium text-gray-700"
						>
							Name
						</label>
						<input
							type="text"
							id="name"
							name="name"
							placeholder="Your name"
							className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:border-gray-500"
						/>
					</div>
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700"
						>
							Email
						</label>
						<input
							type="email"
							id="email"
							name="email"
							placeholder="Your email"
							className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:border-gray-500"
						/>
					</div>
					<div>
						<label
							htmlFor="message"
							className="block text-sm font-medium text-gray-700"
						>
							Message
						</label>
						<textarea
							id="message"
							name="message"
							rows={4}
							placeholder="Your message"
							className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:border-gray-500"
						></textarea>
					</div>
					<button
						type="submit"
						className="bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none"
					>
						Send Message
					</button>
				</form>
				<div className="mt-8">
					<h3 className="text-lg font-medium mb-4">Follow us</h3>
					<div className="flex space-x-4">
						<a href="#" className="text-gray-600">
							Facebook
						</a>
						<a href="#" className="text-gray-600">
							Twitter
						</a>
						<a href="#" className="text-gray-600">
							Instagram
						</a>
						<a href="#" className="text-gray-600">
							LinkedIn
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ContactUs;
