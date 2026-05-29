-- Users
CREATE TABLE IF NOT EXISTS users (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  username     VARCHAR(50)  UNIQUE NOT NULL,
  password     VARCHAR(255) NOT NULL,
  role         VARCHAR(20)  NOT NULL DEFAULT 'staff',
  created_at   TIMESTAMP DEFAULT NOW()
);

-- Materials
CREATE TABLE IF NOT EXISTS materials (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(200) NOT NULL,
  unit         VARCHAR(50)  NOT NULL,
  price        NUMERIC(12,2) NOT NULL DEFAULT 0,
  min_stock    NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at   TIMESTAMP DEFAULT NOW()
);

-- Locations
CREATE TABLE IF NOT EXISTS locations (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  max_pallets  INTEGER NOT NULL DEFAULT 10,
  used_pallets INTEGER NOT NULL DEFAULT 0,
  size         VARCHAR(50),
  created_at   TIMESTAMP DEFAULT NOW()
);

-- Stock In
CREATE TABLE IF NOT EXISTS stock_in (
  id           SERIAL PRIMARY KEY,
  material_id  INTEGER REFERENCES materials(id),
  qty          NUMERIC(12,2) NOT NULL,
  price        NUMERIC(12,2) NOT NULL,
  lot          VARCHAR(100),
  location_id  INTEGER REFERENCES locations(id),
  date         DATE NOT NULL,
  recorded_by  VARCHAR(100) NOT NULL,
  created_at   TIMESTAMP DEFAULT NOW()
);

-- Stock Out
CREATE TABLE IF NOT EXISTS stock_out (
  id           SERIAL PRIMARY KEY,
  material_id  INTEGER REFERENCES materials(id),
  qty          NUMERIC(12,2) NOT NULL,
  date         DATE NOT NULL,
  received_by  VARCHAR(100),
  purpose      VARCHAR(100),
  recorded_by  VARCHAR(100) NOT NULL,
  created_at   TIMESTAMP DEFAULT NOW()
);

-- Finish Goods
CREATE TABLE IF NOT EXISTS finish_goods (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(200) NOT NULL,
  unit         VARCHAR(50)  NOT NULL,
  created_at   TIMESTAMP DEFAULT NOW()
);

-- BOM
CREATE TABLE IF NOT EXISTS bom (
  id              SERIAL PRIMARY KEY,
  finish_good_id  INTEGER REFERENCES finish_goods(id),
  material_id     INTEGER REFERENCES materials(id),
  qty             NUMERIC(12,4) NOT NULL
);

-- Production Orders
CREATE TABLE IF NOT EXISTS production_orders (
  id              SERIAL PRIMARY KEY,
  finish_good_id  INTEGER REFERENCES finish_goods(id),
  qty             NUMERIC(12,2) NOT NULL,
  lot             VARCHAR(100),
  produce_date    DATE,
  expire_date     DATE,
  status          VARCHAR(50) DEFAULT 'รอผลิต',
  recorded_by     VARCHAR(100) NOT NULL,
  created_at      TIMESTAMP DEFAULT NOW()
);