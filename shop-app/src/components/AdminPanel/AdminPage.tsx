import { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPage.css';
import path from 'path';

interface Watch {
    id: number;
    name: string;
    brand: {
        id: number;
        name: string;
        description: string;
    };
    description: string;
    price: string;
    watch_type: 'ANALOG' | 'DIGITAL';
    image: string;
    in_stock: boolean;
    created_at: string;
}

interface FormData {
    id: number;
    name: string;
    brand_id: string;
    description: string;
    price: string;
    watch_type: 'ANALOG' | 'DIGITAL';
    image: File | null;
    in_stock: boolean;
}

export default function AdminPage() {
    const [watches, setWatches] = useState<Watch[]>([]);
    const [formData, setFormData] = useState<FormData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        fetchWatches();
    }, [currentPage]);

    const fetchWatches = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/watches/?page=${currentPage}`
            );
            setWatches(response.data.results);
            setTotalPages(Math.ceil(response.data.count / 10));
        } catch (err) {
            setError('Ошибка загрузки часов');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;

        try {
            setLoading(true);

            const formPayload = new FormData();
            formPayload.append('name', formData.name);
            formPayload.append('brand_id', formData.brand_id);
            formPayload.append('description', formData.description);
            formPayload.append('price', formData.price);
            formPayload.append('watch_type', formData.watch_type);
            formPayload.append('in_stock', String(formData.in_stock));
            if (formData.image) {
                formPayload.append('image', formData.image);
            }

            const response = await axios.put<Watch>(
                `${import.meta.env.VITE_API_URL}/api/watches/${formData.id}/`,
                formPayload,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            handleSuccess();
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Вы уверены, что хотите удалить эти часы?')) return;

        try {
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/api/watches/${id}/`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                }
            );
            setWatches(prev => prev.filter(watch => watch.id !== id));
            setSuccess('Часы успешно удалены!');
        } catch (err) {
            setError('Ошибка при удалении часов');
        }
    };

    const validateForm = () => {
        if (!formData) return false;

        const requiredFields = ['name', 'brand_id', 'price'];
        const isValid = requiredFields.every(
            (field) => formData[field as keyof FormData] !== ''
        );

        if (!isValid) {
            setError('Все обязательные поля должны быть заполнены');
            return false;
        }

        if (isNaN(parseFloat(formData.price))) {
            setError('Цена должна быть числом');
            return false;
        }

        if (formData.image && formData.image.size > 5 * 1024 * 1024) {
            setError('Размер изображения не должен превышать 5MB');
            return false;
        }

        return true;
    };

    const handleSuccess = () => {
        setSuccess('Часы успешно обновлены!');
        setFormData(null);
        setPreviewImage(null);
        fetchWatches();
    };

    const handleError = (err: unknown) => {
        if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || 'Произошла ошибка обновления');
        } else {
            setError('Неизвестная ошибка');
        }
    };

    const handleEdit = (watch: Watch) => {
        setFormData({
            id: watch.id,
            name: watch.name,
            brand_id: watch.brand.id.toString(),
            description: watch.description,
            price: parseFloat(watch.price).toFixed(2),
            watch_type: watch.watch_type,
            image: null,
            in_stock: watch.in_stock,
        });
        setPreviewImage(watch.image);
    };

    const handleCancel = () => {
        setFormData(null);
        setPreviewImage(null);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        if (!formData) return;

        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev!,
            [name]: value,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!formData || !e.target.files || !e.target.files[0]) return;

        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setPreviewImage(reader.result as string);
        };

        reader.readAsDataURL(file);

        setFormData((prev) => ({
            ...prev!,
            image: file,
        }));
    };

    return (
        <div className="admin-container">
            <h1 className="admin-title">Редактирование часов</h1>

            {formData && (
                <form onSubmit={handleSubmit} className="watch-form">
                    {error && <div className="alert error">{error}</div>}
                    {success && <div className="alert success">{success}</div>}

                    <div className="form-group">
                        <label>
                            Название *
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>
                                ID бренда *
                                <input
                                    type="number"
                                    name="brand_id"
                                    value={formData.brand_id}
                                    onChange={handleChange}
                                    min="1"
                                    required
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label>
                                Цена *
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                    required
                                />
                            </label>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>
                                Тип часов *
                                <select
                                    name="watch_type"
                                    value={formData.watch_type}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="ANALOG">Аналоговые</option>
                                    <option value="DIGITAL">Цифровые</option>
                                </select>
                            </label>
                        </div>

                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="in_stock"
                                    checked={formData.in_stock}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev!,
                                            in_stock: e.target.checked,
                                        }))
                                    }
                                />
                                В наличии
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="image-upload">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            <div className="image-preview">
                               <span>Загрузить изображение</span>
                            </div>
                            <span className="image-info">
                {formData.image?.name || 'Выберите файл'}
              </span>
                        </label>
                    </div>

                    <div className="form-group">
                        <label>
                            Описание
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                            />
                        </label>
                    </div>

                    <div className="form-buttons">
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={loading}
                        >
                                Сохранить изменения
                        </button>
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={handleCancel}
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            )}

            <div className="watches-list">
                <h2>Список часов</h2>
                <div className="table-container">
                    <table>
                        <thead>
                        <tr>
                            <th>Название</th>
                            <th>Бренд</th>
                            <th>Цена</th>
                            <th>Тип</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {watches.map((watch) => (
                            <tr key={watch.id}>
                                <td>{watch.name}</td>
                                <td>{watch.brand.name}</td>
                                <td>{parseFloat(watch.price).toLocaleString('ru-RU')} ₽</td>
                                <td>{watch.watch_type === 'ANALOG' ? 'Аналог' : 'Цифра'}</td>
                                <td>
                                    <button
                                        className="edit-button"
                                        onClick={() => handleEdit(watch)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20"
                                             viewBox="0 0 26 26">
                                            <path
                                                d="M 20.09375 0.25 C 19.5 0.246094 18.917969 0.457031 18.46875 0.90625 L 17.46875 1.9375 L 24.0625 8.5625 L 25.0625 7.53125 C 25.964844 6.628906 25.972656 5.164063 25.0625 4.25 L 21.75 0.9375 C 21.292969 0.480469 20.6875 0.253906 20.09375 0.25 Z M 16.34375 2.84375 L 14.78125 4.34375 L 21.65625 11.21875 L 23.25 9.75 Z M 13.78125 5.4375 L 2.96875 16.15625 C 2.71875 16.285156 2.539063 16.511719 2.46875 16.78125 L 0.15625 24.625 C 0.0507813 24.96875 0.144531 25.347656 0.398438 25.601563 C 0.652344 25.855469 1.03125 25.949219 1.375 25.84375 L 9.21875 23.53125 C 9.582031 23.476563 9.882813 23.222656 10 22.875 L 20.65625 12.3125 L 19.1875 10.84375 L 8.25 21.8125 L 3.84375 23.09375 L 2.90625 22.15625 L 4.25 17.5625 L 15.09375 6.75 Z M 16.15625 7.84375 L 5.1875 18.84375 L 6.78125 19.1875 L 7 20.65625 L 18 9.6875 Z"></path>
                                        </svg>
                                    </button>
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDelete(watch.id)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20"
                                             viewBox="0 0 24 24">
                                            <path
                                                d="M 10.806641 2 C 10.289641 2 9.7956875 2.2043125 9.4296875 2.5703125 L 9 3 L 4 3 A 1.0001 1.0001 0 1 0 4 5 L 20 5 A 1.0001 1.0001 0 1 0 20 3 L 15 3 L 14.570312 2.5703125 C 14.205312 2.2043125 13.710359 2 13.193359 2 L 10.806641 2 z M 4.3652344 7 L 5.8925781 20.263672 C 6.0245781 21.253672 6.877 22 7.875 22 L 16.123047 22 C 17.121047 22 17.974422 21.254859 18.107422 20.255859 L 19.634766 7 L 4.3652344 7 z"></path>
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="pagination">
                    {Array.from({length: totalPages}, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={currentPage === i + 1 ? 'active' : ''}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}