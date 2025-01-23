CREATE TABLE IF NOT EXISTS ProductComing (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,        -- Auto-incremented ID for the product coming entry
    product_id INT UNSIGNED NOT NULL,                   -- Foreign key to Product
    date DATE NOT NULL,                                 -- Date when the product is coming
    active BOOLEAN DEFAULT FALSE,                       -- Active status (default: false)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,     -- Created at timestamp
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Updated at timestamp

    -- Foreign Key Constraint
    CONSTRAINT fk_product_coming_product FOREIGN KEY (product_id) REFERENCES Product(id) ON DELETE CASCADE
) ENGINE=InnoDB;
