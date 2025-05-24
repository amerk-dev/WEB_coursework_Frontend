import { useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from 'react-router-dom';
import './LoginForm.css';

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
        <div className="login-container">
            <h2 className="login-title">Вход</h2>
            <form onSubmit={handleSubmit} className="login-form">
                {error && <div className="login-error">{error}</div>}

                <div className="form-group">
                    <label className="form-label">Имя пользователя</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Пароль</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="login-button"
                >
                    Войти
                </button>

                <div className="login-footer">
                    Нет аккаунта?{' '}
                    <Link to="/register" className="register-link">
                        Зарегистрируйтесь
                    </Link>
                </div>
            </form>
        </div>
    );
}