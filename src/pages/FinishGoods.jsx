import { useState } from 'react'
import { Card, Row, Col, Table, Tag, Button, Modal, Form, Input, InputNumber, Select, message, Divider } from 'antd'
import { PlusOutlined, DeleteOutlined, GiftOutlined } from '@ant-design/icons'
import { materials } from '../data/mockData'

const { Option } = Select

const initialFinishGoods = [
  {
    id: 1,
    name: 'คอนกรีตผสมเสร็จ C25',
    unit: 'คิว',
    bom: [
      { materialId: 1, qty: 3 },
      { materialId: 2, qty: 0.45 },
      { materialId: 4, qty: 0.9 },
    ],
    lots: [
      { lot: 'FG-6801', qty: 50, produceDate: '2569-05-20', expireDate: '2569-07-20' },
      { lot: 'FG-6802', qty: 30, produceDate: '2569-05-25', expireDate: '2569-07-25' },
    ],
  },
  {
    id: 2,
    name: 'แอสฟัลต์คอนกรีต AC',
    unit: 'ตัน',
    bom: [
      { materialId: 5, qty: 0.06 },
      { materialId: 3, qty: 0.94 },
    ],
    lots: [
      { lot: 'FG-6803', qty: 100, produceDate: '2569-05-22', expireDate: '2569-08-22' },
    ],
  },
]

function calcBomCost(bom, qty = 1) {
  return bom.reduce((sum, b) => {
    const mat = materials.find(m => m.id === b.materialId)
    return sum + (mat?.price || 0) * b.qty * qty
  }, 0)
}

function FinishGoods() {
  const [goodsList, setGoodsList]   = useState(initialFinishGoods)
  const [selected, setSelected]     = useState(goodsList[0])
  const [calcQty, setCalcQty]       = useState(1)
  const [addGoodModal, setAddGood]  = useState(false)
  const [addLotModal, setAddLot]    = useState(false)
  const [bomRows, setBomRows]       = useState([{ materialId: null, qty: 0 }])
  const [goodForm] = Form.useForm()
  const [lotForm]  = Form.useForm()

  const onAddGood = (values) => {
    const newGood = {
      id: goodsList.length + 1,
      name: values.name,
      unit: values.unit,
      bom: bomRows.filter(b => b.materialId && b.qty > 0),
      lots: [],
    }
    setGoodsList([...goodsList, newGood])
    setSelected(newGood)
    message.success('เพิ่ม Finish Good เรียบร้อยแล้ว')
    setAddGood(false)
    goodForm.resetFields()
    setBomRows([{ materialId: null, qty: 0 }])
  }

  const onAddLot = (values) => {
    const updated = goodsList.map(g => {
      if (g.id !== selected.id) return g
      return {
        ...g,
        lots: [...g.lots, {
          lot: values.lot,
          qty: values.qty,
          produceDate: values.produceDate,
          expireDate: values.expireDate,
        }]
      }
    })
    setGoodsList(updated)
    setSelected(updated.find(g => g.id === selected.id))
    message.success('เพิ่ม Lot เรียบร้อยแล้ว')
    setAddLot(false)
    lotForm.resetFields()
  }

  const bomColumns = [
    { title: 'วัตถุดิบ', key: 'mat',
      render: (_, r) => materials.find(m => m.id === r.materialId)?.name || '-'
    },
    { title: 'ปริมาณ/หน่วยผลิต', key: 'qty',
      render: (_, r) => {
        const mat = materials.find(m => m.id === r.materialId)
        return `${r.qty} ${mat?.unit || ''}`
      }
    },
    { title: `ปริมาณสำหรับ ${calcQty} ${selected?.unit}`, key: 'totalQty',
      render: (_, r) => {
        const mat = materials.find(m => m.id === r.materialId)
        return `${(r.qty * calcQty).toFixed(2)} ${mat?.unit || ''}`
      }
    },
    { title: `ต้นทุน (${calcQty} ${selected?.unit})`, key: 'cost',
      render: (_, r) => {
        const mat = materials.find(m => m.id === r.materialId)
        const cost = (mat?.price || 0) * r.qty * calcQty
        return <span style={{ color: '#185fa5', fontWeight: 500 }}>฿{cost.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
      }
    },
  ]

  const lotColumns = [
    { title: 'Lot',         dataIndex: 'lot',         key: 'lot' },
    { title: 'จำนวน',       key: 'qty',
      render: (_, r) => `${r.qty} ${selected?.unit}`
    },
    { title: 'วันผลิต',     dataIndex: 'produceDate', key: 'produceDate' },
    { title: 'วันหมดอายุ', dataIndex: 'expireDate',  key: 'expireDate',
      render: (v) => {
        const diff = Math.ceil((new Date(v) - new Date()) / 86400000)
        return (
          <span style={{ color: diff <= 14 ? '#e24b4a' : diff <= 30 ? '#ba7517' : '#3b6d11', fontWeight: 500 }}>
            {v} {diff <= 30 ? `(อีก ${diff} วัน)` : ''}
          </span>
        )
      }
    },
  ]

  const totalCost    = calcBomCost(selected?.bom || [], calcQty)
  const costPerUnit  = selected ? totalCost / calcQty : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Row gutter={16}>

        {/* Left — Product List */}
        <Col span={7}>
          <Card
            title="ผลิตภัณฑ์ทั้งหมด"
            size="small"
            extra={
              <Button size="small" type="primary" icon={<PlusOutlined />}
                style={{ background: '#185fa5' }}
                onClick={() => setAddGood(true)}>
                เพิ่ม
              </Button>
            }
          >
            {goodsList.map(g => (
              <div
                key={g.id}
                onClick={() => { setSelected(g); setCalcQty(1) }}
                style={{
                  padding: '10px 12px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  marginBottom: 6,
                  background: selected?.id === g.id ? '#e6f1fb' : '#fafafa',
                  border: `1px solid ${selected?.id === g.id ? '#185fa5' : '#f0f0f0'}`,
                }}
              >
                <div style={{ fontWeight: 500, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <GiftOutlined style={{ color: '#185fa5' }} /> {g.name}
                </div>
                <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
                  {g.bom.length} วัตถุดิบ · {g.lots.length} Lot
                </div>
              </div>
            ))}
          </Card>
        </Col>

        {/* Right — BOM Detail */}
        <Col span={17}>
          {selected && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* BOM Calculator */}
              <Card
                title={`BOM — ${selected.name}`}
                size="small"
                extra={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: '#888' }}>คำนวณสำหรับ</span>
                    <InputNumber
                      min={1} value={calcQty}
                      onChange={v => setCalcQty(v || 1)}
                      style={{ width: 80 }}
                    />
                    <span style={{ fontSize: 12, color: '#888' }}>{selected.unit}</span>
                  </div>
                }
              >
                <Table
                  columns={bomColumns}
                  dataSource={selected.bom.map((b, i) => ({ ...b, key: i }))}
                  size="small"
                  pagination={false}
                />
                <Divider style={{ margin: '12px 0' }} />
                <Row gutter={16}>
                  <Col span={8}>
                    <div style={{ fontSize: 12, color: '#888' }}>ต้นทุนวัตถุดิบรวม</div>
                    <div style={{ fontSize: 20, fontWeight: 600, color: '#185fa5' }}>
                      ฿{totalCost.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ fontSize: 12, color: '#888' }}>ต้นทุน/{selected.unit}</div>
                    <div style={{ fontSize: 20, fontWeight: 600, color: '#3b6d11' }}>
                      ฿{costPerUnit.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                    </div>
                  </Col>
                </Row>
              </Card>

              {/* Lot Table */}
              <Card
                title={`Lot ผลิต — ${selected.name}`}
                size="small"
                extra={
                  <Button size="small" type="primary" icon={<PlusOutlined />}
                    style={{ background: '#185fa5' }}
                    onClick={() => setAddLot(true)}>
                    เพิ่ม Lot
                  </Button>
                }
              >
                <Table
                  columns={lotColumns}
                  dataSource={selected.lots.map((l, i) => ({ ...l, key: i }))}
                  size="small"
                  pagination={false}
                />
              </Card>
            </div>
          )}
        </Col>
      </Row>

      {/* Add Finish Good Modal */}
      <Modal title="เพิ่ม Finish Good" open={addGoodModal}
        onCancel={() => { setAddGood(false); goodForm.resetFields(); setBomRows([{ materialId: null, qty: 0 }]) }}
        footer={null} width={600}>
        <Form form={goodForm} layout="vertical" onFinish={onAddGood} style={{ marginTop: 16 }}>
          <Row gutter={12}>
            <Col span={16}>
              <Form.Item label="ชื่อผลิตภัณฑ์" name="name" rules={[{ required: true }]}>
                <Input placeholder="เช่น คอนกรีตผสมเสร็จ C30" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="หน่วย" name="unit" rules={[{ required: true }]}>
                <Input placeholder="เช่น คิว, ตัน" />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>วัตถุดิบใน BOM (ต่อ 1 หน่วยผลิต)</div>
          {bomRows.map((row, i) => (
            <Row gutter={12} key={i} style={{ marginBottom: 8 }}>
              <Col span={14}>
                <Select placeholder="เลือกวัตถุดิบ" style={{ width: '100%' }}
                  value={row.materialId}
                  onChange={v => setBomRows(bomRows.map((r, j) => j === i ? { ...r, materialId: v } : r))}>
                  {materials.map(m => <Option key={m.id} value={m.id}>{m.name} ({m.unit})</Option>)}
                </Select>
              </Col>
              <Col span={7}>
                <InputNumber placeholder="ปริมาณ" min={0} step={0.01} style={{ width: '100%' }}
                  value={row.qty}
                  onChange={v => setBomRows(bomRows.map((r, j) => j === i ? { ...r, qty: v } : r))} />
              </Col>
              <Col span={3}>
                <Button danger icon={<DeleteOutlined />}
                  onClick={() => setBomRows(bomRows.filter((_, j) => j !== i))} />
              </Col>
            </Row>
          ))}
          <Button size="small" icon={<PlusOutlined />}
            onClick={() => setBomRows([...bomRows, { materialId: null, qty: 0 }])}
            style={{ marginBottom: 16 }}>
            เพิ่มวัตถุดิบ
          </Button>

          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => setAddGood(false)} style={{ marginRight: 8 }}>ยกเลิก</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#185fa5' }}>บันทึก</Button>
          </div>
        </Form>
      </Modal>

      {/* Add Lot Modal */}
      <Modal title={`เพิ่ม Lot — ${selected?.name}`} open={addLotModal}
        onCancel={() => { setAddLot(false); lotForm.resetFields() }}
        footer={null}>
        <Form form={lotForm} layout="vertical" onFinish={onAddLot} style={{ marginTop: 16 }}>
          <Form.Item label="Lot Number" name="lot" rules={[{ required: true }]}>
            <Input placeholder="เช่น FG-6804" />
          </Form.Item>
          <Form.Item label={`จำนวน (${selected?.unit})`} name="qty" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="วันผลิต" name="produceDate" rules={[{ required: true }]}>
                <Input placeholder="2569-05-28" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="วันหมดอายุ" name="expireDate" rules={[{ required: true }]}>
                <Input placeholder="2569-08-28" />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => setAddLot(false)} style={{ marginRight: 8 }}>ยกเลิก</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#185fa5' }}>บันทึก</Button>
          </div>
        </Form>
      </Modal>

    </div>
  )
}

export default FinishGoods