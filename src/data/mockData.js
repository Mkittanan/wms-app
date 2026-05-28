export const materials = [
    { id: 1, name: 'ปูนซีเมนต์ปอร์ตแลนด์', unit: 'ถุง', price: 145, minStock: 500 },
    { id: 2, name: 'ทรายหยาบ', unit: 'คิว', price: 350, minStock: 50 },
    { id: 3, name: 'หินคลุก', unit: 'คิว', price: 420, minStock: 50 },
    { id: 4, name: 'หินใหญ่ 3/4 นิ้ว', unit: 'คิว', price: 550, minStock: 30 },
    { id: 5, name: 'ยางแอสฟัลต์ (AC60-70)', unit: 'ตัน', price: 18500, minStock: 10 },
    { id: 6, name: 'หินฝุ่น', unit: 'คิว', price: 380, minStock: 30 },
    { id: 7, name: 'เหล็กเส้น DB12', unit: 'เส้น', price: 185, minStock: 200 },
    { id: 8, name: 'เหล็กเส้น DB16', unit: 'เส้น', price: 320, minStock: 100 },
    { id: 9, name: 'ลวดผูกเหล็ก', unit: 'กก.', price: 35, minStock: 50 },
    { id: 10, name: 'น้ำยาบ่มคอนกรีต', unit: 'ถัง', price: 850, minStock: 20 },
]

export const locations = [
    { id: 1, name: 'Zone A-01', maxPallets: 20, usedPallets: 14, size: '10×10 ม.' },
    { id: 2, name: 'Zone A-02', maxPallets: 20, usedPallets: 8, size: '10×10 ม.' },
    { id: 3, name: 'Zone B-01', maxPallets: 15, usedPallets: 15, size: '8×8 ม.' },
    { id: 4, name: 'Zone B-02', maxPallets: 15, usedPallets: 5, size: '8×8 ม.' },
    { id: 5, name: 'Zone C-01', maxPallets: 10, usedPallets: 3, size: '6×6 ม.' },
]

export const stockInList = [
    { id: 1, materialId: 1, qty: 1000, price: 145, lot: 'LOT-6801', locationId: 1, date: '2569-05-20', recordedBy: 'สมชาย ใจดี' },
    { id: 2, materialId: 2, qty: 80, price: 350, lot: 'LOT-6802', locationId: 2, date: '2569-05-21', recordedBy: 'สมชาย ใจดี' },
    { id: 3, materialId: 5, qty: 25, price: 18500, lot: 'LOT-6803', locationId: 3, date: '2569-05-22', recordedBy: 'มานี รักงาน' },
    { id: 4, materialId: 7, qty: 500, price: 185, lot: 'LOT-6804', locationId: 1, date: '2569-05-25', recordedBy: 'สมชาย ใจดี' },
    { id: 5, materialId: 3, qty: 60, price: 420, lot: 'LOT-6805', locationId: 2, date: '2569-05-27', recordedBy: 'มานี รักงาน' },
]

export const stockOutList = [
    { id: 1, materialId: 1, qty: 200, date: '2569-05-22', receivedBy: 'หน้างาน สาย 1', purpose: 'ผลิต', recordedBy: 'มานี รักงาน' },
    { id: 2, materialId: 2, qty: 15, date: '2569-05-23', receivedBy: 'หน้างาน สาย 1', purpose: 'ผลิต', recordedBy: 'มานี รักงาน' },
    { id: 3, materialId: 5, qty: 8, date: '2569-05-24', receivedBy: 'หน้างาน สาย 2', purpose: 'ผลิต', recordedBy: 'สมชาย ใจดี' },
    { id: 4, materialId: 7, qty: 100, date: '2569-05-26', receivedBy: 'หน้างาน สาย 2', purpose: 'ผลิต', recordedBy: 'มานี รักงาน' },
]

export const users = [
    { id: 1, name: 'ชัยวัฒน์ ดำรงค์', role: 'master_admin' },
    { id: 2, name: 'สมชาย ใจดี', role: 'admin' },
    { id: 3, name: 'มานี รักงาน', role: 'staff' },
    { id: 4, name: 'วิชัย ตรงดี', role: 'viewer' },
]