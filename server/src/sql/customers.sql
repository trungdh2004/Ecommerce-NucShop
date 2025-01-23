CREATE TABLE Customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY, -- ID chính của bảng (tự động tăng)
    user_id BIGINT NOT NULL, -- Khóa ngoại tham chiếu đến bảng Users
    totalMoney DECIMAL(15, 2) DEFAULT 0, -- Tổng tiền đã chi của khách hàng
    totalOrder INT DEFAULT 0, -- Tổng số đơn hàng đã đặt
    totalOrderSuccess INT DEFAULT 0, -- Tổng số đơn hàng thành công
    totalProductSuccess INT DEFAULT 0, -- Tổng số sản phẩm thành công
    totalOrderCancel INT DEFAULT 0, -- Tổng số đơn hàng bị hủy
    rank INT DEFAULT 0, -- Xếp hạng của khách hàng
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo bản ghi
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Thời gian cập nhật bản ghi
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE, -- Khóa ngoại tham chiếu đến bảng Users
    UNIQUE (user_id) -- Đảm bảo mỗi khách hàng chỉ có một bản ghi trong bảng Customers
) ENGINE=InnoDB;
