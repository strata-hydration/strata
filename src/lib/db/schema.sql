-- ═══ STRATA Commerce D1 Schema ═══
-- Migration v1: Initial commerce tables

CREATE TABLE IF NOT EXISTS products (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  emoji         TEXT NOT NULL DEFAULT '',
  color         TEXT NOT NULL DEFAULT '#0077FF',
  price_paise   INTEGER NOT NULL,
  compare_price_paise INTEGER NOT NULL DEFAULT 0,
  stock         INTEGER NOT NULL DEFAULT 0,
  category_tag  TEXT NOT NULL DEFAULT 'hydration',
  stat          TEXT NOT NULL DEFAULT '',
  benefit       TEXT NOT NULL DEFAULT '',
  badge         TEXT NOT NULL DEFAULT '',
  tagline       TEXT NOT NULL DEFAULT '',
  description   TEXT NOT NULL DEFAULT '',
  image_url     TEXT NOT NULL DEFAULT '/pack.png',
  available     INTEGER NOT NULL DEFAULT 1,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS customers (
  id              TEXT PRIMARY KEY,
  email           TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL DEFAULT '',
  password_hash   TEXT NOT NULL,
  email_verified  INTEGER NOT NULL DEFAULT 0,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS addresses (
  id         TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  full_name  TEXT NOT NULL,
  phone      TEXT NOT NULL,
  line1      TEXT NOT NULL,
  line2      TEXT NOT NULL DEFAULT '',
  city       TEXT NOT NULL,
  state      TEXT NOT NULL,
  pincode    TEXT NOT NULL,
  country    TEXT NOT NULL DEFAULT 'IN',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orders (
  id                   TEXT PRIMARY KEY,
  customer_id          TEXT REFERENCES customers(id),
  guest_email          TEXT,
  total_paise          INTEGER NOT NULL,
  shipping_paise       INTEGER NOT NULL DEFAULT 0,
  status               TEXT NOT NULL DEFAULT 'pending',
  razorpay_order_id    TEXT,
  razorpay_payment_id  TEXT,
  shipping_address     TEXT NOT NULL,         -- JSON blob
  created_at           TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at           TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS order_items (
  id           TEXT PRIMARY KEY,
  order_id     TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id   TEXT NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,
  quantity     INTEGER NOT NULL DEFAULT 1,
  price_paise  INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS webhook_events (
  id           TEXT PRIMARY KEY,
  event_id     TEXT NOT NULL UNIQUE,
  event_type   TEXT NOT NULL,
  payload      TEXT NOT NULL,
  processed_at TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  id           TEXT PRIMARY KEY,
  customer_id  TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  expires_at   TEXT NOT NULL,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS auth_otps (
  id             TEXT PRIMARY KEY,
  email          TEXT NOT NULL,
  purpose        TEXT NOT NULL, -- signup_verify | password_reset
  code_hash      TEXT NOT NULL,
  payload        TEXT NOT NULL DEFAULT '{}', -- JSON payload for pending signup data
  expires_at     TEXT NOT NULL,
  consumed_at    TEXT,
  attempts       INTEGER NOT NULL DEFAULT 0,
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ═══ Indexes ═══
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(available);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_guest_email ON orders(guest_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay ON orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_webhook_event_id ON webhook_events(event_id);
CREATE INDEX IF NOT EXISTS idx_sessions_customer ON sessions(customer_id);
CREATE INDEX IF NOT EXISTS idx_auth_otps_email ON auth_otps(email);
CREATE INDEX IF NOT EXISTS idx_auth_otps_purpose ON auth_otps(purpose);
