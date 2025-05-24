import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/Header.css';

export default function Header() {
    const { token, logout } = useAuth();
    const [cartCount, setCartCount] = useState(0);

    // Получаем количество товаров в корзине
    const fetchCartCount = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart/carts/my-cart/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCartCount(response.data.items.reduce((sum: number, item: any) => sum + item.quantity, 0));
        } catch (err) {
            console.error('Ошибка загрузки корзины', err);
        }
    };

    useEffect(() => {
        if (token) {
            fetchCartCount();
        } else {
            setCartCount(0);
        }
    }, [token]);

    return (
        <header className="site-header">
            <div className="header-container">
                <Link to="/" className="header-logo">
                    WatchShop
                </Link>

                <nav className="header-nav">
                    <ul className="nav-list">
                        <li className="nav-item">
                            <NavLink
                                to="/"
                                className={({isActive}) =>
                                    isActive ? 'nav-link active' : 'nav-link'
                                }
                            >
                                Главная
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/catalog"
                                className={({isActive}) =>
                                    isActive ? 'nav-link active' : 'nav-link'
                                }
                            >
                                Каталог
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/cart"
                                className={({isActive}) =>
                                    isActive ? 'nav-link active' : 'nav-link'
                                }
                            >
                                Корзина
                                {cartCount > 0 && (
                                    <span className="cart-badge">{cartCount}</span>
                                )}
                            </NavLink>
                        </li>
                    </ul>
                </nav>

                <div className="auth-section">
                    <div className="cart-indicator">
                        <NavLink to="/cart" className="cart-link">
                            🛒
                            {cartCount > 0 && (
                                <span className="cart-badge">{cartCount}</span>
                            )}
                        </NavLink>
                    </div>
                    {token ? (
                        <button onClick={logout} className="auth-button">
                            Выйти
                        </button>
                    ) : (
                        <Link to="/login" className="auth-button">
                            Войти
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}