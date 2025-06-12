import CreateWorkout from './CreateWorkout';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const EditWorkout = () => {
  const { workoutId } = useParams();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    axiosInstance
      .get(`/api/workouts/${workoutId}`)
      .then((res) => {
        const data = res.data;

        // Перетворення для сумісності з CreateWorkout
        const preparedForm = {
          title: data.title || '',
          assignedTo: data.user?.id || '',
          date: data.date ? new Date(data.date).toISOString().slice(0, 16) : '',
          time: '', // опціонально, бо вже в `date`
          note: data.notation || '',
          completed: data.completed || false,
          exercises: data.exercises?.map(e => ({
            name: { value: e.name, label: e.name },
            sets: e.sets ?? '',
            reps: e.reps ?? '',
            weight: e.weight ?? '',
            duration: e.duration ?? '',
            notes: e.notes ?? '',
          })) || [],
        };

        setInitialData(preparedForm);
      })
      .catch((err) => console.error('Не вдалося завантажити тренування', err));
  }, [workoutId]);

  if (!initialData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-black dark:text-white">
        Завантаження даних для редагування...
      </div>
    );
  }

  return <CreateWorkout initialFormData={initialData} workoutId={workoutId} />;
};

export default EditWorkout;
