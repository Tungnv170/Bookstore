import React from 'react';
import { Layout, Menu } from 'antd';
import { ShoppingCartOutlined, BookOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const MainLayout = ({ children, currentScreen, onScreenChange }) => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center', background: '#001529' }}>
                <div style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                    📚 Hệ thống Quản lý Cửa hàng Sách
                </div>
            </Header>
            <Layout>
                <Sider width={200} style={{ background: '#fff' }}>
                    <Menu
                        mode="inline"
                        selectedKeys={[currentScreen]}
                        style={{ height: '100%', borderRight: 0 }}
                        items={[
                            {
                                key: 'pos',
                                icon: <ShoppingCartOutlined />,
                                label: 'Bán hàng',
                                onClick: () => onScreenChange('pos')
                            },
                            {
                                key: 'inventory',
                                icon: <BookOutlined />,
                                label: 'Quản lý kho',
                                onClick: () => onScreenChange('inventory')
                            }
                        ]}
                    />
                </Sider>
                <Layout style={{ background: '#f0f2f5' }}>
                    <Content>
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default MainLayout;