import React from 'react';
import { Modal, Form, Input, Select, InputNumber } from 'antd';

const { Option } = Select;

const BookForm = ({
    visible,
    editingBook,
    categories,
    form,
    onOk,
    onCancel
}) => {
    return (
        <Modal
            title={editingBook ? 'Sửa thông tin sách' : 'Thêm sách mới'}
            open={visible}
            onOk={onOk}
            onCancel={onCancel}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
            >
                <Form.Item
                    name="title"
                    label="Tên sách"
                    rules={[{ required: true, message: 'Vui lòng nhập tên sách!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="author"
                    label="Tác giả"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="category"
                    label="Thể loại"
                >
                    <Select>
                        {categories.map(cat => (
                            <Option key={cat} value={cat}>{cat}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="retailPrice"
                    label="Giá bán"
                    rules={[{ required: true, message: 'Vui lòng nhập giá bán!' }]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    />
                </Form.Item>
                <Form.Item
                    name="stockQuantity"
                    label="Số lượng"
                    rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                >
                    <InputNumber style={{ width: '100%' }} min={0} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BookForm;