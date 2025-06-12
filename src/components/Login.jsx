import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/authService';
import { useAuth } from '../api/AuthContext';

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login({ usernameOrEmail, password });
      authLogin(data.token);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4 min-h-screen text-black dark:text-white bg-white dark:bg-gray-900">
      <h2 className="text-2xl font-bold text-center mt-10">Увійти</h2>
      <form onSubmit={handleLogin} className="mt-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Нікнейм або Електронна пошта"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800"
          />
        </div>
        <div className="mb-4 relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2 cursor-pointer text-sm"
          >
            {showPassword ? 'Сховати' : 'Показати'}
          </span>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Увійти
        </button>
      </form>
    </div>
  );
};

export default Login;
