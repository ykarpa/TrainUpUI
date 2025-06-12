import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Undo } from 'lucide-react';
import instance from '../api/axiosInstance';

const TrainingPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    instance.get('/api/programs')
      .then(res => setPrograms(res.data))
      .catch(err => console.error(err));
  }, []);

  console.log(programs.title);

  return (
    <div className="max-w-sm mx-auto p-4 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300">
          <Undo className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-center flex-grow">Програми тренувань</h1>
      </div>

      <div className="space-y-4 mt-6">
        {programs.map(program => (
          <div
            key={program.id}
            onClick={() => navigate(`/programs/${program.id}`)}
            className="bg-blue-600 text-white p-4 rounded shadow cursor-pointer hover:bg-blue-700 transition-all"
          >
            <h2 className="font-semibold text-lg">{program.title}</h2>
            <p className="text-sm opacity-80 mt-1">{program.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingPrograms;
