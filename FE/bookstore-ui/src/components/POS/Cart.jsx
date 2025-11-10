import React from 'react';
import { Card, Button, InputNumber, Space } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined, PlusOutlined, MinusOutlined, CheckCircleOutlined } from '@ant-design/icons';

const Cart = ({
    cart,
    onUpdateQuantity,
    onRemoveItem,
    onClearCart,
    onCheckout
}) => {
    const getTotalAmount = () => {
        return cart.reduce((total, item) => total + (item.retailPrice * item.quantity), 0);
    };

    return (
        <Card
            title={
                <span>
                    <ShoppingCartOutlined /> Giỏ hàng ({cart.length})
                </span>
            }
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 16 }}
        >
            <div style={{ flex: 1, overflow: 'auto', marginBottom: 16 }}>
                {cart.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#999', marginTop: 40 }}>
                        Giỏ hàng trống
                    </div>
                ) : (
                    cart.map(item => (
                        <div key={item.bookId} style={{
                            borderBottom: '1px solid #f0f0f0',
                            padding: '12px 0',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <strong>{item.title}</strong>
                                <Button
                                    type="text"
                                    danger
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    onClick={() => onRemoveItem(item.bookId)}
                                />
                            </div>
                            <div style={{ fontSize: 14, color: '#1890ff' }}>
                                {item.retailPrice.toLocaleString('vi-VN')}đ
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Space>
                                    <Button
                                        size="small"
                                        icon={<MinusOutlined />}
                                        onClick={() => onUpdateQuantity(item.bookId, item.quantity - 1)}
                                    />
                                    <InputNumber
                                        size="small"
                                        min={1}
                                        max={item.stockQuantity}
                                        value={item.quantity}
                                        onChange={(value) => onUpdateQuantity(item.bookId, value)}
                                        style={{ width: 60 }}
                                    />
                                    <Button
                                        size="small"
                                        icon={<PlusOutlined />}
                                        onClick={() => onUpdateQuantity(item.bookId, item.quantity + 1)}
                                    />
                                </Space>
                                <strong style={{ fontSize: 16 }}>
                                    {(item.retailPrice * item.quantity).toLocaleString('vi-VN')}đ
                                </strong>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div style={{ borderTop: '2px solid #1890ff', paddingTop: 16 }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 16,
                    fontSize: 20,
                    fontWeight: 'bold'
                }}>
                    <span>Tổng cộng:</span>
                    <span style={{ color: '#1890ff' }}>
                        {getTotalAmount().toLocaleString('vi-VN')}đ
                    </span>
                </div>
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Button
                        type="primary"
                        size="large"
                        block
                        icon={<CheckCircleOutlined />}
                        onClick={() => {
                            console.log('Đã bấm nút Thanh toán trong Cart');
                            onCheckout();
                        }}
                        disabled={cart.length === 0}
                    >
                        Thanh toán
                    </Button>
                    <Button
                        danger
                        size="large"
                        block
                        onClick={onClearCart}
                        disabled={cart.length === 0}
                    >
                        Hủy đơn
                    </Button>
                </Space>
            </div>
        </Card>
    );
};

export default Cart;