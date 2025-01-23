CREATE TABLE Conversations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY, -- ID chính của bảng
    user_id BIGINT NOT NULL, -- Khóa ngoại tham chiếu đến bảng Users
    lastContent TEXT DEFAULT NULL, -- Nội dung cuối cùng trong cuộc trò chuyện
    lastSender ENUM('USER', 'ADMIN') DEFAULT NULL, -- Người gửi cuối cùng (USER hoặc ADMIN)
    lastMessage DATETIME DEFAULT NULL, -- Thời gian của tin nhắn cuối cùng
    lastRead ENUM('ADMIN', 'USER') DEFAULT NULL, -- Trạng thái đọc tin nhắn cuối của ADMIN hoặc USER
    status BOOLEAN DEFAULT FALSE, -- Trạng thái cuộc trò chuyện (false = không hoạt động, true = hoạt động)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo cuộc trò chuyện
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Thời gian cập nhật cuộc trò chuyện
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE, -- Khóa ngoại tham chiếu đến bảng Users
    UNIQUE (user_id) -- Đảm bảo mỗi người dùng chỉ có một cuộc trò chuyện
) ENGINE=InnoDB;
