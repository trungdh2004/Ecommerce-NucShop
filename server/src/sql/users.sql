CREATE TABLE UsersCustomers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,  -- ID chính của bảng (tự động tăng)
    full_name VARCHAR(255),  -- Tên đầy đủ của người dùng
    point INT DEFAULT 0,  -- Điểm của người dùng (mặc định là 0)
    email VARCHAR(255) NOT NULL UNIQUE,  -- Email của người dùng (duy nhất)
    password VARCHAR(255),  -- Mật khẩu (tối thiểu 6 ký tự)
    provider VARCHAR(255) DEFAULT 'credential',  -- Nhà cung cấp phương thức đăng nhập
    uid VARCHAR(255) DEFAULT NULL,  -- ID người dùng ngoài hệ thống (nếu có)
    avatarUrl VARCHAR(2083) DEFAULT 'https://res.cloudinary.com/dundmo7q8/image/upload/v1731318978/shopApp/gfxxbr0uaqcdsherufbd.jpg',  -- URL ảnh đại diện
    phone VARCHAR(255),  -- Số điện thoại
    birthDay VARCHAR(255),  -- Ngày sinh
    bio TEXT,  -- Tiểu sử
    is_admin BOOLEAN DEFAULT FALSE,  -- Kiểm tra người dùng có phải là admin không
    is_staff BOOLEAN DEFAULT FALSE,  -- Kiểm tra người dùng có phải là nhân viên không
    blocked_at BOOLEAN DEFAULT FALSE,  -- Trạng thái bị khóa
    comment_blocked_at BOOLEAN DEFAULT FALSE,  -- Trạng thái bị khóa bình luận
    is_shipper BOOLEAN DEFAULT FALSE,  -- Kiểm tra người dùng có phải là shipper không
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Thời gian tạo bản ghi
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  -- Thời gian cập nhật bản ghi
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
