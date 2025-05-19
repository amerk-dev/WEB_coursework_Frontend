import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Link } from "react-router-dom"
import axios from 'axios'

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

    // Получение корзины
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

    // Изменение количества
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

    // Удаление товара
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

    // Общая сумма
    const totalAmount = cartItems.reduce(
        (sum, item) => sum + parseFloat(item.total_price),
        0
    )

    useEffect(() => {
        if (token) fetchCart()
    }, [token])

    if (!token) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold mb-8">Корзина</h2>
                <div className="text-center py-8">
                    <p className="text-xl mb-4">Для просмотра корзины необходимо авторизоваться</p>
                    <Link
                        to="/login"
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 inline-block"
                    >
                        Войти
                    </Link>
                </div>
            </div>
        )
    }

    if (loading) return <div className="text-center py-8">Загрузка корзины...</div>
    if (error) return <div className="text-red-500 text-center py-8">{error}</div>

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-8">Корзина</h2>

            {cartItems.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-xl mb-4">Ваша корзина пуста</p>
                    <Link
                        to="/"
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                        Перейти к покупкам
                    </Link>
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
                        {cartItems.map((item) => (
                            <div key={item.id} className="p-4 flex items-start gap-6">
                                <img
                                    src={item.watch.image}
                                    alt={item.watch.name}
                                    className="w-32 h-32 object-contain"
                                />
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold">
                                        <Link
                                            to={`/watches/${item.watch.id}`}
                                            className="hover:text-blue-600"
                                        >
                                            {item.watch.name}
                                        </Link>
                                    </h3>
                                    <div className="mt-2 flex items-center gap-4">
                                        <div className="flex items-center border rounded">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="px-3 py-1 hover:bg-gray-100"
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <span className="px-4">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="px-3 py-1 hover:bg-gray-100"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold">
                                        {parseFloat(item.total_price).toLocaleString('ru-RU')} ₽
                                    </div>
                                    <div className="text-gray-500 mt-1">
                                        {parseFloat(item.watch.price).toLocaleString('ru-RU')} ₽ / шт
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center">
                            <div className="text-2xl font-bold">
                                Итого: {totalAmount.toLocaleString('ru-RU')} ₽
                            </div>
                            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
                                Оформить заказ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}