import { useState } from 'react'
import { Card, Table, Tag, Input, Select, Row, Col, Statistic } from 'antd'
import {
  SearchOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import { materials, stockInList, stockOutList } from '../data/mockData'

const { Option } = Select

function getBalance(materialId) {
  const totalIn  = stockInList.filter(s => s.materialId === materialId).reduce((sum, s) => sum + s.qty, 0)
  const totalOut = stockOutList.filter(s => s.materialId === materialId).reduce((sum, s) => sum + s.qty, 0)
  return totalIn - totalOut
}

function getStatus(balance, minStock) {
  if (balance <= 0)             return 'หมด'
  if (balance < minStock)       return 'ใกล้หมด'
  return 'ปกติ'
}

function Inventory() {
  const [search, setSearch]       = useState('')
  const [statusFilter, setFilter] = useState('ทั้งหมด')

  const inventoryData = materials.map(m => ({
    ...m,
    key:      m.id,
    balance:  getBalance(m.id),
    value:    getBalance(m.id) * m.price,
    status:   getStatus(getBalance(m.id), m.minStock),
  }))

  const filtered = inventoryData
    .filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
    .filter(m => statusFilter === 'ทั้งหมด' || m.status === statusFilter)

  const totalValue  = inventoryData.reduce((sum, m) => sum + m.value, 0)
  const normalCount = inventoryData.filter(m => m.status === 'ปกติ').length
  const lowCount    = inventoryData.filter(m => m.status === 'ใกล้หมด').length
  const emptyCount  = inventoryData.filter(m => m.status === 'หมด').length

  const columns = [
    { title: 'วัตถุดิบ',     dataIndex: 'name',     key: 'name' },
    { title: 'หน่วย',        dataIndex: 'unit',     key: 'unit', width: 80 },
    { title: 'ยอดคงเหลือ',  dataIndex: 'balance',  key: 'balance', width: 120,
      render: (v, r) => (
        <span style={{ fontWeight: 500, color: v <= 0 ? '#e24b4a' : v < r.minStock ? '#ba7517' : '#3b6d11' }}>
          {v} {r.unit}
        </span>
      ),
      sorter: (a, b) => a.balance - b.balance,
    },
    { title: 'Min Stock',    dataIndex: 'minStock', key: 'minStock', width: 120,
      render: (v, r) => `${v} ${r.unit}`
    },
    { title: 'ราคา/หน่วย',  dataIndex: 'price',    key: 'price', width: 120,
      render: (v) => `฿${v.toLocaleString('th-TH')}`
    },
    { title: 'มูลค่ารวม',   dataIndex: 'value',    key: 'value', width: 140,
      render: (v) => (
        <span style={{ fontWeight: 500, color: '#185fa5' }}>
          ฿{v.toLocaleString('th-TH')}
        </span>
      ),
      sorter: (a, b) => a.value - b.value,
    },
    { title: 'สถานะ',       dataIndex: 'status',   key: 'status', width: 120,
      render: (v) => {
        const config = {
          'ปกติ':    { color: 'success', icon: <CheckCircleOutlined /> },
          'ใกล้หมด': { color: 'warning', icon: <WarningOutlined /> },
          'หมด':     { color: 'error',   icon: <CloseCircleOutlined /> },
        }
        return (
          <Tag color={config[v]?.color} icon={config[v]?.icon}>
            {v}
          </Tag>
        )
      },
      filters: [
        { text: 'ปกติ',    value: 'ปกติ' },
        { text: 'ใกล้หมด', value: 'ใกล้หมด' },
        { text: 'หมด',     value: 'หมด' },
      ],
      onFilter: (value, record) => record.status === value,
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Stat Cards */}
      <Row gutter={16}>
        <Col span={6}>
          <Card size="small">
            <Statistic title="มูลค่าคลังรวม" value={totalValue}
              prefix="฿" valueStyle={{ color: '#185fa5', fontSize: 24 }}
              formatter={(v) => Number(v).toLocaleString('th-TH')} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="ปกติ" value={normalCount} suffix="รายการ"
              valueStyle={{ color: '#3b6d11', fontSize: 24 }}
              prefix={<CheckCircleOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="ใกล้หมด" value={lowCount} suffix="รายการ"
              valueStyle={{ color: '#ba7517', fontSize: 24 }}
              prefix={<WarningOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="หมดแล้ว" value={emptyCount} suffix="รายการ"
              valueStyle={{ color: '#e24b4a', fontSize: 24 }}
              prefix={<CloseCircleOutlined />} />
          </Card>
        </Col>
      </Row>

      {/* Filter */}
      <Card size="small">
        <Row gutter={12}>
          <Col span={10}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="ค้นหาวัตถุดิบ..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </Col>
          <Col span={6}>
            <Select value={statusFilter} onChange={setFilter} style={{ width: '100%' }}>
              <Option value="ทั้งหมด">ทุกสถานะ</Option>
              <Option value="ปกติ">ปกติ</Option>
              <Option value="ใกล้หมด">ใกล้หมด</Option>
              <Option value="หมด">หมดแล้ว</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card title={`ยอดคงเหลือวัตถุดิบ (${filtered.length} รายการ)`} size="small">
        <Table
          columns={columns}
          dataSource={filtered}
          size="small"
          pagination={{ pageSize: 10 }}
          rowClassName={(r) =>
            r.status === 'หมด' ? 'row-danger' :
            r.status === 'ใกล้หมด' ? 'row-warning' : ''
          }
        />
      </Card>

    </div>
  )
}

export default Inventory