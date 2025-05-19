import type {Watch} from '../types/watch'
import ProductCard from './ProductCard'
import { useRef } from 'react'

export default function HorizontalProductsScroll({
                                                     title,
                                                     watches = [], // Добавляем значение по умолчанию
                                                 }: {
    title: string
    watches?: Watch[] // Делаем проп необязательным
}) {
    const scrollRef = useRef<HTMLDivElement>(null)

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -500 : 500
            scrollRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    return (
        <div className="relative group">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">{title}</h3>
                {watches.length > 0 && ( // Показываем кнопки только если есть товары
                    <div className="hidden md:flex gap-2">
                        <button
                            onClick={() => scroll('left')}
                            className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-100"
                        >
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-100"
                        >
                        </button>
                    </div>
                )}
            </div>

            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
            >
                {watches?.map((watch) => ( // Добавляем опциональный чейнинг
                    <div
                        key={watch.id}
                        className="flex-shrink-0 w-64 md:w-72 lg:w-80"
                    >
                        <ProductCard watch={watch} />
                    </div>
                ))}

                {/* Показываем заглушку если товаров нет */}
                {watches.length === 0 && (
                    <div className="text-gray-500 p-4">
                        Товары не найдены
                    </div>
                )}
            </div>
        </div>
    )
}