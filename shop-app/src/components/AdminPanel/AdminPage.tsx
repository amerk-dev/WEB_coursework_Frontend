import { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPage.css';

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
                                        Изменить
                                    </button>
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDelete(watch.id)}
                                    >
                                        Удалить
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