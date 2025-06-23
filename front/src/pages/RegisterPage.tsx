import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userRegister } from "../api/BackendApi";
import './RegisterPage.css'

const RegisterPage = () => {
    const [ login, setLogin ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ error, setError ] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await userRegister(login, password);

            if (response.token) {
                navigate('/');
            } else {
                setError('Не удалось получить токен.');
            }
        } catch (err: any) {
            if (err.response) {
            const status = err.response.status;
            const data = err.response.data;

            if (status === 409) {
                setError(data?.message ?? 'Логин уже занят');
            } else {
                setError(data?.message ?? `Ошибка ${status}`);
            }
            } else {
                setError('Сетевая ошибка или сервер недоступен');
            }
        }
    };

    return (
        <div className="register-container">
            <div className="register-form-wrapper">
                <h2>Регистрация</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="login">Логин</label>
                        <input
                            type="text"
                            id="login"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Пароль</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Зарегистрироваться</button>
                </form>
            </div>
        </div>
    )
}

export default RegisterPage;