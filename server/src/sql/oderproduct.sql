CREATE TABLE OrderItems (
    id BIGINT AUTO_INCREMENT PRIMARY KEY, -- ID chính của bảng (tự động tăng)
    product_id BIGINT NOT NULL, -- Tham chiếu đến sản phẩm trong bảng `Product`
    status INT DEFAULT 1, -- Trạng thái sản phẩm trong đơn hàng
    price DECIMAL(10, 2) NOT NULL, -- Giá của sản phẩm
    quantity INT DEFAULT 0, -- Số lượng sản phẩm trong đơn hàng
    total_money DECIMAL(10, 2) DEFAULT 0, -- Tổng tiền cho sản phẩm trong đơn hàng
    attribute_id BIGINT DEFAULT NULL, -- Tham chiếu đến bảng `Attribute` (nếu có)
    variant VARCHAR(255) NOT NULL, -- Biến thể của sản phẩm (ví dụ: size, màu sắc)
    is_simple BOOLEAN DEFAULT FALSE, -- Kiểm tra sản phẩm có phải là sản phẩm đơn giản không
    is_evaluate BOOLEAN DEFAULT FALSE, -- Kiểm tra sản phẩm có được đánh giá hay không
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo bản ghi
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Thời gian cập nhật bản ghi
    FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE, -- Khóa ngoại tham chiếu đến bảng `Products`
    FOREIGN KEY (attribute_id) REFERENCES Attributes(id) ON DELETE SET NULL -- Khóa ngoại tham chiếu đến bảng `Attributes`
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
