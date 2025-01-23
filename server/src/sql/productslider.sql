CREATE TABLE IF NOT EXISTS ProductSlider (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,        -- Auto-incremented ID for the slider entry
    title VARCHAR(255) NOT NULL,                        -- Slider title
    label VARCHAR(255) NOT NULL,                        -- Slider label
    `index` INT DEFAULT 0,                              -- Slider index (default: 0)
    colorCode VARCHAR(255) NOT NULL,                    -- Color code
    thumbnail VARCHAR(255) DEFAULT "",                  -- Thumbnail URL (default: empty string)
    product_id INT UNSIGNED NOT NULL,                   -- Foreign key to Product
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,     -- Created at timestamp
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Updated at timestamp

    -- Foreign Key Constraint
    CONSTRAINT fk_product_slider_product FOREIGN KEY (product_id) REFERENCES Product(id) ON DELETE CASCADE
) ENGINE=InnoDB;
