import React, { useState } from "react";

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [originalInfo, setOriginalInfo] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: "Nguyen Van A",
    email: "nguyenvana@example.com",
    phone: "0123456789",
    bio: "Lập trình viên yêu thích công nghệ và khám phá thế giới.",
  });
  const [errors, setErrors] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleEditClick = () => {
    setOriginalInfo(userInfo); // Lưu thông tin cũ
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setUserInfo(originalInfo || userInfo); // Khôi phục thông tin cũ
    setErrors({});
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    if (validateInput()) {
      setIsSaving(true);
      await saveToServer();
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const handlePreviewClick = () => {
    setIsPreviewing(!isPreviewing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Dung lượng ảnh quá lớn. Vui lòng chọn ảnh dưới 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result); // Cập nhật ảnh đại diện
      };
      reader.onerror = () => {
        alert("Không thể tải ảnh. Vui lòng thử lại.");
      };
      reader.readAsDataURL(file);
    } else {
      alert("Vui lòng chọn một tệp ảnh hợp lệ.");
    }
  };

  const validateInput = () => {
    const newErrors = {};
    if (!userInfo.name.trim()) newErrors.name = "Tên không được để trống.";
    if (!userInfo.email.match(/^\S+@\S+\.\S+$/))
      newErrors.email = "Email không hợp lệ.";
    if (!userInfo.phone.match(/^\d{10}$/))
      newErrors.phone = "Số điện thoại phải có 10 chữ số.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveToServer = async () => {
    try {
      console.log("Thông tin đang được lưu:", userInfo);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Mô phỏng lưu
      alert("Thông tin đã được lưu thành công!");
    } catch (error) {
      alert("Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại.");
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">
          Hồ Sơ Cá Nhân
        </h1>
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Ảnh đại diện:</label>
          <div className="flex items-center">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Ảnh đại diện"
                className="w-20 h-20 rounded-full border mr-4"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 mr-4">
                No Image
              </div>
            )}
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {["name", "email", "phone"].map((field) => (
            <div key={field}>
              <label className="block text-gray-600 mb-1 capitalize">
                {field === "phone" ? "Số điện thoại" : field}:
              </label>
              {isEditing ? (
                <>
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={userInfo[field]}
                    onChange={handleChange}
                    placeholder={`Nhập ${field}`}
                    className={`w-full border rounded px-3 py-2 text-sm sm:text-base ${
                      errors[field] ? "border-red-500" : ""
                    }`}
                  />
                  {errors[field] && (
                    <p className="text-red-500 text-sm">{errors[field]}</p>
                  )}
                </>
              ) : (
                <p className="text-lg">{userInfo[field]}</p>
              )}
            </div>
          ))}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3">
            <label className="block text-gray-600 mb-1">Giới thiệu:</label>
            {isEditing ? (
              <textarea
                name="bio"
                value={userInfo.bio}
                onChange={handleChange}
                placeholder="Nhập giới thiệu về bạn"
                className="w-full border rounded px-3 py-2 text-sm sm:text-base"
              />
            ) : (
              <p className="text-lg">{userInfo.bio}</p>
            )}
          </div>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row items-center">
          {isSaving ? (
            <button
              disabled
              className="bg-blue-300 text-white px-4 py-2 rounded cursor-not-allowed"
            >
              Đang lưu...
            </button>
          ) : isEditing ? (
            <>
              <button
                onClick={handleSaveClick}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors mb-2 sm:mb-0 sm:mr-2"
              >
                Lưu Thay Đổi
              </button>
              <button
                onClick={handleCancelClick}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handlePreviewClick}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors sm:ml-2"
              >
                {isPreviewing ? "Ẩn Xem Trước" : "Xem Trước"}
              </button>
            </>
          ) : (
            <button
              onClick={handleEditClick}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Chỉnh Sửa
            </button>
          )}
        </div>
        {isPreviewing && (
          <div className="mt-6 p-4 border rounded bg-gray-50">
            <h2 className="text-xl font-semibold mb-4">Xem Trước:</h2>
            <p>
              <strong>Tên:</strong> {userInfo.name}
            </p>
            <p>
              <strong>Email:</strong> {userInfo.email}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {userInfo.phone}
            </p>
            <p>
              <strong>Giới thiệu:</strong> {userInfo.bio}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
