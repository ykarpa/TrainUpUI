import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { Plus, MoreVertical, ChevronDown, ChevronUp, Undo } from 'lucide-react';
import BottomNav from '../components/BottomNav';

const MyWorkout = () => {
  const [workouts, setWorkouts] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) return;
    axiosInstance.get(`/api/workouts/user/${userId}`)
      .then(res => setWorkouts(res.data))
      .catch(err => console.error('Помилка при завантаженні тренувань', err));
  }, [userId]);

  const now = new Date();

  const planned = workouts.filter(w => !w.completed && new Date(w.date) >= now);
  const overdue = workouts.filter(w => !w.completed && new Date(w.date) < now);
  const completed = workouts.filter(w => w.completed);

  const toggleCompleted = (id, currentValue) => {
    axiosInstance.put(`/api/workouts/${id}`, { completed: !currentValue })
      .then(() => {
        setWorkouts(prev => prev.map(w => w.id === id ? { ...w, completed: !currentValue } : w));
        setMenuOpenId(null);
      });
  };

  const deleteWorkout = (id) => {
    if (!window.confirm('Видалити тренування?')) return;
    axiosInstance.delete(`/api/workouts/${id}`)
      .then(() => {
        setWorkouts(prev => prev.filter(w => w.id !== id));
        setMenuOpenId(null);
      });
  };

  return (
    <div className="max-w-sm mx-auto flex flex-col min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <header className="p-4 flex justify-between items-center">
        <button onClick={() => navigate(-1)}>
          <Undo className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold">Мої тренування</h1>
        <button onClick={() => navigate(`/create-workout/${userId}`)}>
          <Plus />
        </button>
      </header>

      <main className="flex-1 px-4 pb-20">
        <Section title="🕒 Заплановані" workouts={planned} menuOpenId={menuOpenId} setMenuOpenId={setMenuOpenId} toggleCompleted={toggleCompleted} deleteWorkout={deleteWorkout} />
        <Section title="⏰ Прострочені" workouts={overdue} menuOpenId={menuOpenId} setMenuOpenId={setMenuOpenId} toggleCompleted={toggleCompleted} deleteWorkout={deleteWorkout} />
        <div className="mb-4">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowCompleted(!showCompleted)}>
            <h2 className="text-lg font-semibold">📦 Архів</h2>
            {showCompleted ? <ChevronUp /> : <ChevronDown />}
          </div>
          {showCompleted && (
            <Section workouts={completed} menuOpenId={menuOpenId} setMenuOpenId={setMenuOpenId} toggleCompleted={toggleCompleted} deleteWorkout={deleteWorkout} />
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

const Section = ({ title, workouts, menuOpenId, setMenuOpenId, toggleCompleted, deleteWorkout }) => (
  <section className="mb-4">
    {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
    {workouts.length > 0 ? workouts.map(w => (
      <WorkoutItem
        key={w.id}
        workout={w}
        menuOpen={menuOpenId === w.id}
        onMenuToggle={() => setMenuOpenId(menuOpenId === w.id ? null : w.id)}
        toggleCompleted={toggleCompleted}
        deleteWorkout={deleteWorkout}
      />
    )) : <p className="text-sm text-gray-400">Немає</p>}
  </section>
);

const WorkoutItem = ({ workout, menuOpen, onMenuToggle, toggleCompleted, deleteWorkout }) => {
  return (
    <div className="relative mb-3">
      <Link
        to={`/workouts/${workout.id}`}
        className="block p-3 bg-gray-100 dark:bg-gray-800 rounded-xl shadow hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <div className="flex justify-between items-center">
          <div>
            <div className="font-semibold">{workout.title}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(workout.date).toLocaleString('uk-UA', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
          <button onClick={(e) => { e.preventDefault(); onMenuToggle(); }}>
            <MoreVertical />
          </button>
        </div>
      </Link>

      {menuOpen && (
        <div className="absolute top-2 right-10 bg-white dark:bg-gray-700 border rounded shadow z-10 text-sm">
          <button
            className="block px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600"
            onClick={() => toggleCompleted(workout.id, workout.completed)}
          >
            {workout.completed ? 'Позначити як невиконане' : 'Позначити як виконане'}
          </button>
          <button
            className="block px-4 py-2 w-full text-left hover:bg-red-100 text-red-600 dark:hover:bg-red-600 dark:text-red-300"
            onClick={() => deleteWorkout(workout.id)}
          >
            Видалити
          </button>
        </div>
      )}
    </div>
  );
};

export default MyWorkout;
