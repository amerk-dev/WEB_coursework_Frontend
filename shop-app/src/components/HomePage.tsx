import HorizontalProductsScroll from "./HorizontalProductsScroll.tsx";
import { useEffect, useState } from "react";
import type { Watch } from "../types/watch.ts";
import axios from "axios";
import './styles/HomePage.css'; // Импорт CSS файла со стилями

export default function HomePage() {
    const [allWatches, setNewArrivals] = useState<Watch[]>([]);
    const [mostCostWatches, setmostCostWatches] = useState<Watch[]>([]);
    const [lowPriseWatch, setlowPriseWatch] = useState<Watch[]>([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:8000/api/watches/',
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                console.log('Получены данные:', response.data);
                setNewArrivals(response.data.results);
            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
            try {
                const response = await axios.get(
                    'http://localhost:8000/api/watches/?in_stock=true&ordering=-price',
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                console.log('Получены данные:', response.data);
                setmostCostWatches(response.data.results);
            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
            try {
                const response = await axios.get(
                    'http://localhost:8000/api/watches/?in_stock=true&ordering=price',
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                console.log('Получены данные:', response.data);
                setlowPriseWatch(response.data.results);
            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="home-page">
            <div className="home-page__header">

            </div>
            <div className="home-page__content">
                <HorizontalProductsScroll
                    title="Новинки"
                    watches={allWatches}
                />
                <HorizontalProductsScroll
                    title="Топ дорогих"
                    watches={mostCostWatches}
                />
                <HorizontalProductsScroll
                    title="Доступные модели"
                    watches={lowPriseWatch}
                />
            </div>
        </div>
    );
}