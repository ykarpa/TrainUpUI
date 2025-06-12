import React from 'react';
import { Link } from 'react-router-dom';
import BottomNav from './BottomNav';

const Home = () => {
  const roles = (localStorage.getItem('roles') || '').split(',');
  const isTrainer = roles.includes('TRAINER');

  return (
    <div className="max-w-sm mx-auto p-4 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen flex flex-col">
      {/* App Title */}
      <h1 className="text-3xl font-bold text-center mt-6 mb-10">TrainUp</h1>

      {/* Banner Buttons */}
      <div className="flex flex-col gap-5">
        {isTrainer && (
          <>
            <Link
              to="/clients"
              className="bg-green-600 text-white text-xl py-5 rounded-2xl text-center font-semibold shadow-md hover:bg-green-700 transition-all"
            >
              Мої клієнти
            </Link>
            <Link
              to="/my-workouts"
              className="bg-blue-600 text-white text-xl py-5 rounded-2xl text-center font-semibold shadow-md hover:bg-blue-700 transition-all"
            >
              Мої тренування
            </Link>
            <Link
              to="/programs"
              className="bg-purple-600 text-white text-xl py-5 rounded-2xl text-center font-semibold shadow-md hover:bg-purple-700 transition-all"
            >
              Програми тренувань
            </Link>
          </>
        )}

        {!isTrainer && (
          <>
            <Link
              to="/my-workouts"
              className="bg-blue-600 text-white text-xl py-5 rounded-2xl text-center font-semibold shadow-md hover:bg-blue-700 transition-all"
            >
              Мої тренування
            </Link>
            <Link
              to="/programs"
              className="bg-purple-600 text-white text-xl py-5 rounded-2xl text-center font-semibold shadow-md hover:bg-purple-700 transition-all"
            >
              Програми тренувань
            </Link>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;
