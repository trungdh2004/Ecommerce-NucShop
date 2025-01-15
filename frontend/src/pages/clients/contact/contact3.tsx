import React from "react";

const ContactForm: React.FC = () => {
	return (
		<div className="bg-teal-500 flex items-center justify-center min-h-screen">
			<div className="bg-teal-400 p-8 rounded-lg shadow-lg w-full max-w-xl text-white">
				<h1 className="text-4xl font-bold mb-4 text-center">CONTACT</h1>
				<p className="text-center mb-8">
					Interested in working together? Fill out the form below with details
					about your project, and I'll get back to you as soon as I can.
				</p>

				<form className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Name Field */}
					<div className="flex items-center bg-teal-300 rounded-md p-2">
						<input
							type="text"
							placeholder="*Name"
							className="w-full bg-transparent p-2 outline-none placeholder-white text-white"
						/>
					</div>

					{/* Email Field */}
					<div className="flex items-center bg-teal-300 rounded-md p-2">
						<input
							type="email"
							placeholder="*Email"
							className="w-full bg-transparent p-2 outline-none placeholder-white text-white"
						/>
					</div>

					{/* Website Field */}
					<div className="flex items-center bg-teal-300 rounded-md p-2">
						<input
							type="text"
							placeholder="Website"
							className="w-full bg-transparent p-2 outline-none placeholder-white text-white"
						/>
					</div>

					{/* Budget Field */}
					<div className="flex items-center bg-teal-300 rounded-md p-2">
						<input
							type="text"
							placeholder="Budget"
							className="w-full bg-transparent p-2 outline-none placeholder-white text-white"
						/>
					</div>

					{/* Timeline Field */}
					<div className="flex items-center bg-teal-300 rounded-md p-2">
						<input
							type="text"
							placeholder="Timeline"
							className="w-full bg-transparent p-2 outline-none placeholder-white text-white"
						/>
					</div>

					{/* Project Description Field */}
					<div className="col-span-1 md:col-span-2">
						<textarea
							placeholder="Tell me a little about your project"
							className="w-full bg-teal-300 rounded-md p-2 h-32 outline-none placeholder-white text-white"
						></textarea>
					</div>

					{/* Submit Button */}
					<div className="col-span-1 md:col-span-2">
						<button
							type="submit"
							className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-md"
						>
							Submit
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ContactForm;
