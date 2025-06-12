import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Undo } from 'lucide-react';
import { useAuth } from '../api/AuthContext';

const Settings = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-sm mx-auto p-4 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="relative mb-4 h-10">
        <button
            onClick={() => navigate(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300"
        >
            <Undo className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-center">Налаштування</h1>
      </div>


      {/* Theme Switch */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium">Темна тема</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isDark}
            onChange={() => setIsDark(!isDark)}
          />
          <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 transition-all" />
          <span className="ml-2 text-sm">{isDark ? 'Увімкнено' : 'Вимкнено'}</span>
        </label>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-auto p-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
      >
        Вийти
      </button>
    </div>
  );
};

export default Settings;
