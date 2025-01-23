-- Create the CartItem table
CREATE TABLE CartItem (
    id CHAR(36) NOT NULL PRIMARY KEY, -- Unique identifier for each cart item (UUID)
    product_id CHAR(36) NOT NULL, -- Foreign key to Product table
    quantity INT NOT NULL DEFAULT 1, -- Quantity of the product
    cart_id CHAR(36) NOT NULL, -- Foreign key to Cart table
    attribute_id CHAR(36) DEFAULT NULL, -- Foreign key to Attribute table (nullable)
    is_simple BOOLEAN NOT NULL DEFAULT FALSE, -- Indicates if the product is simple
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Timestamp for creation
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL, -- Timestamp for updates

    -- Foreign key constraints
    CONSTRAINT fk_cartitem_product FOREIGN KEY (product_id) REFERENCES Product (id) ON DELETE CASCADE,
    CONSTRAINT fk_cartitem_cart FOREIGN KEY (cart_id) REFERENCES Cart (id) ON DELETE CASCADE,
    CONSTRAINT fk_cartitem_attribute FOREIGN KEY (attribute_id) REFERENCES Attribute (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
