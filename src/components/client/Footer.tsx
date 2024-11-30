import React from 'react'
import { MdOutlineMail, MdOutlinePhoneInTalk } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { FaYoutube } from "react-icons/fa6";
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { LogoNucSVG } from '@/assets/svg';
const Footer = () => {
    return (
        <div className="padding mx-auto bg-[#131118] *:text-white">
            <div className='pt-10 grid md:grid-cols-2 lg:grid-cols-4 *:border-b-[1px] *:border-b-white *:mb-5 *:md:border-none' >
                <div className="*:flex *:items-center *:gap-x-3 *:pb-6">
                    <Link to="/" className="text-4xl font-bold hover-text "><LogoNucSVG width={50} color='#fff'/></Link>
                    <a href="#" className="hover-text"><MdOutlinePhoneInTalk className='text-2xl' />1900 1188</a>
                    <a href="#" className="hover-text"><MdOutlineMail className='text-2xl' />duantn@gmail.com</a>
                    <a href="#" className="hover-text"><IoLocationOutline className='text-2xl' />Dị nậu , Thạch Thất , Hà Nội</a>
                </div>
                <div className="*:flex *:items-center *:gap-x-3 *:pb-6 ">
                    <a href="#" className="text-xl font-semibold uppercase hover-text ">Giới thiệu</a>
                    <a href="" className="hover-text">Giới thiệu</a>
                    <a href="" className="hover-text">Blog</a>
                    <a href="" className="hover-text">Hệ thống  của hàng</a>
                    <a href="" className="hover-text">Liên hệ với ....</a>
                    <a href="" className="hover-text">Chính sách bảo mật</a>
                </div>
                <div className="*:flex *:items-center *:gap-x-3 *:pb-6 ">
                    <a href="#" className="text-xl font-semibold uppercase hover-text ">Hỗ trợ khách hàng</a>
                    <a href="" className="hover-text">Hỏi đáp</a>
                    <a href="" className="hover-text">Chính sách phát triển</a>
                    <a href="" className="hover-text">Hướng dẫn chọn kích cỡ</a>
                    <a href="" className="hover-text">Hướng dẫn thanh toán</a>
                    <a href="" className="hover-text">Quy định đổi hàng</a>
                    <a href="" className="hover-text">Hướng dẫn mua hàng</a>
                </div>
                <div className="*:flex *:items-center *:gap-x-5 *:pb-6 ">
                    <a href="#" className="text-xl font-semibold uppercase hover-text ">Kết nối</a>
                    <div className="">
                        <a href="" className="hover-text"><FaYoutube className='text-3xl' /></a>
                        <a href="" className="hover-text"><FaFacebook className='text-3xl' /></a>
                        <a href="" className="hover-text"><FaInstagram className='text-3xl' /></a>
                    </div>
                    <a href="#" className="text-xl font-semibold uppercase hover-text ">Phương thức thanh toán</a>
                    <img src="https://owen.cdn.vccloud.vn/static/version1713241627/frontend/Owen/owen2021/vi_VN/images/pay.png" alt="" />

                </div>
            </div>

            <hr className='hidden md:block' />
            <p className="text-center text-gray-500 md:py-5">@2023 Krist All Right are reserved </p>
        </div >
    )
}

export default Footer