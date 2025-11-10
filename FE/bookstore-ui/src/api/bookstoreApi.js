import axios from 'axios';

// Thay đổi URL này theo port của Backend API của bạn
const API_BASE_URL = 'https://localhost:7222/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Books API
export const bookApi = {
    // Lấy tất cả sách (có thể search và filter)
    getAll: (search = '', category = '') =>
        api.get(`/books?search=${search}&category=${category}`),

    // Lấy sách theo ID
    getById: (id) =>
        api.get(`/books/${id}`),

    // Tạo sách mới
    create: (book) =>
        api.post('/books', book),

    // Cập nhật sách
    update: (id, book) =>
        api.put(`/books/${id}`, book),

    // Xóa sách
    delete: (id) =>
        api.delete(`/books/${id}`),

    // Cập nhật số lượng tồn kho
    updateStock: (id, quantity) =>
        api.patch(`/books/${id}/stock`, quantity, {
            headers: { 'Content-Type': 'application/json' }
        }),
};

// Orders API
export const orderApi = {
    // Lấy tất cả đơn hàng
    getAll: () =>
        api.get('/orders'),

    // Lấy đơn hàng theo ID
    getById: (id) =>
        api.get(`/orders/${id}`),

    // Tạo đơn hàng mới
    create: (order) =>
        api.post('/orders', order),
};

export default api;