CREATE TABLE Category (
    id INT AUTO_INCREMENT PRIMARY KEY, -- ID tự động tăng
    name VARCHAR(255) NOT NULL, -- Tên danh mục
    description TEXT DEFAULT NULL, -- Mô tả danh mục
    slug VARCHAR(255) UNIQUE, -- Slug duy nhất
    thumbnail VARCHAR(255) NOT NULL, -- Đường dẫn ảnh đại diện
    deleted BOOLEAN DEFAULT FALSE, -- Trạng thái đã bị xóa
    active BOOLEAN DEFAULT FALSE, -- Trạng thái hoạt động
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Thời gian cập nhật
);
