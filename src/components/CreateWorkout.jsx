import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { Undo } from 'lucide-react';

const CreateWorkout = ({ initialFormData = null, workoutId = null }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [form, setForm] = useState({
    title: '',
    assignedTo: '',
    date: '',
    time: '',
    note: '',
    completed: false,
    exercises: [
      {
        name: { value: '', label: '' },
        sets: '',
        reps: '',
        weight: '',
        duration: '',
        notes: '',
      },
    ],
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (initialFormData) {
      setForm(initialFormData);
    }
  }, [initialFormData]);

  const [clients, setClients] = useState([]);
  const [exerciseOptions, setExerciseOptions] = useState([]);
  
  const isCoach = localStorage.getItem('roles').split(',').includes('TRAINER');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    axiosInstance.get(`/api/users/${userId}`)
      .then(res => {
        setCurrentUser(res.data);
        const user = res.data;

        const mappedClients = user.clients?.map(c => ({
          id: c.id,
          name: `${c.firstName} ${c.lastName}`,
        })) || [];

        const self = { id: user.id, name: 'собі' };
        setClients([self, ...mappedClients]);

        setForm(prev => ({ ...prev, assignedTo: user.id }));
      })
      .catch(err => console.error('Error fetching user:', err));

    axiosInstance.get('/api/exercises')
      .then(res => {
        const data = res.data;
        if (Array.isArray(data)) {
          const options = data
            .filter(name => name && name.trim() !== '')
            .map(name => ({ value: name, label: name }));
          setExerciseOptions(options);
        }
      })
      .catch(err => console.error('Error fetching exercises:', err));
  }, []);

  const handleChange = (field, value) => {
    if (field === 'date') {
      const isFuture = new Date(value) > new Date();
      setForm(prev => ({ ...prev, date: value, completed: isFuture ? false : prev.completed }));
    } else {
      setForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleExerciseChange = (index, field, value) => {
    const newExercises = [...form.exercises];
    if (field === 'name') {
      newExercises[index][field] = value || { value: '', label: '' };
    } else {
      newExercises[index][field] = value;
    }
    setForm(prev => ({ ...prev, exercises: newExercises }));
  };

  const addExercise = () => {
    setForm(prev => ({
      ...prev,
      exercises: [...prev.exercises, {
        name: { value: '', label: '' },
        sets: '',
        reps: '',
        weight: '',
        duration: '',
        notes: '',
      }],
    }));
  };

  const removeExercise = (index) => {
    setForm(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    if (!form.title.trim()) {
      alert('Введіть назву тренування');
      return;
    }

    const dateTime = form.date ? new Date(form.date) : new Date();

    const workout = {
      title: form.title.trim(),
      notation: form.note?.trim() || null,
      date: dateTime.toISOString(),
      completed: form.completed,
      user: { id: form.assignedTo },
      exercises: form.exercises
        .filter(e => Object.values(e).some(val => val !== '' && val !== null))
        .map(e => ({
          name: e.name.value?.trim() || '',
          sets: e.sets !== '' ? parseInt(e.sets) : null,
          reps: e.reps !== '' ? parseInt(e.reps) : null,
          weight: e.weight !== '' ? parseFloat(e.weight) : null,
          duration: e.duration !== '' ? parseInt(e.duration) : null,
          notes: e.notes?.trim() || null,
        })),
    };

    const request = workoutId
      ? axiosInstance.put(`/api/workouts/${workoutId}`, workout)
      : axiosInstance.post('/api/workouts/create', workout);

    request
      .then(() => {
        alert(`Тренування ${workoutId ? 'оновлено' : 'створено'}`);
        navigate('/my-workouts');
      })
      .catch(error => {
        console.error('Помилка збереження:', error);
        alert('Помилка збереження тренування');
      });
  };

  const isFutureDate = form.date && new Date(form.date) > new Date();

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: 'transparent',
      border: 'none',
      boxShadow: 'none',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#fff',
      color: '#000',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#000',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#888',
    }),
  };

  return (
    <div className="max-w-sm mx-auto p-4 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen pb-24">
      <div className="flex items-center mb-4 justify-between">
        <button onClick={() => navigate(-1)} className="mr-2">
          <Undo className="w-5 h-5" />
        </button>
      </div>

      <h2 className="text-2xl font-bold mt-4 text-center">
        {workoutId ? 'Редагувати тренування' : 'Створити тренування'}
      </h2>

      <div className="mt-6 flex justify-center">
        <div className="border-b border-gray-400 dark:border-gray-500 w-2/3">
          <input
            type="text"
            placeholder="Назва тренування"
            value={form.title}
            onChange={e => handleChange('title', e.target.value)}
            className="w-full text-center bg-transparent outline-none text-xl placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
      </div>

      {isCoach && clients.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <label className="text-sm font-medium">Кому:</label>
          <select
            className="rounded px-2 py-1 bg-gray-100 dark:bg-gray-800"
            value={form.assignedTo}
            onChange={e => handleChange('assignedTo', e.target.value)}
          >
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <label className="text-sm font-medium">Дата:</label>
        <input
          type="datetime-local"
          className="rounded px-2 py-1 bg-gray-100 dark:bg-gray-800"
          value={form.date}
          onChange={e => handleChange('date', e.target.value)}
        />
      </div>

      <div className="flex justify-between items-center mt-2">
        <label className="text-sm font-medium">Примітка:</label>
        <input
          type="text"
          value={form.note}
          onChange={e => handleChange('note', e.target.value)}
          className="rounded px-2 py-1 w-44 bg-gray-100 dark:bg-gray-800"
        />
      </div>

      {form.exercises.map((ex, i) => (
        <div key={i} className="mt-6 border-t border-gray-300 dark:border-gray-600 pt-4">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Назва вправи:</label>
            <Select
              value={ex.name.value ? ex.name : null}
              onChange={(selectedOption) => handleExerciseChange(i, 'name', selectedOption)}
              options={exerciseOptions}
              isClearable
              placeholder="Виберіть або введіть вправу..."
              styles={customStyles}
              className="w-48"
              onInputChange={(inputValue, { action }) => {
                if (action === 'input-change' && inputValue) {
                  const newOption = { value: inputValue, label: inputValue };
                  if (!exerciseOptions.some(opt => opt.value === inputValue)) {
                    setExerciseOptions(prev => [...prev, newOption]);
                  }
                  handleExerciseChange(i, 'name', newOption);
                }
              }}
            />
          </div>

          {['sets', 'reps', 'weight', 'duration'].map((field, idx) => (
            <div key={idx} className="flex justify-between items-center mt-1">
              <label className="text-sm font-medium">
                {{
                  sets: 'Підходи',
                  reps: 'Повтори',
                  weight: 'Вага (кг)',
                  duration: 'Тривалість (сек)',
                }[field]}:
              </label>
              <input
                type="number"
                min="0"
                value={ex[field]}
                onChange={(e) => handleExerciseChange(i, field, e.target.value)}
                className="rounded px-2 py-1 w-28 bg-gray-100 dark:bg-gray-800"
              />
            </div>
          ))}

          <div className="flex justify-between items-center mt-2">
            <label className="text-sm font-medium">Примітка:</label>
            <input
              type="text"
              value={ex.notes}
              onChange={(e) => handleExerciseChange(i, 'notes', e.target.value)}
              className="rounded px-2 py-1 w-44 bg-gray-100 dark:bg-gray-800"
            />
          </div>

          <button
            className="text-red-600 dark:text-red-400 mt-2"
            onClick={() => removeExercise(i)}
          >
            🗑️ Видалити вправу
          </button>
        </div>
      ))}

      <button className="text-blue-600 dark:text-blue-400 mt-4" onClick={addExercise}>
        ➕ Додати вправу
      </button>

      <label className="flex items-center mt-4">
        <input
          type="checkbox"
          disabled={isFutureDate}
          checked={form.completed && !isFutureDate}
          onChange={e => handleChange('completed', e.target.checked)}
          className="mr-2"
        />
        Позначити як виконане
      </label>

      <button
        className="mt-6 bg-blue-600 dark:bg-blue-500 text-white w-full py-2 rounded-xl shadow"
        onClick={handleSubmit}
      >
        {workoutId ? 'Оновити' : 'Створити'}
      </button>
    </div>
  );
};

export default CreateWorkout;
