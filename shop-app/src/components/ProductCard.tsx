import { Link } from 'react-router-dom';
import AddToCartButton from './AddToCartButton';
import type { Watch } from "../types/watch.ts";
import './styles/ProductCard.css'; // Импорт CSS файла со стилями

export default function ProductCard({ watch }: { watch: Watch }) {
    return (
        <div className="product-card">
            <Link
                to={`/watches/${watch.id}`}
                className="product-card__image-link"
            >
                <img
                    src={watch.image}
                    alt={watch.name}
                    className="product-card__image"
                    loading="lazy"
                />
            </Link>

            <div className="product-card__content">
                <div className="product-card__info">
                    <h3 className="product-card__title">
                        <Link
                            to={`/watches/${watch.id}`}
                            className="product-card__title-link"
                        >
                            {watch.name}
                        </Link>
                    </h3>
                    <p className="product-card__brand">
                        {watch.brand.name}
                    </p>
                </div>

                <div className="product-card__footer">
                    <span className="product-card__price">
                        {parseFloat(watch.price).toLocaleString('ru-RU')} ₽
                    </span>
                    <AddToCartButton watchId={watch.id} />
                </div>
            </div>
        </div>
    );
}