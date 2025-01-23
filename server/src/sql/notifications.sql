CREATE TABLE Notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY, -- ID chính của bảng (tự động tăng)
    message TEXT NOT NULL, -- Nội dung thông báo
    directType VARCHAR(255) NOT NULL, -- Loại thông báo
    directId VARCHAR(255) NOT NULL, -- ID liên quan đến thông báo
    recipientType ENUM('single', 'all') DEFAULT 'single' NOT NULL, -- Kiểu người nhận (single hoặc all)
    type VARCHAR(255) DEFAULT 'APP//ORDER' NOT NULL, -- Loại thông báo
    thumbnail VARCHAR(2083) DEFAULT NULL, -- Đường dẫn ảnh thu nhỏ của thông báo
    isRead BOOLEAN DEFAULT FALSE, -- Trạng thái đã đọc
    is_delete BOOLEAN DEFAULT FALSE, -- Trạng thái xóa
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo thông báo
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Thời gian cập nhật thông báo
) ENGINE=InnoDB;

-- Bảng phụ để quản lý người nhận thông báo (nhiều-nhiều)
CREATE TABLE NotificationReceivers (
    notification_id BIGINT NOT NULL, -- Tham chiếu đến thông báo
    user_id BIGINT NOT NULL, -- Tham chiếu đến người dùng
    PRIMARY KEY (notification_id, user_id), -- Khóa chính gồm 2 trường
    FOREIGN KEY (notification_id) REFERENCES Notifications(id) ON DELETE CASCADE, -- Khóa ngoại tham chiếu đến bảng Notifications
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE -- Khóa ngoại tham chiếu đến bảng Users
) ENGINE=InnoDB;
