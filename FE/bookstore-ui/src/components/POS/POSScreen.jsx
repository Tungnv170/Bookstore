import React, { useState, useEffect } from 'react';
import { message, Modal, Spin } from 'antd';
import BookList from './BookList';
import Cart from './Cart';
import { bookApi, orderApi } from '../../api/bookstoreApi';

const POSScreen = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBooks();
    }, []);

    useEffect(() => {
        let filtered = books;

        if (searchTerm) {
            filtered = filtered.filter(book =>
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (book.author && book.author.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter(book => book.category === selectedCategory);
        }

        setFilteredBooks(filtered);
    }, [books, searchTerm, selectedCategory]);

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

    const addToCart = (book) => {
        const existingItem = cart.find(item => item.bookId === book.bookId);

        if (existingItem) {
            if (existingItem.quantity < book.stockQuantity) {
                setCart(cart.map(item =>
                    item.bookId === book.bookId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                ));
            } else {
                message.warning('Không đủ hàng trong kho!');
            }
        } else {
            if (book.stockQuantity > 0) {
                setCart([...cart, { ...book, quantity: 1 }]);
            } else {
                message.warning('Sách này đã hết hàng!');
            }
        }
    };

    const updateCartQuantity = (bookId, newQuantity) => {
        const book = books.find(b => b.bookId === bookId);

        if (newQuantity > book.stockQuantity) {
            message.warning('Không đủ hàng trong kho!');
            return;
        }

        if (newQuantity <= 0) {
            removeFromCart(bookId);
        } else {
            setCart(cart.map(item =>
                item.bookId === bookId
                    ? { ...item, quantity: newQuantity }
                    : item
            ));
        }
    };

    const removeFromCart = (bookId) => {
        setCart(cart.filter(item => item.bookId !== bookId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const getTotalAmount = () => {
        return cart.reduce((total, item) => total + (item.retailPrice * item.quantity), 0);
    };

    // --- SỬA ĐỂ ĐẢM BẢO ĐÚNG SỰ KIỆN VÀ LOG ---
    const handleCheckout = () => {
        console.log("Bấm nút Thanh toán!"); // Xem console để biết event đã chạy

        if (cart.length === 0) {
            message.warning('Giỏ hàng trống!');
            return;
        }

        Modal.confirm({
            title: 'Xác nhận thanh toán',
            content: `Tổng tiền: ${getTotalAmount().toLocaleString('vi-VN')}đ`,
            onOk: async () => {
                try {
                    setLoading(true);
                    const orderData = {
                        note: '',
                        orderDetails: cart.map(item => ({
                            bookId: item.bookId,
                            quantity: item.quantity
                        }))
                    };

                    // --- Logging thử kiểm tra dữ liệu gửi lên ---
                    console.log("Gửi dữ liệu create order:", orderData);

                    await orderApi.create(orderData);
                    message.success('Thanh toán thành công!');
                    clearCart();
                    await fetchBooks();
                } catch (error) {
                    // Show error message từ response của BE nếu có
                    message.error(
                        error?.response?.data || 'Lỗi khi thanh toán!'
                    );
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    return (
        <Spin spinning={loading} tip="Đang xử lý...">
            <div style={{ display: 'flex', height: 'calc(100vh - 64px)', gap: 16, padding: 16 }}>
                {/* Left: Book List (70%) */}
                <div style={{ flex: 7, display: 'flex', flexDirection: 'column' }}>
                    <BookList
                        books={filteredBooks}
                        categories={categories}
                        searchTerm={searchTerm}
                        selectedCategory={selectedCategory}
                        onSearchChange={setSearchTerm}
                        onCategoryChange={setSelectedCategory}
                        onBookClick={addToCart}
                    />
                </div>
                {/* Right: Cart (30%) */}
                <div style={{ flex: 3, display: 'flex', flexDirection: 'column' }}>
                    <Cart
                        cart={cart}
                        onUpdateQuantity={updateCartQuantity}
                        onRemoveItem={removeFromCart}
                        onClearCart={clearCart}
                        onCheckout={handleCheckout}
                    />
                </div>
            </div>
        </Spin>
    );
};

export default POSScreen;