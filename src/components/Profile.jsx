import React, { useEffect, useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { Settings, BarChart3 } from 'lucide-react';
import BottomNav from './BottomNav';
import instance from '../api/axiosInstance';

const Profile = () => {
  const [data, setUser] = useState(null);
  const [tab, setTab] = useState('photos');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('User ID not found');

        const response = await instance.get(`/api/users/${userId}`);
        setUser(response.data);

        const roles = response.data.roles.map(role => role.name).join(',');
        localStorage.setItem('roles', roles);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!data) return <div className="text-center mt-20">Завантаження...</div>;

  const isCoach = localStorage.getItem('roles').split(',').includes('TRAINER');

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} className="text-black-400" />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} className="text-black-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-black-400" />);
      }
    }
    return stars;
  };

  return (
    <div className="max-w-sm mx-auto p-4 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <div className="flex justify-between items-center">
        <button
          onClick={() => (window.location.href = '/indicators')}
          className="text-gray-500 dark:text-gray-300"
        >
          <BarChart3 className="w-6 h-6" />
        </button>
        <button
          onClick={() => (window.location.href = '/settings')}
          className="text-gray-500 dark:text-gray-300"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      {/* TOP SECTION: Avatar + Info */}
      <div className="flex items-center gap-4 mt-4">
        <div className="w-24 h-24 bg-gray-300 rounded-full flex-shrink-0" />
        <div className="ml-4">
          <h2 className="text-xl font-semibold">{data.firstName} {data.lastName}</h2>
          <p className="text-gray-500 mt-1 text-sm">@{data.username}</p>
          {isCoach && (
            <span className="text-sm bg-gray-200 dark:bg-gray-700 px-10 py-1 rounded-full mt-2 inline-block capitalize font-medium">
              ТРЕНЕР
            </span>
          )}
        </div>
      </div>

      <p className="text-sm mt-3 whitespace-pre-line">{data.bio}</p>

      {/* Rating (only for coaches) */}
      {isCoach && (
        <div className="flex flex-col items-center mt-5">
          <div className="flex items-center">
            {renderStars(data.rating)}
            <span className="ml-2 text-sm">{data.rating}/5</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex mt-2 border-b border-gray-300 dark:border-gray-700">
        <button
          className={`flex-1 text-center p-2 ${tab === 'photos' ? 'border-b-2 border-black dark:border-white font-semibold' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setTab('photos')}
        >
          фото
        </button>
        {isCoach && (
          <button
            className={`flex-1 text-center p-2 ${tab === 'reviews' ? 'border-b-2 border-black dark:border-white font-semibold' : 'text-gray-500 dark:text-gray-400'}`}
            onClick={() => setTab('reviews')}
          >
            відгуки
          </button>
        )}
      </div>

      {/* Content */}
      {tab === 'photos' ? (
        <div className="grid grid-cols-3 gap-2 mt-4">
          {data.photos && data.photos.length > 0 ? (
            data.photos.map((url, i) => (
              <img key={i} src={url} alt="" className="aspect-square object-cover rounded" />
            ))
          ) : (
            <p className="text-sm text-center col-span-3 text-gray-500">Немає фото</p>
          )}
        </div>
      ) : isCoach && tab === 'reviews' ? (
        <div className="mt-4 space-y-3">
          {data.reviews?.map((r, idx) => (
            <div key={idx} className="flex gap-2">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{r.author}</span>
                  <span className="text-sm">{r.rating}/5</span>
                </div>
                <div className="flex mb-1">{renderStars(r.rating)}</div>
                <p className="text-sm">{r.text}</p>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Profile;
