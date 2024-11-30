import React from "react";

const Login = () => {
  return (
    <div className="w-[1120px] m-auto">
      <div className="flex gap-2 pb-24 m-3">
        <div className="w-5 h-5 bg-[#9900FF] rounded-full"></div>
        <div className="w-5 h-9 bg-[#FF0099] rounded-full "></div>
      </div>
      <div className="w-80 h-64 mx-auto">
        <h1 className="text-center font-medium text-5xl">Sign In</h1>
        <h6 className=" pt-8 ">Username</h6>
        <input
          type="text"
          className="w-80 h-12 border mt-5 rounded-md mb-10 pl-2"
        />
    <h6 className="pt-8">Password</h6>
    <input type="password"
    className="border rounded-md w-full h-12 mb-10 pl-2"
    />
        <button
          type="submit"
          className="w-80 h-12 bg-[#9900FF] rounded-full text-white hover:bg-[#9900CC] transition-colors"
        >
          Sign In
        </button>
        <div className="flex ml-[135px] gap-4 mt-6">
      <button className="flex items-center w-12 h-12 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png" alt="Google Logo" className="w-6 h-6 ml-3" />
        <span className="flex-1 text-center"></span>
      </button>
      <button className="flex items-center w-12 h-12 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1024px-Facebook_Logo_%282019%29.png" alt="Facebook Logo" className="w-6 h-6 ml-3" />
        <span className="flex-1 text-center"></span>
      </button>
    </div>
      </div>
    </div>
  );
};

export default Login;
