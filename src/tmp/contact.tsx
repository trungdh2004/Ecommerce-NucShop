import React from 'react';

const ContactForm: React.FC = () => {
    return (
        <div className="bg-gradient-to-r from-purple-700 to-pink-500 min-h-screen flex items-center justify-center">
            <div className="w-full h-full max-w-lg bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold text-center text-purple-800 mb-6">Liên Hệ Chúng Tôi</h1>
                <p className="text-center text-gray-600 mb-6">Đừng lo lắng! chúng tôi sẵn sàng hỗ trợ bạn 24/7/365.</p>
                <form>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="name">Họ Tên</label>
                        <input className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Nhập họ tên của bạn" />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="email">Email</label>
                        <input className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Nhập email của bạn" />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="subject">Chủ đề</label>
                        <input className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="subject" type="text" placeholder="Nhập chủ đề" />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="interaction">Chọn tương tác</label>
                        <select className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="interaction">
                            <option>Hỗ trợ</option>
                            <option>Tư vấn</option>
                            <option>Phản hồi</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="content">Nội dung</label>
                        <textarea className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="content" rows={4} placeholder="Nhập nội dung cần liên hệ"></textarea>
                    </div>

                    <div className="flex items-center mb-4">
                        <input className="mr-2 leading-tight" type="checkbox" id="terms" />
                        <label className="text-gray-700 text-sm" htmlFor="terms">Tôi đã đọc và đồng ý với các điều khoản bảo mật thông tin</label>
                    </div>
                    <div className="flex justify-between">
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                            Gửi đi
                        </button>
                        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="reset">
                            Đặt lại
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactForm;