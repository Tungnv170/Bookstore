import React from 'react';
import { Table, Button, Space, Tag, Badge } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

const BookTable = ({
    books,
    onEdit,
    onDelete,
    onUpdateStock
}) => {
    const columns = [
        {
            title: 'Mã',
            dataIndex: 'bookId',
            key: 'bookId',
            width: 70
        },
        {
            title: 'Tên sách',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            key: 'author',
        },
        {
            title: 'Thể loại',
            dataIndex: 'category',
            key: 'category',
            render: (category) => <Tag color="blue">{category}</Tag>
        },
        {
            title: 'Giá bán',
            dataIndex: 'retailPrice',
            key: 'retailPrice',
            render: (price) => `${price.toLocaleString('vi-VN')}đ`
        },
        {
            title: 'Tồn kho',
            dataIndex: 'stockQuantity',
            key: 'stockQuantity',
            render: (stock) => (
                <Badge
                    count={stock}
                    style={{ backgroundColor: stock < 5 ? '#ff4d4f' : stock < 10 ? '#faad14' : '#52c41a' }}
                />
            )
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => onEdit(record)}
                    >
                        Sửa
                    </Button>
                    <Button
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => onUpdateStock(record.bookId, 10)}
                    >
                        +10
                    </Button>
                    <Button
                        size="small"
                        icon={<MinusOutlined />}
                        onClick={() => onUpdateStock(record.bookId, -1)}
                        disabled={record.stockQuantity === 0}
                    >
                        -1
                    </Button>
                    <Button
                        danger
                        size="small"
                        onClick={() => onDelete(record.bookId)}
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={books}
            rowKey="bookId"
            pagination={{ pageSize: 10 }}
        />
    );
};

export default BookTable;