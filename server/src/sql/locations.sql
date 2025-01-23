CREATE TABLE Locations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY, -- ID chính của bảng (tự động tăng)
    longitude DECIMAL(10, 6) NOT NULL, -- Kinh độ của vị trí (kiểu số với độ chính xác cao)
    lat DECIMAL(10, 6) NOT NULL, -- Vĩ độ của vị trí (kiểu số với độ chính xác cao)
    name VARCHAR(255) DEFAULT 'Nuc Shop', -- Tên vị trí (mặc định là 'Nuc Shop')
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo bản ghi
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Thời gian cập nhật bản ghi
) ENGINE=InnoDB;
