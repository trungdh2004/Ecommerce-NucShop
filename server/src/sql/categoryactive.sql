CREATE TABLE CategoryActive (
    id INT AUTO_INCREMENT PRIMARY KEY, -- ID tự động tăng
    index_value INT DEFAULT 0, -- Thứ tự ưu tiên
    category_id INT NOT NULL, -- Liên kết đến bảng Category
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Thời gian cập nhật
    CONSTRAINT fk_category_active_category FOREIGN KEY (category_id) REFERENCES Category(id) ON DELETE CASCADE
);
