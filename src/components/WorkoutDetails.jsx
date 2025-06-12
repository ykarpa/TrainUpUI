/*
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import instance from '../services/axiosInstance';

const WorkoutDetails = () => {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const res = await instance.get(`/api/workouts/${workoutId}`);
        setWorkout(res.data);
      } catch (error) {
        console.error('Помилка при завантаженні тренування:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [workoutId]);

  if (loading) {
    return <div className="text-center mt-10">Завантаження...</div>;
  }

  if (!workout) {
    return <div className="text-center mt-10">Тренування не знайдено</div>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-sm mx-auto p-4 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen pb-24">
      <div className="flex justify-between items-center">
        <button onClick={() => navigate(-1)}>←</button>
        <ThemeToggle />
      </div>

      <h2 className="text-xl font-bold mt-4 text-center">
        Тренування {formatDate(workout.date)}
      </h2>

      <h3 className="text-lg font-semibold mt-4 text-center">{workout.title}</h3>

      {workout.notation && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
          {workout.notation}
        </p>
      )}

      {workout.exercises && workout.exercises.length > 0 ? (
        <table className="w-full mt-6 border-collapse">
          <thead>
            <tr className="border-b border-gray-300 dark:border-gray-600">
              <th className="text-sm font-medium py-2">Назва вправи</th>
              <th className="text-sm font-medium py-2">Підходи</th>
              <th className="text-sm font-medium py-2">Повтори</th>
              <th className="text-sm font-medium py-2">Вага</th>
            </tr>
          </thead>
          <tbody>
            {workout.exercises.map((exercise, index) => (
              <tr key={index} className="border-b border-gray-300 dark:border-gray-600">
                <td className="text-sm py-2 text-center">{exercise.name || '-'}</td>
                <td className="text-sm py-2 text-center">{exercise.sets || '-'}</td>
                <td className="text-sm py-2 text-center">{exercise.reps || '-'}</td>
                <td className="text-sm py-2 text-center">{exercise.weight ? `${exercise.weight} кг` : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center mt-4 text-gray-600 dark:text-gray-400">
          Вправи відсутні
        </p>
      )}
    </div>
  );
};

export default WorkoutDetails;


/*/
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Undo, Pencil } from 'lucide-react';

const WorkoutDetails = () => {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);

  //const canEdit = !workout.program;

  useEffect(() => {
    axiosInstance
      .get(`/api/workouts/${workoutId}`)
      .then((res) => setWorkout(res.data))
      .catch((err) => console.error('Не вдалося завантажити тренування', err));
  }, [workoutId]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds) => {
    if (seconds > 90) {
      return `${Math.round(seconds / 60)} хв`;
    }
    return `${seconds} сек`;
  };

  if (!workout)
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white flex items-center justify-center">
        Завантаження...
      </div>
    );

  return (
    <div className="max-w-sm mx-auto p-4 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="flex items-center mb-4 justify-between">
        <button onClick={() => navigate(-1)} className="mr-2">
          <Undo size={24} />
        </button>
        <h2 className="text-xl font-semibold text-center flex-grow">Деталі тренування</h2>

        {!workout.program && (
          <button
            onClick={() => navigate(`/workouts/${workout.id}/edit`)}
            className="ml-2"
            title="Редагувати"
          >
            <Pencil size={20} />
          </button>
        )}
      </div>

      <div className="flex-grow">
        <h2 className="text-2xl font-bold mb-1 text-center">{workout.title}</h2>

        {/* Дата і статус зліва */}
        <div className="mb-3 text-sm text-gray-500 dark:text-gray-400">
          <p>📅 {formatDateTime(workout.date)}</p>
          <p>Статус: {workout.completed ? '✅ Виконано' : '🕒 Заплановано'}</p>
        </div>

        {workout.notation && (
          <p className="mb-4 italic text-gray-600 dark:text-gray-300 text-center">
            {workout.notation}
          </p>
        )}

        <h3 className="text-lg font-semibold mb-2 text-center">Вправи</h3>

        {Array.isArray(workout.exercises) && workout.exercises.length > 0 ? (
          <ul className="space-y-3">
            {workout.exercises.map((ex) => (
              <li
                key={ex.id}
                className="border border-gray-300 dark:border-gray-700 p-3 rounded-xl bg-gray-100 dark:bg-gray-800"
              >
                <strong className="text-lg block">{ex.name}</strong>

                {ex.sets && ex.reps && (
                  <div className="text-gray-700 dark:text-gray-300">
                    {ex.sets}×{ex.reps}
                  </div>
                )}

                {ex.weight && (
                  <div className="text-gray-700 dark:text-gray-300">
                    Вага: {ex.weight} кг
                  </div>
                )}

                {ex.duration && (
                  <div className="text-gray-500 dark:text-gray-400">
                    ⏱ {formatDuration(ex.duration)}
                  </div>
                )}

                {ex.distance && (
                  <div className="text-gray-500 dark:text-gray-400">
                    📏 {ex.distance.toFixed(1)} км
                  </div>
                )}

                {ex.notes && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">📝 {ex.notes}</div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-center">Вправи не вказані</p>
        )}
      </div>
    </div>
  );
};

export default WorkoutDetails;
