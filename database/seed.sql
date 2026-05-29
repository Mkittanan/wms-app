-- Users (password = "1234" ทุก account)
INSERT INTO users (name, username, password, role) VALUES
('ชัยวัฒน์ ดำรงค์', 'master',  '$2b$10$zvtIzQ2Y4NmrU9B5ioS3VeyH1YDz4GmXTavFaqdeQUsrZ7oYrv.Pe', 'master_admin'),
('สมชาย ใจดี',      'admin',   '$2b$10$zvtIzQ2Y4NmrU9B5ioS3VeyH1YDz4GmXTavFaqdeQUsrZ7oYrv.Pe', 'admin'),
('มานี รักงาน',     'staff',   '$2b$10$zvtIzQ2Y4NmrU9B5ioS3VeyH1YDz4GmXTavFaqdeQUsrZ7oYrv.Pe', 'staff'),
('วิชัย ตรงดี',     'viewer',  '$2b$10$zvtIzQ2Y4NmrU9B5ioS3VeyH1YDz4GmXTavFaqdeQUsrZ7oYrv.Pe', 'viewer');

-- Materials
INSERT INTO materials (name, unit, price, min_stock) VALUES
('ปูนซีเมนต์ปอร์ตแลนด์', 'ถุง',  145,   500),
('ทรายหยาบ',              'คิว',  350,   50),
('หินคลุก',               'คิว',  420,   50),
('หินใหญ่ 3/4 นิ้ว',     'คิว',  550,   30),
('ยางแอสฟัลต์ (AC60-70)', 'ตัน',  18500, 10),
('หินฝุ่น',               'คิว',  380,   30),
('เหล็กเส้น DB12',        'เส้น', 185,   200),
('เหล็กเส้น DB16',        'เส้น', 320,   100),
('ลวดผูกเหล็ก',           'กก.',  35,    50),
('น้ำยาบ่มคอนกรีต',       'ถัง',  850,   20);

-- Locations
INSERT INTO locations (name, max_pallets, used_pallets, size) VALUES
('Zone A-01', 20, 14, '10×10 ม.'),
('Zone A-02', 20, 8,  '10×10 ม.'),
('Zone B-01', 15, 15, '8×8 ม.'),
('Zone B-02', 15, 5,  '8×8 ม.'),
('Zone C-01', 10, 3,  '6×6 ม.');

-- Stock In
INSERT INTO stock_in (material_id, qty, price, lot, location_id, date, recorded_by) VALUES
(1, 1000, 145,   'LOT-6801', 1, '2569-05-20', 'สมชาย ใจดี'),
(2, 80,   350,   'LOT-6802', 2, '2569-05-21', 'สมชาย ใจดี'),
(5, 25,   18500, 'LOT-6803', 3, '2569-05-22', 'มานี รักงาน'),
(7, 500,  185,   'LOT-6804', 1, '2569-05-25', 'สมชาย ใจดี'),
(3, 60,   420,   'LOT-6805', 2, '2569-05-27', 'มานี รักงาน');

-- Stock Out
INSERT INTO stock_out (material_id, qty, date, received_by, purpose, recorded_by) VALUES
(1, 200, '2569-05-22', 'หน้างาน สาย 1', 'ผลิต', 'มานี รักงาน'),
(2, 15,  '2569-05-23', 'หน้างาน สาย 1', 'ผลิต', 'มานี รักงาน'),
(5, 8,   '2569-05-24', 'หน้างาน สาย 2', 'ผลิต', 'สมชาย ใจดี'),
(7, 100, '2569-05-26', 'หน้างาน สาย 2', 'ผลิต', 'มานี รักงาน');

-- Finish Goods
INSERT INTO finish_goods (name, unit) VALUES
('คอนกรีตผสมเสร็จ C25', 'คิว'),
('แอสฟัลต์คอนกรีต AC',  'ตัน');

-- BOM
INSERT INTO bom (finish_good_id, material_id, qty) VALUES
(1, 1, 3),
(1, 2, 0.45),
(1, 4, 0.9),
(2, 5, 0.06),
(2, 3, 0.94);

-- Production Orders
INSERT INTO production_orders (finish_good_id, qty, lot, produce_date, expire_date, status, recorded_by) VALUES
(1, 50,  'FG-6801', '2569-05-20', '2569-07-20', 'เสร็จสิ้น',  'สมชาย ใจดี'),
(2, 100, 'FG-6803', '2569-05-22', '2569-08-22', 'เสร็จสิ้น',  'สมชาย ใจดี'),
(1, 30,  'FG-6802', '2569-05-25', '2569-07-25', 'กำลังผลิต', 'มานี รักงาน'),
(1, 80,  'FG-6804', '2569-06-01', '2569-08-01', 'รอผลิต',    'สมชาย ใจดี');