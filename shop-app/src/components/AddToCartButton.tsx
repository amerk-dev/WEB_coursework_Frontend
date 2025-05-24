import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import './styles/AddToCartButton.css'

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
            className={`add-to-cart-button ${loading ? 'add-to-cart-button--loading' : ''}`}
        >
            {loading ? 'Добавление...' : 'В корзину'}
        </button>
    );
}