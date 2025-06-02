import { useLocation } from 'react-router-dom';
import './CheckoutForm.css';


const CheckoutForm = () => {
  const location = useLocation();
    const { email = '', address = '', fullName = '', phone = '' } = location.state || {};

    return (
        <form className="checkout-form">
            <h2>Оформление заказа</h2>

            <label>
                ФИО:
                <input type="text" defaultValue={fullName} required placeholder="Иванов Иван Иванович" />
            </label>

            <label>
                Телефон:
                <input type="tel" defaultValue={phone} required placeholder="+7 (999) 123-45-67" pattern="^\+?\d{0,15}$" />
            </label>

            <label>
                Email:
                <input type="email" defaultValue={email} required placeholder="example@mail.com" />
            </label>

            <label>
                Адрес доставки:
                <input type="text" defaultValue={address} required placeholder="г. Москва, ул. Ленина, д. 1" />
            </label>

            <button type="submit">Подтвердить заказ</button>
        </form>
    );
};

export default CheckoutForm;
