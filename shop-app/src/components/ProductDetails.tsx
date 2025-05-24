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

    if (loading) return (
        <div className="loading-spinner">
            <div className="spinner"></div>
        </div>
    )

    if (!watch) return <div className="product-not-found">Товар не найден</div>

    return (
        <div className="product-details-container">
            <div className="product-details-grid">
                {/* Галерея изображений */}
                <div className="product-gallery">
                    <div className="image-wrapper">
                        <img
                            src={watch.image}
                            alt={watch.name}
                            className="product-main-image"
                            onError={(e) => {
                                e.target.src = '/placeholder-watch.jpg'
                            }}
                        />
                    </div>
                </div>

                {/* Информация о товаре */}
                <div className="product-info">
                    <div className="product-header">
                        <h1 className="product-title">{watch.name}</h1>
                        <div className="product-price">
                            {parseFloat(watch.price).toLocaleString('ru-RU')} ₽
                        </div>
                    </div>

                    {/* Бренд */}
                    <div className="brand-card">
                        <div className="brand-content">
                            <h3 className="brand-name">{watch.brand.name}</h3>
                            <p className="brand-description">{watch.brand.description}</p>
                        </div>
                    </div>

                    {/* Кнопки действий */}
                    <div className="product-actions">
                        <AddToCartButton watchId={watch.id} />
                    </div>

                    {/* Характеристики */}
                    <div className="specs-card">
                        <h3 className="specs-title">Характеристики</h3>
                        <div className="specs-grid">
                            <div className="spec-item">
                                <div>
                                    <div className="spec-label">Тип часов</div>
                                    <div className="spec-value">
                                        {watch.watch_type === 'ANALOG' ? 'Аналоговые' : 'Цифровые'}
                                    </div>
                                </div>
                            </div>
                            <div className="spec-item">
                                <div>
                                    <div className="spec-label">Дата добавления</div>
                                    <div className="spec-value">
                                        {new Date(watch.created_at).toLocaleDateString('ru-RU')}
                                    </div>
                                </div>
                            </div>
                            <div className="spec-item">
                                <div>
                                    <div className="spec-label">Артикул</div>
                                    <div className="spec-value">{watch.id}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Описание */}
                    <div className="description-card">
                        <h3 className="description-title">Описание</h3>
                        <p className="description-text">{watch.description}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}