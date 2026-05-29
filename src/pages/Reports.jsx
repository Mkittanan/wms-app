import { useState } from 'react'
import { Card, Row, Col, Table, Button, Select, Statistic, message } from 'antd'
import { DownloadOutlined, BarChartOutlined } from '@ant-design/icons'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  LineChart, Line,
} from 'recharts'
import * as XLSX from 'xlsx'
import { materials, stockInList, stockOutList, locations } from '../data/mockData'

const { Option } = Select

const monthlyData = [
  { month: 'ม.ค.',  รับเข้า: 420000, เบิกออก: 380000 },
  { month: 'ก.พ.',  รับเข้า: 380000, เบิกออก: 410000 },
  { month: 'มี.ค.', รับเข้า: 550000, เบิกออก: 320000 },
  { month: 'เม.ย.', รับเข้า: 490000, เบิกออก: 450000 },
  { month: 'พ.ค.',  รับเข้า: 610000, เบิกออก: 390000 },
]

function getBalance(materialId) {
  const totalIn  = stockInList.filter(s => s.materialId === materialId).reduce((sum, s) => sum + s.qty, 0)
  const totalOut = stockOutList.filter(s => s.materialId === materialId).reduce((sum, s) => sum + s.qty, 0)
  return totalIn - totalOut
}

function Reports() {
  const [chartType, setChartType] = useState('bar')

  const totalIn  = stockInList.reduce((sum, s) => {
    const mat = materials.find(m => m.id === s.materialId)
    return sum + s.qty * (mat?.price || 0)
  }, 0)

  const totalOut = stockOutList.reduce((sum, s) => {
    const mat = materials.find(m => m.id === s.materialId)
    return sum + s.qty * (mat?.price || 0)
  }, 0)

  const totalBalance = materials.reduce((sum, m) => sum + getBalance(m.id) * m.price, 0)

  // Export Functions
  const exportStockIn = () => {
    const data = stockInList.map(s => {
      const mat = materials.find(m => m.id === s.materialId)
      const loc = locations.find(l => l.id === s.locationId)
      return {
        'วันที่':       s.date,
        'วัตถุดิบ':    mat?.name || '',
        'จำนวน':       s.qty,
        'หน่วย':       mat?.unit || '',
        'ราคา/หน่วย':  s.price,
        'มูลค่ารวม':   s.qty * s.price,
        'Lot':          s.lot,
        'โลเคชั่น':    loc?.name || '',
        'ผู้บันทึก':   s.recordedBy,
      }
    })
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'รายการรับวัตถุดิบ')
    XLSX.writeFile(wb, 'รายการรับวัตถุดิบ.xlsx')
    message.success('Export เรียบร้อยแล้ว')
  }

  const exportStockOut = () => {
    const data = stockOutList.map(s => {
      const mat = materials.find(m => m.id === s.materialId)
      return {
        'วันที่':         s.date,
        'วัตถุดิบ':      mat?.name || '',
        'จำนวน':         s.qty,
        'หน่วย':         mat?.unit || '',
        'ราคา/หน่วย':    mat?.price || 0,
        'มูลค่ารวม':     s.qty * (mat?.price || 0),
        'ผู้รับ':         s.receivedBy,
        'วัตถุประสงค์':  s.purpose,
        'ผู้บันทึก':     s.recordedBy,
      }
    })
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'รายการเบิกวัตถุดิบ')
    XLSX.writeFile(wb, 'รายการเบิกวัตถุดิบ.xlsx')
    message.success('Export เรียบร้อยแล้ว')
  }

  const exportBalance = () => {
    const data = materials.map(m => {
      const balance = getBalance(m.id)
      const status  = balance <= 0 ? 'หมด' : balance < m.minStock ? 'ใกล้หมด' : 'ปกติ'
      return {
        'วัตถุดิบ':    m.name,
        'หน่วย':       m.unit,
        'ยอดคงเหลือ':  balance,
        'ราคา/หน่วย':  m.price,
        'มูลค่ารวม':   balance * m.price,
        'Min Stock':    m.minStock,
        'สถานะ':       status,
      }
    })
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'ยอดคงเหลือ')
    XLSX.writeFile(wb, 'ยอดคงเหลือ.xlsx')
    message.success('Export เรียบร้อยแล้ว')
  }

  const exportMonthly = () => {
    const ws = XLSX.utils.json_to_sheet(monthlyData.map(d => ({
      'เดือน':    d.month,
      'รับเข้า':  d.รับเข้า,
      'เบิกออก':  d.เบิกออก,
      'คงเหลือ':  d.รับเข้า - d.เบิกออก,
    })))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'สรุปรายเดือน')
    XLSX.writeFile(wb, 'สรุปรายเดือน.xlsx')
    message.success('Export เรียบร้อยแล้ว')
  }

  const exportAll = () => {
    const wb = XLSX.utils.book_new()

    const inData = stockInList.map(s => {
      const mat = materials.find(m => m.id === s.materialId)
      const loc = locations.find(l => l.id === s.locationId)
      return {
        'วันที่': s.date, 'วัตถุดิบ': mat?.name, 'จำนวน': s.qty,
        'หน่วย': mat?.unit, 'ราคา/หน่วย': s.price,
        'มูลค่ารวม': s.qty * s.price, 'Lot': s.lot,
        'โลเคชั่น': loc?.name, 'ผู้บันทึก': s.recordedBy,
      }
    })
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(inData), 'รายการรับวัตถุดิบ')

    const outData = stockOutList.map(s => {
      const mat = materials.find(m => m.id === s.materialId)
      return {
        'วันที่': s.date, 'วัตถุดิบ': mat?.name, 'จำนวน': s.qty,
        'หน่วย': mat?.unit, 'ราคา/หน่วย': mat?.price,
        'มูลค่ารวม': s.qty * (mat?.price || 0),
        'ผู้รับ': s.receivedBy, 'วัตถุประสงค์': s.purpose, 'ผู้บันทึก': s.recordedBy,
      }
    })
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(outData), 'รายการเบิกวัตถุดิบ')

    const balData = materials.map(m => {
      const balance = getBalance(m.id)
      return {
        'วัตถุดิบ': m.name, 'หน่วย': m.unit, 'ยอดคงเหลือ': balance,
        'ราคา/หน่วย': m.price, 'มูลค่ารวม': balance * m.price,
        'สถานะ': balance <= 0 ? 'หมด' : balance < m.minStock ? 'ใกล้หมด' : 'ปกติ',
      }
    })
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(balData), 'ยอดคงเหลือ')

    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(monthlyData.map(d => ({
      'เดือน': d.month, 'รับเข้า': d.รับเข้า, 'เบิกออก': d.เบิกออก,
      'คงเหลือ': d.รับเข้า - d.เบิกออก,
    }))), 'สรุปรายเดือน')

    XLSX.writeFile(wb, 'WMS-รายงานทั้งหมด.xlsx')
    message.success('Export ทั้งหมดเรียบร้อยแล้ว')
  }

  const balanceColumns = [
    { title: 'วัตถุดิบ',   dataIndex: 'name',    key: 'name' },
    { title: 'คงเหลือ',   key: 'balance',
      render: (_, r) => {
        const bal = getBalance(r.id)
        return `${bal} ${r.unit}`
      }
    },
    { title: 'มูลค่า',    key: 'value',
      render: (_, r) => {
        const val = getBalance(r.id) * r.price
        return <span style={{ color: '#185fa5', fontWeight: 500 }}>฿{val.toLocaleString('th-TH')}</span>
      }
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Stat Cards */}
      <Row gutter={16}>
        <Col span={8}>
          <Card size="small">
            <Statistic title="มูลค่ารับเข้าทั้งหมด" value={totalIn}
              prefix="฿" valueStyle={{ color: '#185fa5', fontSize: 22 }}
              formatter={v => Number(v).toLocaleString('th-TH')} />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic title="มูลค่าเบิกออกทั้งหมด" value={totalOut}
              prefix="฿" valueStyle={{ color: '#d85a30', fontSize: 22 }}
              formatter={v => Number(v).toLocaleString('th-TH')} />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic title="มูลค่าคงเหลือปัจจุบัน" value={totalBalance}
              prefix="฿" valueStyle={{ color: '#3b6d11', fontSize: 22 }}
              formatter={v => Number(v).toLocaleString('th-TH')} />
          </Card>
        </Col>
      </Row>

      {/* Chart */}
      <Card
        title={<><BarChartOutlined /> กราฟรับเข้า vs เบิกออก</>}
        size="small"
        extra={
          <Select value={chartType} onChange={setChartType} size="small" style={{ width: 100 }}>
            <Option value="bar">แผนภูมิแท่ง</Option>
            <Option value="line">แผนภูมิเส้น</Option>
          </Select>
        }
      >
        <ResponsiveContainer width="100%" height={260}>
          {chartType === 'bar' ? (
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={v => '฿' + (v / 1000).toFixed(0) + 'K'} />
              <Tooltip formatter={v => '฿' + Number(v).toLocaleString('th-TH')} />
              <Legend />
              <Bar dataKey="รับเข้า"  fill="#185fa5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="เบิกออก" fill="#d85a30" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={v => '฿' + (v / 1000).toFixed(0) + 'K'} />
              <Tooltip formatter={v => '฿' + Number(v).toLocaleString('th-TH')} />
              <Legend />
              <Line type="monotone" dataKey="รับเข้า"  stroke="#185fa5" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="เบิกออก" stroke="#d85a30" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </Card>

      <Row gutter={16}>
        {/* Export Buttons */}
        <Col span={10}>
          <Card title="Export รายงาน" size="small">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Button icon={<DownloadOutlined />} onClick={exportStockIn}  block>
                รายการรับวัตถุดิบ.xlsx
              </Button>
              <Button icon={<DownloadOutlined />} onClick={exportStockOut} block>
                รายการเบิกวัตถุดิบ.xlsx
              </Button>
              <Button icon={<DownloadOutlined />} onClick={exportBalance}  block>
                ยอดคงเหลือ.xlsx
              </Button>
              <Button icon={<DownloadOutlined />} onClick={exportMonthly}  block>
                สรุปรายเดือน.xlsx
              </Button>
              <Button icon={<DownloadOutlined />} onClick={exportAll}
                type="primary" style={{ background: '#185fa5' }} block>
                Export ทั้งหมด (1 ไฟล์)
              </Button>
            </div>
          </Card>
        </Col>

        {/* Balance Summary */}
        <Col span={14}>
          <Card title="สรุปยอดคงเหลือวัตถุดิบ" size="small">
            <Table
              columns={balanceColumns}
              dataSource={materials.map(m => ({ ...m, key: m.id }))}
              size="small"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>

    </div>
  )
}

export default Reports