import type { Watch } from '../types/watch';
import ProductCard from './ProductCard';
import { useRef } from 'react';
import './styles/HorizontalProductsScroll.css'; // Импорт CSS файла со стилями

export default function HorizontalProductsScroll({
                                                     title,
                                                     watches = [],
                                                 }: {
    title: string;
    watches?: Watch[];
}) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -500 : 500;
            scrollRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="horizontal-scroll">
            <div className="horizontal-scroll__header">
                <h3 className="horizontal-scroll__title">{title}</h3>
                {watches.length > 0 && (
                    <div className="horizontal-scroll__controls">
                        <button
                            onClick={() => scroll('left')}
                            className="horizontal-scroll__button horizontal-scroll__button--left"
                            aria-label="Прокрутить влево"
                        >
                            &lt;
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="horizontal-scroll__button horizontal-scroll__button--right"
                            aria-label="Прокрутить вправо"
                        >
                            &gt;
                        </button>
                    </div>
                )}
            </div>

            <div
                ref={scrollRef}
                className="horizontal-scroll__container"
            >
                {watches?.map((watch) => (
                    <div
                        key={watch.id}
                        className="horizontal-scroll__item"
                    >
                        <ProductCard watch={watch} />
                    </div>
                ))}

                {watches.length === 0 && (
                    <div className="horizontal-scroll__empty">
                        Товары не найдены
                    </div>
                )}
            </div>
        </div>
    );
}