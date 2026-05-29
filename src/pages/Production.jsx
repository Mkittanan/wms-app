import { useState } from 'react'
import { Card, Table, Tag, Button, Modal, Form, Input, InputNumber, Select, Row, Col, message, Statistic, Alert } from 'antd'
import { PlusOutlined, OrderedListOutlined } from '@ant-design/icons'

const { Option } = Select

const initialOrders = [
  { id: 1, product: 'คอนกรีตผสมเสร็จ C25', unit: 'คิว',  qty: 50,  lot: 'FG-6801', produceDate: '2569-05-20', expireDate: '2569-07-20', status: 'เสร็จสิ้น',   recordedBy: 'สมชาย ใจดี' },
  { id: 2, product: 'แอสฟัลต์คอนกรีต AC',  unit: 'ตัน',  qty: 100, lot: 'FG-6803', produceDate: '2569-05-22', expireDate: '2569-08-22', status: 'เสร็จสิ้น',   recordedBy: 'สมชาย ใจดี' },
  { id: 3, product: 'คอนกรีตผสมเสร็จ C25', unit: 'คิว',  qty: 30,  lot: 'FG-6802', produceDate: '2569-05-25', expireDate: '2569-07-25', status: 'กำลังผลิต',  recordedBy: 'มานี รักงาน' },
  { id: 4, product: 'คอนกรีตผสมเสร็จ C30', unit: 'คิว',  qty: 80,  lot: 'FG-6804', produceDate: '2569-06-01', expireDate: '2569-08-01', status: 'รอผลิต',     recordedBy: 'สมชาย ใจดี' },
]

const productOptions = [
  { name: 'คอนกรีตผสมเสร็จ C25', unit: 'คิว' },
  { name: 'คอนกรีตผสมเสร็จ C30', unit: 'คิว' },
  { name: 'แอสฟัลต์คอนกรีต AC',  unit: 'ตัน' },
]

function getDaysLeft(expireDate) {
  return Math.ceil((new Date(expireDate) - new Date()) / 86400000)
}

function Production() {
  const [orders, setOrders]     = useState(initialOrders)
  const [modalOpen, setModal]   = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [form] = Form.useForm()

  const onAddOrder = (values) => {
    const prod = productOptions.find(p => p.name === values.product)
    const newOrder = {
      id: orders.length + 1,
      product: values.product,
      unit: prod?.unit || '',
      qty: values.qty,
      lot: values.lot,
      produceDate: values.produceDate,
      expireDate: values.expireDate,
      status: 'รอผลิต',
      recordedBy: values.recordedBy,
    }
    setOrders([...orders, newOrder])
    message.success('สร้างคำสั่งผลิตเรียบร้อยแล้ว')
    setModal(false)
    form.resetFields()
    setSelectedProduct(null)
  }

  const onStatusChange = (id, newStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o))
    message.success('อัปเดตสถานะเรียบร้อยแล้ว')
  }

  const statusConfig = {
    'รอผลิต':    { color: 'default'  },
    'กำลังผลิต': { color: 'processing' },
    'เสร็จสิ้น': { color: 'success'  },
    'ยกเลิก':    { color: 'error'    },
  }

  const nearExpire = orders.filter(o => {
    const days = getDaysLeft(o.expireDate)
    return days <= 30 && days > 0 && o.status === 'เสร็จสิ้น'
  })

  const columns = [
    { title: 'Lot',          dataIndex: 'lot',         key: 'lot', width: 110 },
    { title: 'ผลิตภัณฑ์',   dataIndex: 'product',     key: 'product' },
    { title: 'จำนวน',        key: 'qty',
      render: (_, r) => `${r.qty} ${r.unit}`
    },
    { title: 'วันผลิต',      dataIndex: 'produceDate', key: 'produceDate', width: 110 },
    { title: 'วันหมดอายุ',  dataIndex: 'expireDate',  key: 'expireDate',  width: 150,
      render: (v) => {
        const days = getDaysLeft(v)
        return (
          <span style={{ color: days <= 14 ? '#e24b4a' : days <= 30 ? '#ba7517' : '#3b6d11', fontWeight: 500 }}>
            {v} {days <= 30 && days > 0 ? `(อีก ${days} วัน)` : ''}
          </span>
        )
      }
    },
    { title: 'สถานะ',        dataIndex: 'status',      key: 'status', width: 130,
      render: (v, r) => (
        <Select
          value={v}
          size="small"
          style={{ width: 120 }}
          onChange={(val) => onStatusChange(r.id, val)}
        >
          {Object.keys(statusConfig).map(s => (
            <Option key={s} value={s}>
              <Tag color={statusConfig[s].color} style={{ margin: 0 }}>{s}</Tag>
            </Option>
          ))}
        </Select>
      )
    },
    { title: 'ผู้บันทึก',    dataIndex: 'recordedBy',  key: 'recordedBy',
      render: (v) => <Tag color="blue">{v}</Tag>
    },
  ]

  const doneCount    = orders.filter(o => o.status === 'เสร็จสิ้น').length
  const activeCount  = orders.filter(o => o.status === 'กำลังผลิต').length
  const pendingCount = orders.filter(o => o.status === 'รอผลิต').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Near Expire Alerts */}
      {nearExpire.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {nearExpire.map(o => (
            <Alert key={o.id} type="warning" showIcon
              message={`${o.product} Lot ${o.lot} — หมดอายุใน ${getDaysLeft(o.expireDate)} วัน (${o.expireDate})`}
            />
          ))}
        </div>
      )}

      {/* Stat Cards */}
      <Row gutter={16}>
        <Col span={6}>
          <Card size="small">
            <Statistic title="คำสั่งผลิตทั้งหมด" value={orders.length} suffix="รายการ"
              valueStyle={{ color: '#1a2035', fontSize: 24 }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="รอผลิต" value={pendingCount} suffix="รายการ"
              valueStyle={{ color: '#888', fontSize: 24 }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="กำลังผลิต" value={activeCount} suffix="รายการ"
              valueStyle={{ color: '#185fa5', fontSize: 24 }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="เสร็จสิ้น" value={doneCount} suffix="รายการ"
              valueStyle={{ color: '#3b6d11', fontSize: 24 }} />
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <Card
        title={<><OrderedListOutlined /> แผนการผลิต</>}
        size="small"
        extra={
          <Button type="primary" icon={<PlusOutlined />}
            style={{ background: '#185fa5' }}
            onClick={() => setModal(true)}>
            สร้างคำสั่งผลิต
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={orders.map(o => ({ ...o, key: o.id }))}
          size="small"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Modal */}
      <Modal title="สร้างคำสั่งผลิตใหม่" open={modalOpen}
        onCancel={() => { setModal(false); form.resetFields(); setSelectedProduct(null) }}
        footer={null}>
        <Form form={form} layout="vertical" onFinish={onAddOrder} style={{ marginTop: 16 }}>
          <Form.Item label="ผลิตภัณฑ์" name="product" rules={[{ required: true, message: 'กรุณาเลือกผลิตภัณฑ์' }]}>
            <Select placeholder="เลือกผลิตภัณฑ์"
              onChange={v => setSelectedProduct(productOptions.find(p => p.name === v))}>
              {productOptions.map(p => <Option key={p.name} value={p.name}>{p.name}</Option>)}
            </Select>
          </Form.Item>
          <Row gutter={12}>
            <Col span={14}>
              <Form.Item label={`จำนวน${selectedProduct ? ` (${selectedProduct.unit})` : ''}`} name="qty" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="Lot Number" name="lot" rules={[{ required: true }]}>
                <Input placeholder="FG-6805" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="วันผลิต" name="produceDate" rules={[{ required: true }]}>
                <Input placeholder="2569-06-01" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="วันหมดอายุ" name="expireDate" rules={[{ required: true }]}>
                <Input placeholder="2569-09-01" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label={<span>ผู้บันทึก <span style={{ color: '#e24b4a', fontSize: 12 }}>* จำเป็นต้องกรอก</span></span>}
            name="recordedBy" rules={[{ required: true, message: 'กรุณากรอกชื่อผู้บันทึก' }]}>
            <Input placeholder="กรอกชื่อผู้บันทึก..." />
          </Form.Item>
          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => setModal(false)} style={{ marginRight: 8 }}>ยกเลิก</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#185fa5' }}>สร้างคำสั่งผลิต</Button>
          </div>
        </Form>
      </Modal>

    </div>
  )
}

export default Production