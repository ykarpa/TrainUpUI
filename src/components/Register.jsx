import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, checkUsernameExists, checkEmailExists } from '../api/authService';

const Register = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (user.username) {
        const exists = await checkUsernameExists(user.username);
        setErrors((prev) => ({ ...prev, username: exists ? 'Юзернейм зайнятий' : '' }));
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [user.username]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (user.email) {
        const exists = await checkEmailExists(user.email);
        setErrors((prev) => ({ ...prev, email: exists ? 'Електронна пошта вже використовується' : '' }));
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [user.email]);

  const handleRegister = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (user.password !== user.confirmPassword) {
      newErrors.confirmPassword = 'Паролі не співпадають';
    }

    if (user.password.length < 8) {
      newErrors.password = 'Пароль має бути не менше 8 символів';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await register(user);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4 min-h-screen text-black dark:text-white bg-white dark:bg-gray-900">
      <h2 className="text-2xl font-bold text-center mt-10">Реєстрація</h2>
      <form onSubmit={handleRegister} className="mt-6">
        {['firstName', 'lastName', 'username', 'email'].map((field) => (
          <div className="mb-4" key={field}>
            <input
              type={field === 'email' ? 'email' : 'text'}
              placeholder={field === 'firstName' ? "Ім'я" :
                field === 'lastName' ? 'Прізвище' :
                field === 'username' ? 'Нікнейм' : 'Електронна пошта'}
              value={user[field]}
              onChange={(e) => setUser({ ...user, [field]: e.target.value })}
              className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800"
            />
            {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
          </div>
        ))}

        <div className="mb-4 relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Пароль"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2 cursor-pointer text-sm"
          >
            {showPassword ? 'Сховати' : 'Показати'}
          </span>
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        <div className="mb-4 relative">
          <input
            type={showConfirm ? 'text' : 'password'}
            placeholder="Підтвердити пароль"
            value={user.confirmPassword}
            onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
            className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800"
          />
          <span
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-2 top-2 cursor-pointer text-sm"
          >
            {showConfirm ? 'Сховати' : 'Показати'}
          </span>
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
        </div>

        <div className="mb-4">
          <input
            type="date"
            value={user.dateOfBirth}
            onChange={(e) => setUser({ ...user, dateOfBirth: e.target.value })}
            className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800"
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Зареєструватися
        </button>
      </form>
    </div>
  );
};

export default Register;
