import React from 'react';
import { Card, Input, Select, Space, Tag, Badge } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const BookList = ({
    books,
    categories,
    searchTerm,
    selectedCategory,
    onSearchChange,
    onCategoryChange,
    onBookClick
}) => {
    return (
        <Card
            title="Danh sách sách"
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            bodyStyle={{ flex: 1, overflow: 'auto' }}
        >
            <Space style={{ marginBottom: 16, width: '100%' }}>
                <Input
                    placeholder="Tìm kiếm sách hoặc tác giả..."
                    prefix={<SearchOutlined />}
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    style={{ width: 300 }}
                />
                <Select
                    placeholder="Lọc theo thể loại"
                    value={selectedCategory}
                    onChange={onCategoryChange}
                    style={{ width: 200 }}
                    allowClear
                >
                    {categories.map(cat => (
                        <Option key={cat} value={cat}>{cat}</Option>
                    ))}
                </Select>
            </Space>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
                {books.map(book => (
                    <Card
                        key={book.bookId}
                        hoverable
                        onClick={() => onBookClick(book)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div style={{ marginBottom: 8 }}>
                            <strong style={{ fontSize: 16 }}>{book.title}</strong>
                        </div>
                        <div style={{ color: '#666', marginBottom: 4 }}>
                            {book.author}
                        </div>
                        <Tag color="blue" style={{ marginBottom: 8 }}>{book.category}</Tag>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 18, fontWeight: 'bold', color: '#1890ff' }}>
                                {book.retailPrice.toLocaleString('vi-VN')}đ
                            </span>
                            <Badge
                                count={book.stockQuantity}
                                style={{ backgroundColor: book.stockQuantity < 5 ? '#ff4d4f' : '#52c41a' }}
                            />
                        </div>
                    </Card>
                ))}
            </div>
        </Card>
    );
};

export default BookList;