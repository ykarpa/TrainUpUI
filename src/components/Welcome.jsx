import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="max-w-sm mx-auto p-4 min-h-screen flex flex-col justify-center items-center bg-white dark:bg-gray-900 text-black dark:text-white">
      <h1 className="text-4xl font-bold mb-10">TrainUp</h1>
      <Link
        to="/login"
        className="bg-blue-600 text-white text-xl py-4 px-10 rounded-2xl text-center font-semibold shadow-md hover:bg-blue-700 transition-all mb-4 w-full text-center"
      >
        Вхід
      </Link>
      <Link
        to="/register"
        className="bg-gray-600 text-white text-xl py-4 px-10 rounded-2xl text-center font-semibold shadow-md hover:bg-gray-700 transition-all w-full text-center"
      >
        Реєстрація
      </Link>
    </div>
  );
};

export default Welcome;
