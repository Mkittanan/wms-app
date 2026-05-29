import { useState } from 'react'
import { Card, Table, Tag, Button, Modal, Form, Input, Select, message, Alert, Row, Col, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, LockOutlined, UserOutlined } from '@ant-design/icons'
import { users as initialUsers } from '../data/mockData'

const { Option } = Select

const roleConfig = {
  master_admin: { label: 'Master Admin', color: 'red',    emoji: '🔴' },
  admin:        { label: 'Admin',        color: 'gold',   emoji: '🟡' },
  staff:        { label: 'Staff',        color: 'green',  emoji: '🟢' },
  viewer:       { label: 'Viewer',       color: 'blue',   emoji: '🔵' },
}

const rolePermissions = {
  master_admin: { รับของ: true,  เบิกของ: true,  ดูรายงาน: true,  export: true,  ตั้งค่า: true,  จัดการUser: true  },
  admin:        { รับของ: true,  เบิกของ: true,  ดูรายงาน: true,  export: true,  ตั้งค่า: false, จัดการUser: false },
  staff:        { รับของ: true,  เบิกของ: true,  ดูรายงาน: false, export: false, ตั้งค่า: false, จัดการUser: false },
  viewer:       { รับของ: false, เบิกของ: false, ดูรายงาน: true,  export: false, ตั้งค่า: false, จัดการUser: false },
}

function Settings() {
  const [users, setUsers]         = useState(initialUsers)
  const [addModal, setAddModal]   = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [addForm]  = Form.useForm()
  const [editForm] = Form.useForm()

  const currentUser = users.find(u => u.role === 'master_admin')

  const onAddUser = (values) => {
    const newUser = {
      id: users.length + 1,
      name: values.name,
      role: values.role,
    }
    setUsers([...users, newUser])
    message.success('เพิ่มผู้ใช้เรียบร้อยแล้ว')
    setAddModal(false)
    addForm.resetFields()
  }

  const onEditUser = (values) => {
    setUsers(users.map(u => u.id === editTarget.id ? { ...u, ...values } : u))
    message.success('แก้ไขข้อมูลเรียบร้อยแล้ว')
    setEditModal(false)
    editForm.resetFields()
    setEditTarget(null)
  }

  const onDeleteUser = (id) => {
    if (id === currentUser?.id) {
      message.error('ไม่สามารถลบตัวเองได้')
      return
    }
    setUsers(users.filter(u => u.id !== id))
    message.success('ลบผู้ใช้เรียบร้อยแล้ว')
  }

  const openEdit = (user) => {
    setEditTarget(user)
    editForm.setFieldsValue({ name: user.name, role: user.role })
    setEditModal(true)
  }

  const permColumns = [
    { title: 'สิทธิ์',       dataIndex: 'perm', key: 'perm', width: 140 },
    ...Object.keys(roleConfig).map(role => ({
      title: <span>{roleConfig[role].emoji} {roleConfig[role].label}</span>,
      key: role,
      width: 120,
      align: 'center',
      render: (_, r) => rolePermissions[role][r.perm]
        ? <Tag color="success">✓ ได้</Tag>
        : <Tag color="default">✗ ไม่ได้</Tag>
    }))
  ]

  const permData = [
    { key: 'รับของ',      perm: 'รับของ' },
    { key: 'เบิกของ',     perm: 'เบิกของ' },
    { key: 'ดูรายงาน',   perm: 'ดูรายงาน' },
    { key: 'export',      perm: 'export' },
    { key: 'ตั้งค่า',    perm: 'ตั้งค่า' },
    { key: 'จัดการUser', perm: 'จัดการUser' },
  ]

  const userColumns = [
    { title: 'ชื่อ', dataIndex: 'name', key: 'name',
      render: (v) => (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: '#e6f1fb', color: '#185fa5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 500, flexShrink: 0,
          }}>
            {v.charAt(0)}
          </div>
          {v}
        </span>
      )
    },
    { title: 'Role', dataIndex: 'role', key: 'role',
      render: (v) => (
        <Tag color={roleConfig[v]?.color}>
          {roleConfig[v]?.emoji} {roleConfig[v]?.label}
        </Tag>
      )
    },
    { title: 'สิทธิ์', key: 'perms',
      render: (_, r) => (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {Object.entries(rolePermissions[r.role])
            .filter(([, v]) => v)
            .map(([k]) => <Tag key={k} style={{ fontSize: 11 }}>{k}</Tag>)
          }
        </div>
      )
    },
    { title: '', key: 'action', width: 120,
      render: (_, r) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)}>
            แก้ไข
          </Button>
          <Popconfirm
            title="ยืนยันการลบผู้ใช้นี้?"
            onConfirm={() => onDeleteUser(r.id)}
            okText="ลบ" cancelText="ยกเลิก" okButtonProps={{ danger: true }}
          >
            <Button size="small" danger disabled={r.id === currentUser?.id}>
              ลบ
            </Button>
          </Popconfirm>
        </div>
      )
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      <Alert
        type="warning"
        showIcon
        icon={<LockOutlined />}
        message="หน้านี้เข้าได้เฉพาะ Master Admin เท่านั้น — การเปลี่ยนแปลงใดๆ จะมีผลกับระบบทันที"
      />

      {/* User Management */}
      <Card
        title={<><UserOutlined /> จัดการผู้ใช้งาน</>}
        size="small"
        extra={
          <Button type="primary" icon={<PlusOutlined />}
            style={{ background: '#185fa5' }}
            onClick={() => setAddModal(true)}>
            เพิ่มผู้ใช้
          </Button>
        }
      >
        <Table
          columns={userColumns}
          dataSource={users.map(u => ({ ...u, key: u.id }))}
          size="small"
          pagination={false}
        />
      </Card>

      {/* Permission Table */}
      <Card title={<><LockOutlined /> ตารางสิทธิ์การใช้งาน</>} size="small">
        <Table
          columns={permColumns}
          dataSource={permData}
          size="small"
          pagination={false}
          bordered
        />
      </Card>

      {/* System Info */}
      <Card title="ข้อมูลระบบ" size="small">
        <Row gutter={16}>
          <Col span={8}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>เวอร์ชั่น</div>
            <div style={{ fontWeight: 500 }}>WMS Pro v1.0.0</div>
          </Col>
          <Col span={8}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Phase ปัจจุบัน</div>
            <div style={{ fontWeight: 500 }}>
              <Tag color="blue">Phase 1 — Prototype</Tag>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Database</div>
            <div style={{ fontWeight: 500 }}>
              <Tag color="orange">localStorage (Mock)</Tag>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Add User Modal */}
      <Modal title="เพิ่มผู้ใช้งานใหม่" open={addModal}
        onCancel={() => { setAddModal(false); addForm.resetFields() }}
        footer={null}>
        <Form form={addForm} layout="vertical" onFinish={onAddUser} style={{ marginTop: 16 }}>
          <Form.Item label="ชื่อ-นามสกุล" name="name" rules={[{ required: true, message: 'กรุณากรอกชื่อ' }]}>
            <Input placeholder="ชื่อ นามสกุล" />
          </Form.Item>
          <Form.Item label="Role" name="role" rules={[{ required: true, message: 'กรุณาเลือก Role' }]}>
            <Select placeholder="เลือก Role">
              {Object.entries(roleConfig).map(([key, val]) => (
                <Option key={key} value={key}>
                  {val.emoji} {val.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => setAddModal(false)} style={{ marginRight: 8 }}>ยกเลิก</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#185fa5' }}>เพิ่มผู้ใช้</Button>
          </div>
        </Form>
      </Modal>

      {/* Edit User Modal */}
      <Modal title="แก้ไขข้อมูลผู้ใช้" open={editModal}
        onCancel={() => { setEditModal(false); editForm.resetFields(); setEditTarget(null) }}
        footer={null}>
        <Form form={editForm} layout="vertical" onFinish={onEditUser} style={{ marginTop: 16 }}>
          <Form.Item label="ชื่อ-นามสกุล" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Role" name="role" rules={[{ required: true }]}>
            <Select>
              {Object.entries(roleConfig).map(([key, val]) => (
                <Option key={key} value={key}>
                  {val.emoji} {val.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => setEditModal(false)} style={{ marginRight: 8 }}>ยกเลิก</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#185fa5' }}>บันทึก</Button>
          </div>
        </Form>
      </Modal>

    </div>
  )
}

export default Settings