import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import instance from '../api/axiosInstance';
import BottomNav from './BottomNav';
import { Undo } from 'lucide-react';

const ClientQuickView = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const userRes = await instance.get(`/api/users/${clientId}`);
        setClient(userRes.data);

        const workoutsRes = await instance.get(`/api/workouts/user/${clientId}`);
        setWorkouts(workoutsRes.data);
      } catch (err) {
        console.error('Помилка при завантаженні даних клієнта або тренувань:', err);
      }
    };

    fetchClientData();
  }, [clientId]);

  if (!client) return <div className="text-center mt-20">Завантаження...</div>;

  return (
    <div className="max-w-sm mx-auto p-4 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen flex flex-col justify-between">
      {/* TOP NAV */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => navigate(-1)} className="text-gray-700 dark:text-gray-300">
            <Undo className="w-5 h-5" />
          </button>
          <div className="w-5 h-5" /> {/* Для центрування */}
        </div>

        {/* PROFILE */}
        <div className="flex items-center gap-4 mt-4">
          {client.profilePictureUrl ? (
            <img
              src={client.profilePictureUrl}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center text-3xl"></div>
          )}
          <div className="ml-4">
            <h2 className="text-xl font-semibold">{client.firstName} {client.lastName}</h2>
            <p className="text-gray-500 mt-1 text-sm">@{client.username}</p>
            {client.trainingStartDate && (
              <p className="text-xs text-gray-500 mt-1">
                займається з вами з {new Date(client.trainingStartDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* View Full Profile */}
        <div className="text-center mt-4">
          <button
            onClick={() => navigate(`/profile/${client.id}`)}
            className="bg-gray-200 dark:bg-gray-700 px-6 py-2 rounded-full min-w-[250px]"
          >
            Переглянути профіль
          </button>
        </div>

        {/* Workout History */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-center mb-3">Історія тренувань</h3>
          {workouts.slice(0, visibleCount).map((w, idx) => (
            <button
              key={idx}
              onClick={() => navigate(`/workouts/${w.id}`)}
              className="w-full text-left bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2 text-sm mb-2"
            >
              {new Date(w.date).toLocaleDateString()} {w.title}
            </button>
          ))}
          {workouts.length > 3 && (
            <div className="text-center">
              {visibleCount < workouts.length ? (
                <button
                  onClick={() => setVisibleCount(prev => prev + 3)}
                  className="text-blue-500 text-sm mt-2"
                >
                  Показати більше
                </button>
              ) : (
                <button
                  onClick={() => setVisibleCount(3)}
                  className="text-blue-500 text-sm mt-2"
                >
                  Показати менше
                </button>
              )}
            </div>
          )}
        </div>

        {/* Create Workout Button */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate(`/create-workout/${client.id}`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-full"
          >
            Створити тренування
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientQuickView;
