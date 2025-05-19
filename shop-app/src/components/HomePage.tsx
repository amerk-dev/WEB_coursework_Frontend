import { useAuth } from '../context/AuthContext';

export default function HomePage() {
    const { token, logout } = useAuth();

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
            {/* Контент главной страницы */}
        </div>
    );
}