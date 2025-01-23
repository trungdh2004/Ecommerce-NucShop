CREATE TABLE IF NOT EXISTS Tags (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,  -- ID chính của bảng (tự động tăng)
    name VARCHAR(255) NOT NULL,  -- Tên của tag
    description TEXT NOT NULL,  -- Mô tả của tag
    slug VARCHAR(255) UNIQUE NOT NULL,  -- Slug của tag (được đảm bảo là duy nhất)
    deleted TINYINT(1) DEFAULT 0,  -- Trạng thái xóa (mặc định là chưa xóa), sử dụng TINYINT(1)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Thời gian tạo bản ghi
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- Thời gian cập nhật bản ghi
    INDEX (slug)  -- Tạo chỉ mục cho trường `slug`
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
