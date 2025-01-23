CREATE TABLE RefreshToken (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,  -- ID chính của bảng (tự động tăng)
    userId BIGINT NOT NULL,  -- Tham chiếu đến người dùng (tương ứng với `ObjectId` trong MongoDB)
    token VARCHAR(255) NOT NULL,  -- Mã token làm mới
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Thời gian tạo bản ghi
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- Thời gian cập nhật bản ghi
    UNIQUE (userId),  -- Đảm bảo mỗi người dùng có một token duy nhất
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE  -- Khóa ngoại tham chiếu đến bảng `Users`
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
