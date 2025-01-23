-- Ensure the Product and User tables are using InnoDB and the id columns are UNSIGNED
ALTER TABLE Product ENGINE = InnoDB;
ALTER TABLE User ENGINE = InnoDB;

ALTER TABLE Product MODIFY id INT UNSIGNED AUTO_INCREMENT;
ALTER TABLE User MODIFY id INT UNSIGNED AUTO_INCREMENT;

-- Create the Evaluate table with foreign keys
CREATE TABLE IF NOT EXISTS Evaluate (
    id INT AUTO_INCREMENT PRIMARY KEY,              -- ID tự động tăng
    product_id INT UNSIGNED NOT NULL,               -- Liên kết đến bảng Product (UNSIGNED INT)
    rating DECIMAL(3, 1) NOT NULL,                  -- Điểm đánh giá (ví dụ: 4.5)
    user_id INT UNSIGNED NOT NULL,                  -- Liên kết đến bảng User (UNSIGNED INT)
    attribute VARCHAR(255) NOT NULL,                -- Thuộc tính
    content TEXT DEFAULT "",                        -- Nội dung đánh giá
    is_deleted BOOLEAN DEFAULT FALSE,               -- Trạng thái đã xóa
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Thời gian cập nhật

    -- Khóa ngoại
    CONSTRAINT fk_evaluate_product FOREIGN KEY (product_id) REFERENCES Product(id) ON DELETE CASCADE,
    CONSTRAINT fk_evaluate_user FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE
) ENGINE=InnoDB;   -- Make sure the table uses InnoDB engine

-- Create indexes for the foreign key columns
CREATE INDEX idx_product_id ON Evaluate(product_id);
CREATE INDEX idx_user_id ON Evaluate(user_id);
