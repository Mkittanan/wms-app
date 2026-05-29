import { Row, Col, Card, Table, Tag, Alert } from 'antd'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { materials, stockInList, stockOutList } from '../data/mockData'

const chartData = [
  { month: 'ม.ค.', รับเข้า: 420000, เบิกออก: 380000 },
  { month: 'ก.พ.', รับเข้า: 380000, เบิกออก: 410000 },
  { month: 'มี.ค.', รับเข้า: 550000, เบิกออก: 320000 },
  { month: 'เม.ย.', รับเข้า: 490000, เบิกออก: 450000 },
  { month: 'พ.ค.', รับเข้า: 610000, เบิกออก: 390000 },
]

function getBalance(materialId) {
  const totalIn  = stockInList.filter(s => s.materialId === materialId).reduce((sum, s) => sum + s.qty, 0)
  const totalOut = stockOutList.filter(s => s.materialId === materialId).reduce((sum, s) => sum + s.qty, 0)
  return totalIn - totalOut
}

function Dashboard() {
  const totalValue = materials.reduce((sum, m) => {
    return sum + getBalance(m.id) * m.price
  }, 0)

  const lowStock  = materials.filter(m => getBalance(m.id) < m.minStock && getBalance(m.id) > 0)
  const zeroStock = materials.filter(m => getBalance(m.id) <= 0)

  const recentColumns = [
    { title: 'วันที่',      dataIndex: 'date',       key: 'date', width: 110 },
    { title: 'ประเภท',     dataIndex: 'type',       key: 'type',
      render: (t) => <Tag color={t === 'รับเข้า' ? 'blue' : 'orange'}>{t}</Tag>
    },
    { title: 'วัตถุดิบ',   dataIndex: 'materialName', key: 'materialName' },
    { title: 'จำนวน',      dataIndex: 'qty',        key: 'qty' },
    { title: 'ผู้บันทึก',  dataIndex: 'recordedBy', key: 'recordedBy' },
  ]

  const recentData = [
    ...stockInList.map(s => ({
      ...s,
      key: 'in-' + s.id,
      type: 'รับเข้า',
      materialName: materials.find(m => m.id === s.materialId)?.name,
      qty: s.qty + ' ' + materials.find(m => m.id === s.materialId)?.unit,
    })),
    ...stockOutList.map(s => ({
      ...s,
      key: 'out-' + s.id,
      type: 'เบิกออก',
      materialName: materials.find(m => m.id === s.materialId)?.name,
      qty: s.qty + ' ' + materials.find(m => m.id === s.materialId)?.unit,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Stat Cards */}
      <Row gutter={16}>
        <Col span={6}>
          <Card size="small">
            <div style={{ fontSize: 12, color: '#888' }}>วัตถุดิบทั้งหมด</div>
            <div style={{ fontSize: 28, fontWeight: 600, color: '#1a2035' }}>{materials.length}</div>
            <div style={{ fontSize: 12, color: '#888' }}>รายการ</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <div style={{ fontSize: 12, color: '#888' }}>มูลค่าคลังรวม</div>
            <div style={{ fontSize: 28, fontWeight: 600, color: '#185fa5' }}>
              ฿{totalValue.toLocaleString('th-TH')}
            </div>
            <div style={{ fontSize: 12, color: '#888' }}>บาท</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <div style={{ fontSize: 12, color: '#888' }}>ของใกล้หมด</div>
            <div style={{ fontSize: 28, fontWeight: 600, color: '#ba7517' }}>{lowStock.length}</div>
            <div style={{ fontSize: 12, color: '#888' }}>รายการ</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <div style={{ fontSize: 12, color: '#888' }}>ของหมด/ขาด</div>
            <div style={{ fontSize: 28, fontWeight: 600, color: '#e24b4a' }}>{zeroStock.length}</div>
            <div style={{ fontSize: 12, color: '#888' }}>รายการ</div>
          </Card>
        </Col>
      </Row>

      {/* Alerts */}
      {lowStock.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {lowStock.map(m => (
            <Alert
              key={m.id}
              type="warning"
              showIcon
              message={`${m.name} ใกล้หมด — เหลือ ${getBalance(m.id)} ${m.unit} (ขั้นต่ำ ${m.minStock} ${m.unit})`}
            />
          ))}
          {zeroStock.map(m => (
            <Alert
              key={m.id}
              type="error"
              showIcon
              message={`${m.name} หมดแล้ว — ยอดคงเหลือ 0`}
            />
          ))}
        </div>
      )}

      {/* Chart */}
      <Card title="รับเข้า vs เบิกออก (5 เดือนล่าสุด)" size="small">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(v) => '฿' + (v/1000).toFixed(0) + 'K'} />
            <Tooltip formatter={(v) => '฿' + v.toLocaleString('th-TH')} />
            <Legend />
            <Bar dataKey="รับเข้า"  fill="#185fa5" radius={[4,4,0,0]} />
            <Bar dataKey="เบิกออก" fill="#d85a30" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Recent Table */}
      <Card title="รายการรับ/เบิกล่าสุด" size="small">
        <Table
          columns={recentColumns}
          dataSource={recentData}
          pagination={false}
          size="small"
        />
      </Card>

    </div>
  )
}

export default Dashboard