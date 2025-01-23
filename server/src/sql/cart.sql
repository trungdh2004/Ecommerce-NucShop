CREATE TABLE User (
    id CHAR(36) NOT NULL PRIMARY KEY, -- Use CHAR(36) for UUID storage
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Timestamp for creation
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL -- Timestamp for updates
) ENGINE=InnoDB;

CREATE TABLE Cart (
    id CHAR(36) NOT NULL PRIMARY KEY, -- Use CHAR(36) for UUID storage
    user_id CHAR(36) NOT NULL UNIQUE, -- Each user can have only one cart
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Timestamp for creation
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL, -- Timestamp for updates
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE -- Foreign key constraint
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
