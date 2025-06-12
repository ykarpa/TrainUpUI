import React, { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle'; // Якщо ти його вже використовуєш
// Іконки для нижнього меню, якщо захочеш — можу замінити

const UserProfile = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/users/2') // заміни ID на потрібний
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return <div className="text-center mt-20">Завантаження...</div>;

  return (
    <div className="max-w-sm mx-auto p-4 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <div className="flex justify-between">
        <ThemeToggle />
        <button className="text-gray-500 dark:text-gray-300">⚙️</button>
      </div>

      {/* TOP SECTION */}
      <div className="flex items-center gap-4 mt-4">
        <div className="w-20 h-20 bg-gray-300 rounded-full flex-shrink-0" />
        <div>
          <h2 className="text-lg font-semibold">{data.firstName} {data.lastName}</h2>
          <p className="text-gray-500">@{data.username}</p>
        </div>
      </div>

      {/* BIO */}
      <p className="text-sm mt-3 whitespace-pre-line">{data.bio}</p>

      {/* Tabs */}
      <div className="flex mt-6 border-b border-gray-300 dark:border-gray-700">
        <button className="flex-1 text-center p-2 border-b-2 border-black dark:border-white font-semibold">
          фото
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {data.photos && data.photos.length > 0 ? (
          data.photos.map((url, i) => (
            <img key={i} src={url} alt="" className="aspect-square object-cover rounded" />
          ))
        ) : (
          <p className="text-sm text-center col-span-3 text-gray-500">Немає фото</p>
        )}
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white dark:bg-gray-900 border-t dark:border-gray-700 flex justify-around py-2">
        <button>🏠</button>
        <button>🔍</button>
        <button>💬</button>
        <button>📅</button>
        <button>👤</button>
      </nav>
    </div>
  );
};

export default UserProfile;
