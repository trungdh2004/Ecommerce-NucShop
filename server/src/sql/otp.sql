CREATE TABLE Otp (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,  -- ID chính của bảng (tự động tăng)
    userId BIGINT NOT NULL,  -- Tham chiếu đến người dùng (tương ứng với `ObjectId` trong MongoDB)
    email VARCHAR(255) NOT NULL UNIQUE,  -- Địa chỉ email (được chỉ định là duy nhất)
    otp VARCHAR(255) NOT NULL,  -- Mã OTP
    expired DATETIME NOT NULL,  -- Thời gian hết hạn của mã OTP
    completed TINYINT(1) DEFAULT 0,  -- Trạng thái hoàn thành (0: chưa hoàn thành, 1: hoàn thành)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Thời gian tạo bản ghi
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- Thời gian cập nhật bản ghi
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE  -- Khóa ngoại tham chiếu đến bảng `Users`
) ENGINE=InnoDB;
