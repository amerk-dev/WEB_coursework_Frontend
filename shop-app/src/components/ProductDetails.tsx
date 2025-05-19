import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import AddToCartButton from './AddToCartButton'

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

    if (loading) return <div>Загрузка...</div>
    if (!watch) return <div>Товар не найден</div>



    // @ts-ignore
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Галерея изображений */}
                <div className="space-y-4">
                    <img
                        src={watch.image}
                        alt={watch.name}
                        className="w-full h-96 object-contain bg-gray-50 p-4 rounded-lg"
                    />
                </div>

                {/* Информация о товаре */}
                <div className="space-y-6">
                    <h1 className="text-4xl font-bold">{watch.name}</h1>

                    {/* Информация о бренде */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-xl font-semibold mb-2">{watch.brand.name}</h3>
                        <p className="text-gray-600">{watch.brand.description}</p>
                    </div>

                    {/* Основная информация */}
                    <div className="space-y-4">
                        <div className="text-3xl font-bold text-blue-600">
                            {parseFloat(watch.price).toLocaleString('ru-RU')} ₽
                        </div>

                        <div className="flex gap-4">
                            <AddToCartButton watchId={watch.id} />
                            <button className="px-4 py-2 border rounded hover:bg-gray-50">
                                В избранное
                            </button>
                        </div>

                        {/* Характеристики */}
                        <div className="space-y-2">
                            <p className="text-lg font-medium">Характеристики:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Тип: {watch.watch_type === 'ANALOG' ? 'Аналоговые' : 'Цифровые'}</li>
                                <li>Дата добавления: {new Date(watch.created_at).toLocaleDateString('ru-RU')}</li>
                                <li>Артикул: {watch.id}</li>
                            </ul>
                        </div>

                        {/* Полное описание */}
                        <div className="prose max-w-none">
                            <p className="text-lg">{watch.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}