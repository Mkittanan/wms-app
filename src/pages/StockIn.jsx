import { useState } from 'react'
import { Form, Select, InputNumber, Input, DatePicker, Button, Table, Tag, Card, Row, Col, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { materials, locations, stockInList as initialData } from '../data/mockData'

const { Option } = Select

function StockIn() {
  const [form] = Form.useForm()
  const [stockList, setStockList] = useState(initialData)
  const [selectedMaterial, setSelectedMaterial] = useState(null)

  const selectedUnit = selectedMaterial
    ? materials.find(m => m.id === selectedMaterial)?.unit
    : ''

  const onMaterialChange = (val) => {
    setSelectedMaterial(val)
    form.setFieldValue('unit', materials.find(m => m.id === val)?.unit || '')
  }

  const onFinish = (values) => {
    const mat = materials.find(m => m.id === values.materialId)
    const loc = locations.find(l => l.id === values.locationId)
    const newItem = {
      id: stockList.length + 1,
      materialId: values.materialId,
      materialName: mat?.name,
      unit: mat?.unit,
      qty: values.qty,
      price: values.price,
      totalPrice: values.qty * values.price,
      lot: values.lot,
      locationId: values.locationId,
      locationName: loc?.name,
      date: values.date.format('YYYY-MM-DD'),
      recordedBy: values.recordedBy,
    }
    setStockList([newItem, ...stockList])
    message.success('บันทึกรับวัตถุดิบเรียบร้อยแล้ว')
    form.resetFields()
    setSelectedMaterial(null)
  }

  const columns = [
    { title: 'วันที่',       dataIndex: 'date',         key: 'date', width: 110 },
    { title: 'วัตถุดิบ',    dataIndex: 'materialName',  key: 'materialName' },
    { title: 'จำนวน',       key: 'qty',
      render: (_, r) => `${r.qty} ${r.unit}`
    },
    { title: 'ราคา/หน่วย', dataIndex: 'price',         key: 'price',
      render: (v) => `฿${v?.toLocaleString('th-TH')}`
    },
    { title: 'มูลค่ารวม',   key: 'total',
      render: (_, r) => (
        <span style={{ fontWeight: 500, color: '#185fa5' }}>
          ฿{(r.qty * r.price).toLocaleString('th-TH')}
        </span>
      )
    },
    { title: 'Lot',          dataIndex: 'lot',           key: 'lot' },
    { title: 'โลเคชั่น',    dataIndex: 'locationName',  key: 'locationName',
      render: (_, r) => r.locationName || locations.find(l => l.id === r.locationId)?.name
    },
    { title: 'ผู้บันทึก',   dataIndex: 'recordedBy',    key: 'recordedBy',
      render: (v) => <Tag color="blue">{v}</Tag>
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Form */}
      <Card title={<><PlusOutlined /> บันทึกรับวัตถุดิบ</>} size="small">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ date: dayjs() }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="วัตถุดิบ" name="materialId" rules={[{ required: true, message: 'กรุณาเลือกวัตถุดิบ' }]}>
                <Select placeholder="เลือกวัตถุดิบ" onChange={onMaterialChange} showSearch
                  filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
                  {materials.map(m => <Option key={m.id} value={m.id}>{m.name}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="จำนวน" name="qty" rules={[{ required: true, message: 'กรุณากรอกจำนวน' }]}>
                <InputNumber min={0} style={{ width: '100%' }} addonAfter={selectedUnit || '-'} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="ราคา/หน่วย (บาท)" name="price" rules={[{ required: true, message: 'กรุณากรอกราคา' }]}>
                <InputNumber min={0} style={{ width: '100%' }} prefix="฿" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Lot Number" name="lot" rules={[{ required: true, message: 'กรุณากรอก Lot' }]}>
                <Input placeholder="LOT-6801" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="วันที่รับ" name="date" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="โลเคชั่น" name="locationId" rules={[{ required: true, message: 'กรุณาเลือกโลเคชั่น' }]}>
                <Select placeholder="เลือกโลเคชั่น">
                  {locations.map(l => (
                    <Option key={l.id} value={l.id}>
                      {l.name} (ว่าง {l.maxPallets - l.usedPallets} พาเลท)
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={<span>ผู้บันทึก <span style={{ color: '#e24b4a', fontSize: 12 }}>* จำเป็นต้องกรอก</span></span>}
                name="recordedBy"
                rules={[{ required: true, message: 'กรุณากรอกชื่อผู้บันทึก' }]}
              >
                <Input placeholder="กรอกชื่อผู้บันทึก..." />
              </Form.Item>
            </Col>
            <Col span={8} style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 24 }}>
              <Button type="primary" htmlType="submit" style={{ width: '100%', background: '#185fa5' }}>
                บันทึกรับวัตถุดิบ
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Table */}
      <Card title="ประวัติรับวัตถุดิบ" size="small">
        <Table
          columns={columns}
          dataSource={stockList.map(s => ({ ...s, key: s.id }))}
          size="small"
          pagination={{ pageSize: 10 }}
        />
      </Card>

    </div>
  )
}

export default StockIn