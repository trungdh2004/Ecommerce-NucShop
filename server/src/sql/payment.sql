CREATE TABLE Payment (
    id INT AUTO_INCREMENT PRIMARY KEY, -- ID tự động tăng
    user_id CHAR(36) NOT NULL, -- UUID của User
    method TINYINT NOT NULL, -- 1: vnpay, 2: momo
    card_type VARCHAR(255), -- Loại thẻ
    bank_code VARCHAR(255), -- Mã ngân hàng
    code_order VARCHAR(255) NOT NULL, -- Mã đơn hàng
    transaction_id VARCHAR(255) UNIQUE, -- Mã giao dịch (duy nhất)
    amount VARCHAR(255) NOT NULL, -- Số tiền
    payment_date VARCHAR(255), -- Ngày thanh toán
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Thời gian cập nhật
);

-- Ràng buộc ngoại khóa nếu bảng User đã tồn tại
ALTER TABLE Payment
ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES User(id);

-- Đảm bảo phương thức thanh toán chỉ chứa giá trị 1 hoặc 2
CREATE TRIGGER validate_method BEFORE INSERT ON Payment
FOR EACH ROW
BEGIN
    IF NEW.method NOT IN (1, 2) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid payment method. Allowed values: 1 (vnpay), 2 (momo)';
    END IF;
END;
