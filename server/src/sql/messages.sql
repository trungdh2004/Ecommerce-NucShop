CREATE TABLE Messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY, -- ID chính của bảng (tự động tăng)
    conversation_id BIGINT NOT NULL, -- Khóa ngoại tham chiếu đến bảng Conversations
    user_id BIGINT, -- Khóa ngoại tham chiếu đến bảng Users (có thể NULL)
    content TEXT NOT NULL, -- Nội dung tin nhắn
    sender ENUM('USER', 'ADMIN') NOT NULL, -- Người gửi tin nhắn (USER hoặc ADMIN)
    read_status TEXT DEFAULT NULL, -- Trạng thái đọc tin nhắn bởi USER hoặc ADMIN (dạng văn bản, có thể NULL)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo tin nhắn
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Thời gian cập nhật tin nhắn
    FOREIGN KEY (conversation_id) REFERENCES Conversations(id) ON DELETE CASCADE, -- Khóa ngoại tham chiếu đến bảng Conversations
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE SET NULL -- Khóa ngoại tham chiếu đến bảng Users, nếu người dùng bị xóa thì giá trị sẽ được thiết lập là NULL
) ENGINE=InnoDB;
