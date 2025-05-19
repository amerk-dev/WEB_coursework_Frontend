import { useAuth } from '../context/AuthContext';
import HorizontalProductsScroll from "./HorizontalProductsScroll.tsx";
import {useEffect, useState} from "react";
import type {Watch} from "../types/watch.ts";
import axios from "axios";

export default function HomePage() {
    const { token, logout } = useAuth();
    const [allWatches, setNewArrivals] = useState<Watch[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:8000/api/watches/',
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`, // Используем токен из хранилища
                            'Content-Type': 'application/json'
                        }
                    }
                )
                console.log('Получены данные:', response.data)
                setNewArrivals(response.data.results)
            } catch (error) {
                console.error('Ошибка получения данных:', error)
                // Можно добавить обработку ошибок (например, показать уведомление)
            }
        }

        fetchData()
    }, [])
    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Добро пожаловать!</h1>
                {token && (
                    <button
                        onClick={logout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Выйти
                    </button>
                )}
            </div>
            <div className="space-y-12">
                <HorizontalProductsScroll
                    title="Новинки"
                    watches={allWatches}
                />

            </div>
        </div>
    );
}