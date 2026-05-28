import { Layout, Menu } from 'antd'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import {
    DashboardOutlined,
    ImportOutlined,
    ExportOutlined,
    InboxOutlined,
    EnvironmentOutlined,
    GiftOutlined,
    OrderedListOutlined,
    BarChartOutlined,
    SettingOutlined,
} from '@ant-design/icons'

const { Sider, Header, Content } = Layout

const menuItems = [
    {
        type: 'group', label: 'หลัก', children: [
            { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
            { key: '/stock-in', icon: <ImportOutlined />, label: 'รับวัตถุดิบ' },
            { key: '/stock-out', icon: <ExportOutlined />, label: 'เบิกวัตถุดิบ' },
        ]
    },
    {
        type: 'group', label: 'คลังสินค้า', children: [
            { key: '/inventory', icon: <InboxOutlined />, label: 'คลังสินค้า' },
            { key: '/location', icon: <EnvironmentOutlined />, label: 'โลเคชั่น' },
        ]
    },
    {
        type: 'group', label: 'การผลิต', children: [
            { key: '/finish-goods', icon: <GiftOutlined />, label: 'Finish Goods' },
            { key: '/production', icon: <OrderedListOutlined />, label: 'แผนการผลิต' },
        ]
    },
    {
        type: 'group', label: 'ระบบ', children: [
            { key: '/reports', icon: <BarChartOutlined />, label: 'รายงาน' },
            { key: '/settings', icon: <SettingOutlined />, label: 'ตั้งค่า' },
        ]
    },
]

const pageTitles = {
    '/dashboard': 'Dashboard — ภาพรวมคลัง',
    '/stock-in': 'รับวัตถุดิบ',
    '/stock-out': 'เบิกวัตถุดิบ',
    '/inventory': 'คลังสินค้า — ยอดคงเหลือ',
    '/location': 'โลเคชั่น & พาเลท',
    '/finish-goods': 'Finish Goods & BOM',
    '/production': 'แผนการผลิต',
    '/reports': 'รายงาน & สถิติ',
    '/settings': 'ตั้งค่าระบบ',
}

function AppLayout() {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                width={220}
                style={{
                    background: '#1a2035',
                    position: 'fixed',
                    height: '100vh',
                    left: 0,
                    top: 0,
                }}
            >
                {/* Logo */}
                <div style={{
                    padding: '20px 16px 12px',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                }}>
                    <div style={{ color: '#fff', fontSize: 15, fontWeight: 500 }}>
                        🏭 WMS Pro
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2 }}>
                        Warehouse Management
                    </div>
                </div>

                {/* Menu */}
                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    onClick={({ key }) => navigate(key)}
                    items={menuItems}
                    style={{
                        background: '#1a2035',
                        border: 'none',
                        marginTop: 8,
                    }}
                    theme="dark"
                />

                {/* User Info */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    padding: '12px 16px',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: '#185fa5',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#7eb8f7', fontSize: 11, fontWeight: 500, flexShrink: 0,
                    }}>
                        MA
                    </div>
                    <div>
                        <div style={{ color: '#fff', fontSize: 12, fontWeight: 500 }}>Admin</div>
                        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10 }}>🔴 Master Admin</div>
                    </div>
                </div>
            </Sider>

            <Layout style={{ marginLeft: 220 }}>
                {/* Topbar */}
                <Header style={{
                    background: '#fff',
                    borderBottom: '1px solid #f0f0f0',
                    padding: '0 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                }}>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>
                        {pageTitles[location.pathname] || 'WMS Pro'}
                    </div>
                    <div style={{ fontSize: 13, color: '#888' }}>
                        {new Date().toLocaleDateString('th-TH', {
                            year: 'numeric', month: 'long', day: 'numeric'
                        })}
                    </div>
                </Header>

                {/* Page Content */}
                <Content style={{ padding: 24, background: '#f5f5f5' }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    )
}

export default AppLayout