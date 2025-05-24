import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import HomePage from './components/HomePage';
import Cart from './components/Cart/Cart'
import ProductDetails from "./components/ProductDetails.tsx";
import Header from "./components/Header.tsx";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Header/>
                <Routes>
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/" element={<HomePage />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/watches/:id" element={<ProductDetails />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;