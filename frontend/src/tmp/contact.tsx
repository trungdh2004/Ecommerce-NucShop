import React, { useState } from "react";

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    interaction: "Hỗ trợ",
    content: "",
    terms: false,
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value, // Sửa lỗi xử lý checkbox
    }));
  };

  const validateForm = () => {
    const newErrors: string[] = [];
    if (!formData.name.trim()) newErrors.push("Họ tên không được để trống.");
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.push("Email không hợp lệ.");
    if (!formData.content.trim()) newErrors.push("Nội dung không được để trống.");
    if (!formData.terms) newErrors.push("Bạn phải đồng ý với các điều khoản.");
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Gửi thông tin thành công!");
      console.log("Dữ liệu gửi đi:", formData);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-700 to-pink-500 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-purple-800 mb-6">
          Liên Hệ Chúng Tôi
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Đừng lo lắng! Chúng tôi sẵn sàng hỗ trợ bạn 24/7/365.
        </p>
        {errors.length > 0 && (
          <div className="mb-4 p-4 border border-red-400 bg-red-100 rounded">
            <ul className="text-red-600">
              {errors.map((error, index) => (
                <li key={index}>- {error}</li>
              ))}
            </ul>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
              Họ Tên
            </label>
            <input
              className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              id="name"
              type="text"
              placeholder="Nhập họ tên của bạn"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              id="email"
              type="email"
              placeholder="Nhập email của bạn"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="subject">
              Chủ đề
            </label>
            <input
              className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              id="subject"
              type="text"
              placeholder="Nhập chủ đề"
              value={formData.subject}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="interaction">
              Chọn tương tác
            </label>
            <select
              className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              id="interaction"
              value={formData.interaction}
              onChange={handleChange}
            >
              <option>Hỗ trợ</option>
              <option>Tư vấn</option>
              <option>Phản hồi</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="content">
              Nội dung
            </label>
            <textarea
              className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              id="content"
              rows={4}
              placeholder="Nhập nội dung cần liên hệ"
              value={formData.content}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="flex items-center mb-4">
            <input
              className="mr-2"
              type="checkbox"
              id="terms"
              checked={formData.terms}
              onChange={handleChange}
            />
            <label className="text-gray-700 text-sm" htmlFor="terms">
              Tôi đã đọc và đồng ý với các điều khoản bảo mật thông tin
            </label>
          </div>

          <div className="flex justify-between">
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              type="submit"
            >
              Gửi đi
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              type="reset"
              onClick={() => setFormData({
                name: "",
                email: "",
                subject: "",
                interaction: "Hỗ trợ",
                content: "",
                terms: false,
              })}
            >
              Đặt lại
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;

