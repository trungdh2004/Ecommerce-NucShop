-- Create Category table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS Category (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,       -- Primary key
    name VARCHAR(255) NOT NULL,                        -- Category name
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    -- Timestamp for creation
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Timestamp for update
) ENGINE=InnoDB;

-- Create productmain table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS productmain (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,       -- Product ID
    name VARCHAR(255) NOT NULL,                        -- Product name
    price DECIMAL(10, 2) NOT NULL,                     -- Price
    discount DECIMAL(10, 2) NOT NULL,                  -- Discount
    description TEXT NOT NULL,                         -- Product description
    thumbnail VARCHAR(255) NOT NULL,                   -- Thumbnail URL
    slug VARCHAR(255) UNIQUE NOT NULL,                 -- Slug (unique)
    is_deleted BOOLEAN DEFAULT FALSE,                  -- Deletion status
    is_simple BOOLEAN DEFAULT FALSE,                   -- Simple product flag
    is_hot BOOLEAN DEFAULT FALSE,                      -- Hot product flag
    category_id INT UNSIGNED NOT NULL,                 -- Foreign key to Category
    quantitySold INT DEFAULT 0,                        -- Quantity sold
    quantity INT DEFAULT 0,                            -- Quantity in stock
    isSpecial BOOLEAN DEFAULT FALSE,                   -- Special product flag
    rating DECIMAL(3, 2) DEFAULT 0,                    -- Rating
    ratingCount INT DEFAULT 0,                         -- Rating count
    ratingQuantity INT DEFAULT 0,                      -- Rating quantity
    viewCount INT DEFAULT 0,                           -- View count
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    -- Created at
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Updated at
    
    -- Foreign Key Constraint
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES Category(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Optional: Create an index on the category_id to optimize queries
CREATE INDEX idx_category_id ON productmain(category_id);
