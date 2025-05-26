import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../ProductCard';
import './Catalog.css';

type Watch = {
    id: number;
    name: string;
    brand: {
        id: number;
        name: string;
        description: string;
    };
    description: string;
    price: string;
    watch_type: 'ANALOG' | 'DIGITAL' | 'SMART';
    image: string;
    in_stock: boolean;
    created_at: string;
};

type Brand = {
    id: number;
    name: string;
};

export default function CatalogPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [watches, setWatches] = useState<Watch[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    // Получаем текущие параметры фильтрации
    const brandName = searchParams.get('brand__name') || '';
    const watchType = searchParams.get('watch_type') || '';
    const inStock = searchParams.get('in_stock') === 'true';
    const searchQuery = searchParams.get('search') || '';
    const ordering = searchParams.get('ordering') || '';

    // Получение списка часов с фильтрами
    const fetchWatches = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();

            if (brandName) params.append('brand__name', brandName);
            if (watchType) params.append('watch_type', watchType);
            if (inStock) params.append('in_stock', 'true');
            if (searchQuery) params.append('search', searchQuery);
            if (ordering) params.append('ordering', ordering);
            params.append('page', currentPage.toString());

            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/watches/`, { params });
            setWatches(response.data.results);
            setTotalCount(response.data.count);
        } catch (err) {
            setError('Ошибка загрузки каталога');
        } finally {
            setLoading(false);
        }
    };

    // Получение списка брендов
    const fetchBrands = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/brands/`);
            setBrands(response.data.results);
        } catch (err) {
            console.error('Ошибка загрузки брендов', err);
        }
    };

    // Обработчик изменения фильтров
    const handleFilterChange = (key: string, value: string | boolean) => {
        const newParams = new URLSearchParams(searchParams);

        if (value === '' || value === false) {
            newParams.delete(key);
        } else {
            newParams.set(key, String(value));
        }

        newParams.delete('page'); // Сбрасываем пагинацию при изменении фильтров
        setSearchParams(newParams);
        setCurrentPage(1);
    };

    // Обработчик сброса фильтров
    const resetFilters = () => {
        setSearchParams({});
        setCurrentPage(1);
    };

    // Обработчик изменения страницы
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', page.toString());
        setSearchParams(newParams);
    };

    useEffect(() => {
        fetchWatches();
        fetchBrands();
    }, [searchParams, currentPage]);

    if (loading) return <div className="loading">Загрузка...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="catalog-container">
            <div className="filters-sidebar">
                <h3>Фильтры</h3>

                <div className="filter-group">
                    <h4>Бренд</h4>
                    <select
                        value={brandName}
                        onChange={(e) => handleFilterChange('brand__name', e.target.value)}
                    >
                        <option value="">Все бренды</option>
                        {brands.map((brand) => (
                            <option key={brand.id} value={brand.name}>
                                {brand.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <h4>Тип часов</h4>
                    <select
                        value={watchType}
                        onChange={(e) => handleFilterChange('watch_type', e.target.value)}
                    >
                        <option value="">Все типы</option>
                        <option value="ANALOG">Аналоговые</option>
                        <option value="DIGITAL">Цифровые</option>
                        <option value="SMART">Умные</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={inStock}
                            onChange={(e) => handleFilterChange('in_stock', e.target.checked)}
                        />
                        Только в наличии
                    </label>
                </div>

                <div className="filter-group">
                    <h4>Сортировка</h4>
                    <select
                        value={ordering}
                        onChange={(e) => handleFilterChange('ordering', e.target.value)}
                    >
                        <option value="">По умолчанию</option>
                        <option value="price">По возрастанию цены</option>
                        <option value="-price">По убыванию цены</option>
                        <option value="name">По названию (А-Я)</option>
                        <option value="-name">По названию (Я-А)</option>
                    </select>
                </div>

                <button onClick={resetFilters} className="reset-filters">
                    Сбросить фильтры
                </button>
            </div>

            <div className="products-section">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Поиск по названию..."
                        value={searchQuery}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                </div>

                <div className="products-grid">
                    {watches.length > 0 ? (
                        watches.map((watch) => (
                            <ProductCard key={watch.id} watch={watch} />
                        ))
                    ) : (
                        <div className="no-results">Нет товаров по выбранным фильтрам</div>
                    )}
                </div>

                {totalCount > 0 && (
                    <div className="pagination">
                        {Array.from({ length: Math.ceil(totalCount / 12) }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={currentPage === page ? 'active' : ''}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}