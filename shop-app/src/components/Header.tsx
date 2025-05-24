import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './styles/Header.css';

export default function Header() {
    const { token, logout } = useAuth();

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
                                to="/search"
                                className={({isActive}) =>
                                    isActive ? 'nav-link active' : 'nav-link'
                                }
                            >
                                Поиск
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
                            </NavLink>
                        </li>
                    </ul>
                </nav>

                <div className="auth-section">
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