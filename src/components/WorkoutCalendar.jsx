import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Undo } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import BottomNav from './BottomNav';

const WorkoutCalendar = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const isTrainer = localStorage.getItem('roles').split(',').includes('TRAINER');

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [workouts, setWorkouts] = useState([]);
  const [dates, setDates] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const endpoint = isTrainer
          ? `/api/workouts/trainer/${userId}`
          : `/api/workouts/user/${userId}`;
        const response = await axiosInstance.get(endpoint);
        setWorkouts(response.data);
      } catch (error) {
        console.error('Error fetching workouts:', error);
        setWorkouts([]);
      }
    };

    fetchWorkouts();
  }, [userId, isTrainer]);

  useEffect(() => {
    const generateDates = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const start = new Date(today);
      start.setDate(today.getDate() - 15);

      const result = [];
      for (let i = 0; i <= 30; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        result.push(date);
      }
      setDates(result);

      setTimeout(() => {
        if (scrollRef.current) {
          const centerIndex = result.findIndex(d => d.toDateString() === today.toDateString());
          const elementWidth = 56;
          scrollRef.current.scrollLeft = (centerIndex - 2) * elementWidth;
        }
      }, 0);
    };

    generateDates();
  }, []);

  const filteredWorkouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    workoutDate.setHours(0, 0, 0, 0);
    return workoutDate.getTime() === new Date(selectedDate).setHours(0, 0, 0, 0);
  });

  const formatMonthYear = date =>
    date.toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' }).toUpperCase();

  const formatDayOfWeek = date => ['НД', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'][date.getDay()];

  const formatTime = dateStr =>
    new Date(dateStr).toLocaleTimeString('uk-UA', {
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="max-w-sm mx-auto p-4 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen pb-24">
      <div className="flex justify-between items-center">
        <button onClick={() => navigate(-1)}>
          <Undo className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold">Календар</h2>
        <div className="w-9" /> 
      </div>

      <div className="text-center mt-4">
        <h3 className="text-lg font-semibold">{formatMonthYear(selectedDate)}</h3>
      </div>

      <div
        ref={scrollRef}
        className="relative mt-4 overflow-x-auto scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="flex space-x-2 px-4 w-max">
          {dates.map((date, index) => {
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const isToday = date.toDateString() === new Date().toDateString();
            return (
              <div
                key={index}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center p-2 rounded-lg cursor-pointer min-w-[56px] ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : isToday
                    ? 'bg-gray-300 dark:bg-gray-700'
                    : ''
                }`}
              >
                <span className="text-sm">{date.getDate()}</span>
                <span className="text-xs">{formatDayOfWeek(date)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        {Array.from({ length: 12 }, (_, i) => i * 2).map(hour => (
          <div
            key={hour}
            className="flex items-start py-2 border-b border-gray-300 dark:border-gray-600"
          >
            <span className="w-16 text-sm text-gray-600 dark:text-gray-400">{hour}:00</span>
            <div className="flex-1">
              {filteredWorkouts
                .filter(workout => new Date(workout.date).getHours() === hour)
                .map((workout, index) => (
                  <div
                    key={index}
                    onClick={() => navigate(`/workouts/${workout.id}`)}
                    className="text-sm py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  >
                    {isTrainer ? (
                      <>
                        {workout.clientName ? (
                          `${workout.clientName} (${workout.gymName || 'Зал не вказано'})`
                        ) : (
                          'Моє тренування'
                        )}
                      </>
                    ) : (
                      <>
                        {formatTime(workout.date)} {workout.title}
                      </>
                    )}
                    <span className="ml-2 text-gray-500 dark:text-gray-400">
                      {workout.completed ? '(Виконано)' : '(Заплановано)'}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
        {filteredWorkouts.length === 0 && (
          <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
            Тренувань на цю дату немає
          </p>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default WorkoutCalendar;
