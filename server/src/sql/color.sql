CREATE TABLE Color (
    id INT AUTO_INCREMENT PRIMARY KEY, -- ID tự động tăng
    name VARCHAR(255) NOT NULL, -- Tên màu
    code VARCHAR(50) NOT NULL, -- Mã màu
    slug VARCHAR(255) UNIQUE, -- Slug duy nhất
    deleted BOOLEAN DEFAULT FALSE, -- Trạng thái đã xóa
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Thời gian cập nhật
);
