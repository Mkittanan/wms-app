import { useState } from 'react'
import { Form, Select, InputNumber, Input, DatePicker, Button, Table, Tag, Card, Row, Col, message, Alert } from 'antd'
import { ExportOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { materials, stockInList, stockOutList as initialData } from '../data/mockData'

const { Option } = Select

function getBalance(materialId) {
  const totalIn  = stockInList.filter(s => s.materialId === materialId).reduce((sum, s) => sum + s.qty, 0)
  const totalOut = initialData.filter(s => s.materialId === materialId).reduce((sum, s) => sum + s.qty, 0)
  return totalIn - totalOut
}

function StockOut() {
  const [form] = Form.useForm()
  const [stockList, setStockList] = useState(initialData)
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [currentBalance, setCurrentBalance] = useState(null)

  const onMaterialChange = (val) => {
    setSelectedMaterial(val)
    setCurrentBalance(getBalance(val))
  }

  const onFinish = (values) => {
    const mat = materials.find(m => m.id === values.materialId)

    if (values.qty > currentBalance) {
      message.error(`ของไม่พอ — คงเหลือ ${currentBalance} ${mat?.unit} เท่านั้น`)
      return
    }

    const newItem = {
      id: stockList.length + 1,
      materialId: values.materialId,
      materialName: mat?.name,
      unit: mat?.unit,
      qty: values.qty,
      price: mat?.price,
      date: values.date.format('YYYY-MM-DD'),
      receivedBy: values.receivedBy,
      purpose: values.purpose,
      recordedBy: values.recordedBy,
    }
    setStockList([newItem, ...stockList])
    message.success('บันทึกเบิกวัตถุดิบเรียบร้อยแล้ว')
    form.resetFields()
    setSelectedMaterial(null)
    setCurrentBalance(null)
  }

  const columns = [
    { title: 'วันที่',      dataIndex: 'date',         key: 'date', width: 110 },
    { title: 'วัตถุดิบ',   dataIndex: 'materialName',  key: 'materialName',
      render: (_, r) => r.materialName || materials.find(m => m.id === r.materialId)?.name
    },
    { title: 'จำนวน',      key: 'qty',
      render: (_, r) => {
        const unit = r.unit || materials.find(m => m.id === r.materialId)?.unit
        return `${r.qty} ${unit}`
      }
    },
    { title: 'มูลค่ารวม',  key: 'total',
      render: (_, r) => {
        const price = r.price || materials.find(m => m.id === r.materialId)?.price
        return <span style={{ fontWeight: 500, color: '#d85a30' }}>฿{(r.qty * price).toLocaleString('th-TH')}</span>
      }
    },
    { title: 'ผู้รับ',      dataIndex: 'receivedBy',   key: 'receivedBy' },
    { title: 'วัตถุประสงค์', dataIndex: 'purpose',     key: 'purpose',
      render: (v) => <Tag>{v}</Tag>
    },
    { title: 'ผู้บันทึก',  dataIndex: 'recordedBy',   key: 'recordedBy',
      render: (v) => <Tag color="orange">{v}</Tag>
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Form */}
      <Card title={<><ExportOutlined /> บันทึกเบิกวัตถุดิบ</>} size="small">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ date: dayjs(), purpose: 'ผลิต' }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="วัตถุดิบ" name="materialId" rules={[{ required: true, message: 'กรุณาเลือกวัตถุดิบ' }]}>
                <Select placeholder="เลือกวัตถุดิบ" onChange={onMaterialChange} showSearch
                  filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
                  {materials.map(m => (
                    <Option key={m.id} value={m.id}>
                      {m.name} (คงเหลือ {getBalance(m.id)} {m.unit})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              {currentBalance !== null && (
                <div style={{ marginTop: -16, marginBottom: 8, fontSize: 12 }}>
                  {currentBalance > 0
                    ? <span style={{ color: '#3b6d11' }}>✓ คงเหลือ {currentBalance} {materials.find(m => m.id === selectedMaterial)?.unit}</span>
                    : <span style={{ color: '#e24b4a' }}>✗ ของหมดแล้ว ไม่สามารถเบิกได้</span>
                  }
                </div>
              )}
            </Col>
            <Col span={4}>
              <Form.Item label="จำนวนที่เบิก" name="qty" rules={[{ required: true, message: 'กรุณากรอกจำนวน' }]}>
                <InputNumber
                  min={1}
                  max={currentBalance || undefined}
                  style={{ width: '100%' }}
                  addonAfter={selectedMaterial ? materials.find(m => m.id === selectedMaterial)?.unit : '-'}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="วัตถุประสงค์" name="purpose" rules={[{ required: true }]}>
                <Select>
                  <Option value="ผลิต">ผลิต</Option>
                  <Option value="ทดสอบ">ทดสอบ</Option>
                  <Option value="สูญเสีย">สูญเสีย</Option>
                  <Option value="อื่นๆ">อื่นๆ</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="วันที่เบิก" name="date" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="ผู้รับวัตถุดิบ" name="receivedBy" rules={[{ required: true, message: 'กรุณากรอกชื่อผู้รับ' }]}>
                <Input placeholder="ชื่อผู้รับ / หน้างาน..." />
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
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: '100%', background: '#d85a30', borderColor: '#d85a30' }}
                disabled={currentBalance !== null && currentBalance <= 0}
              >
                บันทึกการเบิก
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Table */}
      <Card title="ประวัติเบิกวัตถุดิบ" size="small">
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

export default StockOut