import React, { useState, useEffect } from 'react';
import { Card, Button, message, Modal, Form, Row, Col, Statistic, Spin } from 'antd';
import { PlusOutlined, BookOutlined } from '@ant-design/icons';
import BookTable from './BookTable';
import BookForm from './BookForm';
import { bookApi } from '../../api/bookstoreApi';

const InventoryScreen = () => {
    const [books, setBooks] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const response = await bookApi.getAll();
            setBooks(response.data);
        } catch (error) {
            message.error('Lỗi khi tải danh sách sách!');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const categories = [...new Set(books.map(book => book.category))];

    const showAddModal = () => {
        setEditingBook(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const showEditModal = (book) => {
        setEditingBook(book);
        form.setFieldsValue(book);
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        form.validateFields().then(async (values) => {
            try {
                setLoading(true); // Thêm loading khi save
                if (editingBook) {
                    // Update book
                    await bookApi.update(editingBook.bookId, values);
                    message.success('Cập nhật sách thành công!');
                } else {
                    // Add new book
                    await bookApi.create(values);
                    message.success('Thêm sách mới thành công!');
                }

                setIsModalVisible(false);
                form.resetFields();
                await fetchBooks();
            } catch (error) {
                message.error('Có lỗi xảy ra!');
                console.error(error);
            } finally {
                setLoading(false); // Tắt loading
            }
        });
    };

    const handleDelete = (bookId) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa sách này?',
            onOk: async () => {
                try {
                    setLoading(true); // Thêm loading khi delete
                    await bookApi.delete(bookId);
                    message.success('Xóa sách thành công!');
                    await fetchBooks();
                } catch (error) {
                    message.error('Lỗi khi xóa sách!');
                    console.error(error);
                } finally {
                    setLoading(false); // Tắt loading
                }
            }
        });
    };

    const updateStock = async (bookId, change) => {
        try {
            setLoading(true); // Thêm loading khi update stock
            await bookApi.updateStock(bookId, change);
            message.success('Cập nhật tồn kho thành công!');
            await fetchBooks();
        } catch (error) {
            message.error('Lỗi khi cập nhật tồn kho!');
            console.error(error);
        } finally {
            setLoading(false); // Tắt loading
        }
    };

    return (
        <Spin spinning={loading} tip="Đang xử lý...">
            <div style={{ padding: 24 }}>
                <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Tổng số sách"
                                value={books.length}
                                prefix={<BookOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Tổng tồn kho"
                                value={books.reduce((sum, book) => sum + book.stockQuantity, 0)}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Sách sắp hết"
                                value={books.filter(book => book.stockQuantity < 5).length}
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Card>
                    </Col>
                </Row>

                <Card
                    title="Quản lý kho hàng"
                    extra={
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={showAddModal}
                        >
                            Thêm sách mới
                        </Button>
                    }
                >
                    <BookTable
                        books={books}
                        onEdit={showEditModal}
                        onDelete={handleDelete}
                        onUpdateStock={updateStock}
                    />
                </Card>

                <BookForm
                    visible={isModalVisible}
                    editingBook={editingBook}
                    categories={categories}
                    form={form}
                    onOk={handleModalOk}
                    onCancel={() => setIsModalVisible(false)}
                />
            </div>
        </Spin>
    );
};

export default InventoryScreen;