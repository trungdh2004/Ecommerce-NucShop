CREATE TABLE Comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY, -- ID chính của bảng (tự động tăng)
    content TEXT NOT NULL, -- Nội dung của bình luận
    user_id BIGINT NOT NULL, -- Tham chiếu đến người dùng (thông qua khóa ngoại)
    comment_type VARCHAR(255), -- Loại bình luận (ví dụ: bình luận sản phẩm, bài viết, v.v.)
    comment_id BIGINT NOT NULL, -- ID của bình luận gốc (để tạo chuỗi bình luận)
    parent_id BIGINT DEFAULT NULL, -- ID của bình luận mẹ (nếu là phản hồi, NULL nếu không có)
    replies JSON DEFAULT NULL, -- Câu trả lời (Lưu dưới dạng JSON để lưu trữ thông tin của các câu trả lời)
    replies_count INT DEFAULT 0, -- Số lượng câu trả lời
    reactions JSON DEFAULT NULL, -- Những người thích (Lưu dưới dạng JSON với các ID người dùng)
    reactions_count INT DEFAULT 0, -- Số lượng người thích
    is_removed BOOLEAN DEFAULT FALSE, -- Trạng thái bị xóa (nếu có)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo bản ghi
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Thời gian cập nhật bản ghi
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE, -- Khóa ngoại tham chiếu đến bảng `Users`
    FOREIGN KEY (comment_id) REFERENCES Comments(id) ON DELETE CASCADE -- Khóa ngoại tham chiếu đến chính bảng `Comments` (cho các câu trả lời)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
