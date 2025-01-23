CREATE TABLE Shippers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY, -- ID chính của bảng (tự động tăng)
    user_id BIGINT NOT NULL, -- Tham chiếu đến người dùng (thông qua khóa ngoại)
    full_name VARCHAR(255) NOT NULL, -- Tên đầy đủ của shipper
    birth_date VARCHAR(255) NOT NULL, -- Ngày sinh của shipper
    id_citizen VARCHAR(12) NOT NULL, -- CMND/CCCD của shipper (tối đa 12 ký tự)
    avatar VARCHAR(2083) NOT NULL, -- URL ảnh đại diện của shipper
    phone VARCHAR(255) NOT NULL, -- Số điện thoại của shipper
    is_block BOOLEAN DEFAULT FALSE, -- Trạng thái khóa shipper
    active BOOLEAN DEFAULT FALSE, -- Trạng thái hoạt động
    block_at DATETIME DEFAULT NULL, -- Thời gian bị khóa (nếu có)
    total_income DECIMAL(10, 2) DEFAULT 0, -- Thu nhập tổng của shipper
    city_name VARCHAR(255) NOT NULL, -- Tên thành phố
    city_id_province VARCHAR(255) NOT NULL, -- ID tỉnh/thành phố của thành phố
    district_name VARCHAR(255) NOT NULL, -- Tên quận/huyện
    district_id_province VARCHAR(255) NOT NULL, -- ID tỉnh/thành phố của quận/huyện
    district_id_district VARCHAR(255) NOT NULL, -- ID quận/huyện
    commune_name VARCHAR(255) NOT NULL, -- Tên xã/phường
    commune_id_commune VARCHAR(255) NOT NULL, -- ID xã/phường
    commune_id_district VARCHAR(255) NOT NULL, -- ID quận/huyện của xã/phường
    address VARCHAR(255) NOT NULL, -- Địa chỉ cụ thể của shipper
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo bản ghi
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Thời gian cập nhật bản ghi
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE -- Khóa ngoại tham chiếu đến bảng Users
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
