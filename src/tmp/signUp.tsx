import React from "react";
const SignUp = () => {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 pb-24 m-3 justify-center">
          <div className="w-5 h-5 sm:w-5 sm:h-5 bg-[#9900FF] rounded-full"></div>
          <div className="w-5 h-9 sm:w-5 sm:h-5 bg-[#FF0099] rounded-full "></div>
        </div>
        <div className="w-full max-w-xs sm:max-w-md lg:max-w-lg mx-auto">
          <h1 className="text-center font-medium text-5xl sm:text-4xl lg:text-5xl">Sign Up</h1>
          
          <div className="pt-8">
            <label className="block text-sm sm:text-base">Username</label>
            <input
              type="text"
              className="w-full h-12 sm:h-12 border mt-2 rounded-md mb-6 pl-2 text-sm sm:text-base"
              aria-label="Username"
            />
          </div>
  
          <div className="pt-4">
            <label className="block text-sm sm:text-base">Email</label>
            <input
              type="email"
              className="w-full h-10 sm:h-12 border mt-2 rounded-md mb-6 pl-2 text-sm sm:text-base"
              aria-label="Email"
            />
          </div>
  
          <div className="pt-4">
            <label className="block text-sm sm:text-base">Password</label>
            <input
              type="password"
              className="w-full h-10 sm:h-12 border mt-2 rounded-md mb-10 pl-2 text-sm sm:text-base"
              aria-label="Password"
            />
          </div>
  
          <button
            type="submit"
            className="w-full h-10 sm:h-12 bg-[#9900FF] rounded-full text-white hover:bg-[#9900CC] transition-colors"
            aria-label="Sign Up Button"
          >
            Sign Up
          </button>
        </div>
      </div>
    );
  };
  
  export default SignUp;
  