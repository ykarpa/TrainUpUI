import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';

const CoachProfile = () => {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState('photos');

  useEffect(() => {
    fetch(`http://localhost:8080/api/users/1`)
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

      {/* TOP SECTION: Avatar + Info */}
      <div className="flex items-center gap-4 mt-4">
        <div className="w-20 h-20 bg-gray-300 rounded-full flex-shrink-0" />
        <div>
          <h2 className="text-lg font-semibold">{data.firstName} {data.lastName}</h2>
          <p className="text-gray-500">@{data.username}</p>
          <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full mt-1 inline-block capitalize">
            {data.roles[0].name === "TRAINER" ? "ТРЕНЕР" : data.roles[0].name}
          </span>
        </div>
      </div>

      <p className="text-sm mt-3">{data.bio}</p>

      {/* Rating */}
      <div className="flex items-center mt-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <FaStar key={i} className={`text-yellow-400 ${i > data.rating ? 'opacity-50' : ''}`} />
        ))}
        <span className="ml-2 text-sm">{data.rating}/5</span>
      </div>

      {/* Tabs */}
      <div className="flex mt-6 border-b border-gray-300 dark:border-gray-700">
        <button
          className={`flex-1 text-center p-2 ${tab === 'photos' ? 'border-b-2 border-black dark:border-white font-semibold' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setTab('photos')}
        >
          фото
        </button>
        <button
          className={`flex-1 text-center p-2 ${tab === 'reviews' ? 'border-b-2 border-black dark:border-white font-semibold' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setTab('reviews')}
        >
          відгуки
        </button>
      </div>

      {/* Content */}
      {tab === 'photos' ? (
        <div className="grid grid-cols-3 gap-2 mt-4">
          {data.photos.map((url, i) => (
            <img key={i} src={url} alt="" className="aspect-square object-cover rounded" />
          ))}
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {data.reviews.map((r, idx) => (
            <div key={idx} className="flex gap-2">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{r.author}</span>
                  <span className="text-sm">{r.rating}/5</span>
                </div>
                <div className="flex text-yellow-400 mb-1">
                  {[...Array(r.rating)].map((_, i) => <FaStar key={i} />)}
                </div>
                <p className="text-sm">{r.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

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

export default CoachProfile;
