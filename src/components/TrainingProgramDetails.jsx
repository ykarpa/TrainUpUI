import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Undo } from 'lucide-react';
import instance from '../api/axiosInstance';

const TrainingProgramDetails = () => {
  const { programId } = useParams();
  const [program, setProgram] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    instance.get(`/api/programs/${programId}`)
      .then(res => setProgram(res.data))
      .catch(err => console.error(err));
  }, [programId]);

  if (!program) return <div className="text-center mt-20">Завантаження...</div>;

  return (
    <div className="max-w-sm mx-auto p-4 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300">
          <Undo className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-center flex-grow">{program.title}</h1>
      </div>

      <p className="mb-4">{program.description}</p>

      <div className="space-y-3">
        {program.workouts.map(workout => (
          <div
            key={workout.id}
            onClick={() => navigate(`/workouts/${workout.id}`)}
            className="bg-gray-200 dark:bg-gray-700 p-3 rounded shadow cursor-pointer"
          >
            {workout.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingProgramDetails;
