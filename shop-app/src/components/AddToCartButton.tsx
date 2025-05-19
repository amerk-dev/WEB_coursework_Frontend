import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function AddToCartButton({ watchId }: { watchId: number }) {
    const [loading, setLoading] = useState(false)
    const { token } = useAuth()

    const handleAddToCart = async () => {
        if (!token) {
            alert('Для добавления в корзину необходимо авторизоваться')
            return
        }

        setLoading(true)
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/cart/carts/add-item/`,
                { watch_id: watchId, quantity: 1 },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            alert('Товар добавлен в корзину')
        } catch (error) {
            alert('Ошибка при добавлении в корзину')
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleAddToCart}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
            {loading ? 'Добавление...' : 'В корзину'}
        </button>
    )
}