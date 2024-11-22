CREATE TABLE USERS (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    hashed_password TEXT NOT NULL,
    profile_image BLOB,
    balance INTEGER DEFAULT 0
);

CREATE TABLE BANNERS (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    banner_name TEXT NOT NULL,
    banner_image TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE SERVICES (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    service_code TEXT NOT NULL UNIQUE,
    service_name TEXT NOT NULL,
    service_icon TEXT NOT NULL,
    service_tariff INTEGER NOT NULL
);

CREATE TABLE TRANSACTIONS (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    transaction_type TEXT NOT NULL,
    service_code TEXT,
    total_amount INTEGER NOT NULL,
    created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
    invoice_number TEXT,
    description TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (service_code) REFERENCES services (service_code)
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
