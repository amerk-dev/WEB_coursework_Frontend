import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Link } from "react-router-dom"
import axios from 'axios'
import './Cart.css'

interface CartItem {
    id: number
    watch: {
        id: number
        name: string
        price: string
        image: string
    }
    quantity: number
    total_price: string
}

export default function Cart() {
    const { token } = useAuth()
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const fetchCart = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart/carts/my-cart/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setCartItems(response.data.items)
        } catch (err) {
            setError('Ошибка загрузки корзины')
        } finally {
            setLoading(false)
        }
    }

    const updateQuantity = async (itemId: number, newQuantity: number) => {
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/cart/carts/update-item/`,
                {
                    item_id: itemId,
                    quantity: newQuantity
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            fetchCart()
        } catch (err) {
            setError('Ошибка обновления количества')
        }
    }

    const removeItem = async (itemId: number) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/api/cart/carts/remove-item/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    data: { item_id: itemId }
                }
            )
            fetchCart()
        } catch (err) {
            setError('Ошибка удаления товара')
        }
    }

    const totalAmount = cartItems.reduce(
        (sum, item) => sum + parseFloat(item.total_price),
        0
    )

    useEffect(() => {
        if (token) fetchCart()
    }, [token])

    if (!token) {
        return (
            <div className="cart-container unauthorized">
                <h2 className="cart-title">Корзина</h2>
                <div className="cart-auth-prompt">
                    <p className="prompt-message">Для просмотра корзины необходимо авторизоваться</p>
                    <Link to="/login" className="login-button">
                        Войти
                    </Link>
                </div>
            </div>
        )
    }

    if (loading) return <div className="cart-loading">Загрузка корзины...</div>
    if (error) return <div className="cart-error">{error}</div>

    return (
        <div className="cart-container">
            <h2 className="cart-title">Корзина</h2>

            {cartItems.length === 0 ? (
                <div className="cart-empty">
                    <p className="empty-message">Ваша корзина пуста</p>
                    <Link to="/" className="continue-shopping">
                        Перейти к покупкам
                    </Link>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-items-list">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <img
                                    src={item.watch.image}
                                    alt={item.watch.name}
                                    className="item-image"
                                />
                                <div className="item-details">
                                    <h3 className="item-name">
                                        <Link to={`/watches/${item.watch.id}`}>
                                            {item.watch.name}
                                        </Link>
                                    </h3>
                                    <div className="item-controls">
                                        <div className="quantity-control">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="quantity-btn"
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <span className="quantity-value">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="quantity-btn"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="remove-item"
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </div>
                                <div className="item-pricing">
                                    <div className="item-total">
                                        {parseFloat(item.total_price).toLocaleString('ru-RU')} ₽
                                    </div>
                                    <div className="item-price">
                                        {parseFloat(item.watch.price).toLocaleString('ru-RU')} ₽ / шт
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <div className="total-amount">
                            Итого: {totalAmount.toLocaleString('ru-RU')} ₽
                        </div>
                        <button className="checkout-button">
                            Оформить заказ
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}