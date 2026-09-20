--Sellers Table
CREATE TABLE sellers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('APPROVED', 'PENDING', 'REJECTED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--Products Table (Universal Catalog)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--Seller Listings Table (The Bridge)
CREATE TABLE seller_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id),
    seller_id UUID NOT NULL REFERENCES sellers(id),
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    available_stock INT NOT NULL CHECK (available_stock >= 0),
    min_order_quantity INT NOT NULL CHECK (min_order_quantity >= 1),
    is_active BOOLEAN DEFAULT TRUE,
    version INT NOT NULL DEFAULT 0,
    CONSTRAINT unique_product_seller UNIQUE (product_id, seller_id)
);