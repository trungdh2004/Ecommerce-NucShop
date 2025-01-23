CREATE TABLE IF NOT EXISTS Size (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,         -- Auto-incrementing primary key
    name VARCHAR(255) NOT NULL,                          -- Size name (VARCHAR)
    fromHeight DECIMAL(5, 2) NOT NULL,                   -- Minimum height (DECIMAL)
    toHeight DECIMAL(5, 2) NOT NULL,                     -- Maximum height (DECIMAL)
    fromWeight DECIMAL(5, 2) NOT NULL,                   -- Minimum weight (DECIMAL)
    toWeight DECIMAL(5, 2) NOT NULL,                     -- Maximum weight (DECIMAL)
    slug VARCHAR(255) UNIQUE NOT NULL,                   -- Unique slug for the size
    deleted BOOLEAN DEFAULT FALSE,                       -- Deleted flag (BOOLEAN, default: FALSE)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,      -- Timestamp for creation
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Timestamp for updates

    -- Index to improve query performance for the slug field
    INDEX (slug)
) ENGINE=InnoDB;
