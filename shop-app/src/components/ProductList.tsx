import { useEffect, useState } from 'react'
import axios from 'axios'
import {Link} from "react-router-dom";
import AddToCartButton from "./AddToCartButton.tsx";
import type {Watch} from "../types/watch.ts";



export default function ProductList() {
    const [watches, setWatches] = useState<Watch[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchWatches = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/watches/`)
                setWatches(response.data.results)
            } catch (err) {
                setError('Ошибка загрузки товаров')
            } finally {
                setLoading(false)
            }
        }

        fetchWatches()
    }, [])

    if (loading) return <div className="text-center py-8">Загрузка...</div>
    if (error) return <div className="text-red-500 text-center py-8">{error}</div>

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-3xl font-bold mb-8">Каталог часов</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {watches.map((watch) => (
                    <div key={watch.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <img
                            src={watch.image}
                            alt={watch.name}
                            className="w-full h-64 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold mb-2">
                                <Link
                                    to={`/watches/${watch.id}`}
                                    className="hover:text-blue-600 transition-colors"
                                >
                                    {watch.name}
                                </Link>
                            </h3>

                            {/* Отображение бренда */}
                            <div className="mb-2">
                                <span className="font-medium">Бренд: </span>
                                <span className="text-gray-600">
                  {watch.brand.name}
                </span>
                            </div>

                            {/* Описание товара */}
                            <p className="text-gray-700 mb-4 line-clamp-3">
                                {watch.description}
                            </p>

                            {/* Детали */}
                            <div className="space-y-2 mb-4">
                                <p className="text-sm">
                                    <span className="font-medium">Тип: </span>
                                    <span className="text-gray-600">
                    {watch.watch_type === 'ANALOG' ? 'Аналоговые' : 'Цифровые'}
                  </span>
                                </p>
                                <p className="text-sm">
                                    <span className="font-medium">Наличие: </span>
                                    <span className={watch.in_stock ? 'text-green-600' : 'text-red-600'}>
                    {watch.in_stock ? 'В наличии' : 'Под заказ'}
                  </span>
                                </p>
                            </div>

                            {/* Цена и кнопка */}
                            <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">
                  {parseFloat(watch.price).toLocaleString('ru-RU')} ₽
                </span>
                                <AddToCartButton watchId={watch.id} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}