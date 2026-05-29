import { useState } from 'react'
import { Card, Row, Col, Progress, Table, Tag, Button, Modal, Form, Input, InputNumber, message, Statistic } from 'antd'
import { PlusOutlined, EnvironmentOutlined } from '@ant-design/icons'
import { locations as initialLocations, materials, stockInList } from '../data/mockData'

function getLocationMaterials(locationId) {
  const items = stockInList.filter(s => s.locationId === locationId)
  return items.map(s => {
    const mat = materials.find(m => m.id === s.materialId)
    return { ...s, materialName: mat?.name, unit: mat?.unit, price: mat?.price }
  })
}

function Location() {
  const [locationList, setLocationList] = useState(initialLocations)
  const [modalOpen, setModalOpen]       = useState(false)
  const [selected, setSelected]         = useState(null)
  const [form] = Form.useForm()

  const totalPallets = locationList.reduce((sum, l) => sum + l.maxPallets, 0)
  const usedPallets  = locationList.reduce((sum, l) => sum + l.usedPallets, 0)
  const freePallets  = totalPallets - usedPallets

  const onAddLocation = (values) => {
    const newLoc = {
      id: locationList.length + 1,
      name: values.name,
      maxPallets: values.maxPallets,
      usedPallets: 0,
      size: values.size,
    }
    setLocationList([...locationList, newLoc])
    message.success('เพิ่มโลเคชั่นเรียบร้อยแล้ว')
    setModalOpen(false)
    form.resetFields()
  }

  const getStatusColor = (used, max) => {
    const pct = used / max * 100
    if (pct >= 90) return '#e24b4a'
    if (pct >= 70) return '#ba7517'
    return '#185fa5'
  }

  const detailColumns = [
    { title: 'วัตถุดิบ', dataIndex: 'materialName', key: 'materialName' },
    { title: 'จำนวนรับ', key: 'qty',
      render: (_, r) => `${r.qty} ${r.unit}`
    },
    { title: 'Lot',      dataIndex: 'lot',  key: 'lot' },
    { title: 'วันที่รับ', dataIndex: 'date', key: 'date', width: 110 },
    { title: 'มูลค่า',   key: 'value',
      render: (_, r) => (
        <span style={{ color: '#185fa5', fontWeight: 500 }}>
          ฿{(r.qty * r.price).toLocaleString('th-TH')}
        </span>
      )
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Stat Cards */}
      <Row gutter={16}>
        <Col span={6}>
          <Card size="small">
            <Statistic title="โลเคชั่นทั้งหมด" value={locationList.length} suffix="แห่ง"
              valueStyle={{ color: '#1a2035', fontSize: 24 }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="พาเลทที่ใช้แล้ว" value={usedPallets} suffix={`/ ${totalPallets}`}
              valueStyle={{ color: '#185fa5', fontSize: 24 }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="พาเลทว่าง" value={freePallets} suffix="พาเลท"
              valueStyle={{ color: '#3b6d11', fontSize: 24 }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="ความจุรวม" value={Math.round(usedPallets / totalPallets * 100)} suffix="%"
              valueStyle={{
                color: usedPallets / totalPallets >= 0.9 ? '#e24b4a' : '#ba7517',
                fontSize: 24
              }} />
          </Card>
        </Col>
      </Row>

      {/* Location Cards */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 15, fontWeight: 500 }}>โลเคชั่นทั้งหมด</div>
        <Button type="primary" icon={<PlusOutlined />}
          style={{ background: '#185fa5' }}
          onClick={() => setModalOpen(true)}>
          เพิ่มโลเคชั่น
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {locationList.map(loc => {
          const pct      = Math.round(loc.usedPallets / loc.maxPallets * 100)
          const color    = getStatusColor(loc.usedPallets, loc.maxPallets)
          const locMats  = getLocationMaterials(loc.id)
          const locValue = locMats.reduce((sum, s) => sum + s.qty * s.price, 0)

          return (
            <Col span={12} key={loc.id}>
              <Card
                size="small"
                hoverable
                onClick={() => setSelected(selected?.id === loc.id ? null : loc)}
                style={{ cursor: 'pointer', borderColor: selected?.id === loc.id ? '#185fa5' : undefined }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <EnvironmentOutlined style={{ color: '#185fa5' }} />
                      {loc.name}
                    </div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{loc.size}</div>
                  </div>
                  <Tag color={pct >= 90 ? 'error' : pct >= 70 ? 'warning' : 'processing'}>
                    {pct}% เต็ม
                  </Tag>
                </div>

                <Progress
                  percent={pct}
                  strokeColor={color}
                  showInfo={false}
                  size="small"
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: '#888' }}>
                  <span>พาเลท {loc.usedPallets}/{loc.maxPallets}</span>
                  <span>ว่าง {loc.maxPallets - loc.usedPallets} พาเลท</span>
                  <span style={{ color: '#185fa5', fontWeight: 500 }}>
                    ฿{locValue.toLocaleString('th-TH')}
                  </span>
                </div>

                {selected?.id === loc.id && locMats.length > 0 && (
                  <div style={{ marginTop: 12, borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
                    <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>วัตถุดิบในโลเคชั่นนี้</div>
                    <Table
                      columns={detailColumns}
                      dataSource={locMats.map((s, i) => ({ ...s, key: i }))}
                      size="small"
                      pagination={false}
                    />
                  </div>
                )}

                {selected?.id === loc.id && locMats.length === 0 && (
                  <div style={{ marginTop: 10, textAlign: 'center', color: '#aaa', fontSize: 12 }}>
                    ยังไม่มีวัตถุดิบในโลเคชั่นนี้
                  </div>
                )}
              </Card>
            </Col>
          )
        })}
      </Row>

      {/* Add Location Modal */}
      <Modal
        title="เพิ่มโลเคชั่นใหม่"
        open={modalOpen}
        onCancel={() => { setModalOpen(false); form.resetFields() }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onAddLocation} style={{ marginTop: 16 }}>
          <Form.Item label="ชื่อโลเคชั่น" name="name" rules={[{ required: true, message: 'กรุณากรอกชื่อโลเคชั่น' }]}>
            <Input placeholder="เช่น Zone C-02" />
          </Form.Item>
          <Form.Item label="จำนวนพาเลทสูงสุด" name="maxPallets" rules={[{ required: true, message: 'กรุณากรอกจำนวน' }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="ขนาดพื้นที่" name="size" rules={[{ required: true, message: 'กรุณากรอกขนาด' }]}>
            <Input placeholder="เช่น 6×6 ม." />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button onClick={() => setModalOpen(false)} style={{ marginRight: 8 }}>ยกเลิก</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#185fa5' }}>เพิ่มโลเคชั่น</Button>
          </Form.Item>
        </Form>
      </Modal>

    </div>
  )
}

export default Location