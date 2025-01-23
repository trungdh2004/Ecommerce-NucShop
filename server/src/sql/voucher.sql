CREATE TABLE Voucher (
    id INT AUTO_INCREMENT PRIMARY KEY, -- ID tự động tăng
    name VARCHAR(255) NOT NULL, -- Tên voucher
    description TEXT NOT NULL, -- Mô tả
    code VARCHAR(255) NOT NULL UNIQUE, -- Mã voucher duy nhất
    start_date DATETIME NOT NULL, -- Ngày bắt đầu
    end_date DATETIME NOT NULL, -- Ngày kết thúc
    discount_type TINYINT NOT NULL CHECK (discount_type IN (1, 2)), -- 1: số tiền, 2: phần trăm
    discount_value DECIMAL(10, 2) NOT NULL, -- Giá trị giảm giá
    usage_limit INT NOT NULL DEFAULT 0, -- Giới hạn sử dụng
    minimum_order_value DECIMAL(10, 2) NOT NULL DEFAULT 0, -- Giá trị đơn hàng tối thiểu
    max_amount DECIMAL(10, 2) NOT NULL DEFAULT 0, -- Số tiền giảm tối đa
    usage_count INT DEFAULT 0, -- Số lần sử dụng
    status TINYINT DEFAULT 1 CHECK (status IN (1, 2)), -- 1: Hoạt động, 2: Không hoạt động
    version INT DEFAULT 0, -- Phiên bản
    modified_date DATETIME DEFAULT NULL, -- Ngày chỉnh sửa
    modified_by CHAR(36) DEFAULT NULL, -- Người chỉnh sửa (UUID)
    is_home BOOLEAN DEFAULT FALSE, -- Voucher có hiển thị trên trang chủ không
    type ENUM('1', '2') NOT NULL DEFAULT '1', -- Kiểu voucher (1, 2)
    user_id CHAR(36) NOT NULL, -- Người sở hữu voucher (UUID)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Thời gian cập nhật
);

-- Ràng buộc ngoại khóa với bảng User
ALTER TABLE Voucher
ADD CONSTRAINT fk_voucher_user FOREIGN KEY (user_id) REFERENCES User(id);

-- Bảng liên kết Voucher với Product (nhiều-nhiều)
CREATE TABLE Voucher_Product (
    voucher_id INT NOT NULL,
    product_id INT NOT NULL,
    PRIMARY KEY (voucher_id, product_id),
    FOREIGN KEY (voucher_id) REFERENCES Voucher(id),
    FOREIGN KEY (product_id) REFERENCES Product(id)
);
