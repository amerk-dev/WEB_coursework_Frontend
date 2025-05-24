import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import AddToCartButton from './AddToCartButton'
import './styles/ProductDetails.css'

export default function ProductDetails() {
    const { id } = useParams()
    const [watch, setWatch] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchWatch = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/watches/${id}/`)
                setWatch(response.data)
            } catch (error) {
                console.error('Ошибка загрузки товара:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchWatch()
    }, [id])

    if (loading) return <div className="product-loading">Загрузка...</div>
    if (!watch) return <div className="product-not-found">Товар не найден</div>

    return (
        <div className="product-details-container">
            <div className="product-details-grid">
                {/* Галерея изображений */}
                <div className="product-gallery">
                    <img
                        src={watch.image}
                        alt={watch.name}
                        className="product-main-image"
                    />
                </div>

                {/* Информация о товаре */}
                <div className="product-info">
                    <h1 className="product-title">{watch.name}</h1>

                    {/* Информация о бренде */}
                    <div className="brand-info">
                        <h3 className="brand-name">{watch.brand.name}</h3>
                        <p className="brand-description">{watch.brand.description}</p>
                    </div>

                    {/* Основная информация */}
                    <div className="product-main-info">
                        <div className="product-price">
                            {parseFloat(watch.price).toLocaleString('ru-RU')} ₽
                        </div>

                        <div className="product-actions">
                            <AddToCartButton watchId={watch.id} />
                            <button className="wishlist-button">
                                В избранное
                            </button>
                        </div>

                        {/* Характеристики */}
                        <div className="product-specs">
                            <p className="specs-title">Характеристики:</p>
                            <ul className="specs-list">
                                <li>Тип: {watch.watch_type === 'ANALOG' ? 'Аналоговые' : 'Цифровые'}</li>
                                <li>Дата добавления: {new Date(watch.created_at).toLocaleDateString('ru-RU')}</li>
                                <li>Артикул: {watch.id}</li>
                            </ul>
                        </div>

                        {/* Полное описание */}
                        <div className="product-description">
                            <p>{watch.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}