CREATE TABLE NotificationAdmin (
    id BIGINT AUTO_INCREMENT PRIMARY KEY, -- ID chính của bảng (tự động tăng)
    message TEXT NOT NULL, -- Nội dung thông báo
    directId VARCHAR(255) NOT NULL, -- ID liên quan đến thông báo
    type VARCHAR(255) NOT NULL DEFAULT 'APP//ORDER', -- Loại thông báo
    is_delete TINYINT(1) DEFAULT 0, -- Trạng thái xóa (Dùng TINYINT cho kiểu Boolean)
    readOnly JSON DEFAULT NULL, -- Danh sách những người hoặc đối tượng có quyền đọc (Lưu dưới dạng JSON)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo thông báo
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Thời gian cập nhật thông báo
    INDEX (type) -- Tạo chỉ mục cho cột `type` để tăng tốc truy vấn nếu cần
) ENGINE=InnoDB;
