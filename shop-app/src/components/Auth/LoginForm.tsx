import { useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from 'react-router-dom';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError('Неверные учетные данные');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Вход</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <div>
                    <label className="block text-sm font-medium mb-1">Имя пользователя</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Пароль</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                    Войти
                </button>
                <div className="text-center text-sm mt-4">
                    Нет аккаунта?{' '}
                    <Link to="/register" className="text-blue-500 hover:underline">
                        Зарегистрируйтесь
                    </Link>
                </div>
            </form>
        </div>
    );
}