import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterForm.css';

export default function RegisterForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register(username, email, password);
            navigate('/login');
        } catch (err) {
            setError('Ошибка регистрации');
        }
    };

    return (
        <div className="register-container">
            <h2 className="register-title">Регистрация</h2>
            <form onSubmit={handleSubmit} className="register-form">
                {error && <div className="register-error">{error}</div>}

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
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                    className="register-button"
                >
                    Зарегистрироваться
                </button>

                <div className="register-footer">
                    Уже есть аккаунт?{' '}
                    <Link to="/login" className="login-link">
                        Войдите
                    </Link>
                </div>
            </form>
        </div>
    );
}