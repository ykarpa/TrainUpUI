import React, { useEffect, useState } from 'react';
import { FaPen, FaPlus } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';
import { Undo } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BMIIndicator from './BMIIndicator';
import axiosInstance from '../api/axiosInstance';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale);

const userId = localStorage.getItem('userId');

const PersonalIndicators = () => {
  const [measurements, setMeasurements] = useState([]);
  const [latest, setLatest] = useState(null);
  const [editing, setEditing] = useState({ height: false, weight: false });
  const [newHeight, setNewHeight] = useState('');
  const [newWeight, setNewWeight] = useState('');
  const [additional, setAdditional] = useState([]);
  const [showAdditional, setShowAdditional] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [addWeightValue, setAddWeightValue] = useState('');
  const [addWeightDate, setAddWeightDate] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get(`/api/measurements/${userId}`).then(res => setMeasurements(res.data));
    axiosInstance.get(`/api/measurements/latest/${userId}`).then(res => {
      setLatest(res.data);
      setNewHeight(res.data?.height || '');
      setNewWeight(res.data?.weight || '');
    });
    axiosInstance.get(`/api/measurements/additional/latest/${userId}`).then(res => setAdditional(res.data));
  }, []);

  const handleAddWeight = () => {
    if (!addWeightValue || parseFloat(addWeightValue) <= 0) {
      return alert('Некоректна вага');
    }

    const payload = {
      user: { id: userId },
      weight: parseFloat(addWeightValue),
      height: parseFloat(newHeight),
      date: addWeightDate || new Date().toISOString(),
      additionalMeasurements: additional.map(a => ({ name: a.name, value: a.value })),
    };

    axiosInstance.post('/api/measurements', payload).then(() => window.location.reload());
  };

  const updateAdditional = (name, value) => {
    setAdditional(prev => prev.map(a => a.name === name ? { ...a, value } : a));
  };

  const addAdditionalField = () => {
    setAdditional(prev => [...prev, { name: '', value: '' }]);
  };

  const weightChartData = {
    labels: measurements.map(m => new Date(m.date).toLocaleDateString()),
    datasets: [{
      label: 'Вага (кг)',
      data: measurements.map(m => m.weight),
      fill: false,
      borderColor: 'red',
      tension: 0.3,
    }]
  };

  return (
    <div className="max-w-sm mx-auto p-4 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <div className="flex items-center mb-4 justify-between">
        <button onClick={() => navigate(-1)} className="mr-2">
          <Undo className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Height */}
        <div className="flex justify-between items-center">
          <span>Ваш ріст</span>
          {editing.height ? (
            <input
              type="number"
              min="0"
              value={newHeight}
              onChange={e => setNewHeight(e.target.value)}
              className="w-20 px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
              onBlur={() => setEditing(p => ({ ...p, height: false }))}
              autoFocus
            />
          ) : (
            <span>
              {newHeight} см <FaPen onClick={() => setEditing(p => ({ ...p, height: true }))} className="inline ml-1 cursor-pointer" />
            </span>
          )}
        </div>

        {/* Weight */}
        <div className="flex justify-between items-center">
          <span>Ваша вага</span>
          {editing.weight ? (
            <input
              type="number"
              min="0"
              value={newWeight}
              onChange={e => setNewWeight(e.target.value)}
              className="w-20 px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
              onBlur={() => setEditing(p => ({ ...p, weight: false }))}
              autoFocus
            />
          ) : (
            <span>
              {newWeight} кг <FaPen onClick={() => setEditing(p => ({ ...p, weight: true }))} className="inline ml-1 cursor-pointer" />
            </span>
          )}
        </div>

        {/* Additional */}
        <div className="flex justify-between items-center">
          <span>Інші виміри</span>
          <FaPlus className="cursor-pointer" onClick={() => setShowAdditional(!showAdditional)} />
        </div>

        {showAdditional && (
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
            {additional.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center mb-2">
                <input
                  type="text"
                  className="w-1/2 bg-transparent border-b border-gray-400 text-black dark:text-white"
                  value={item.name}
                  onChange={(e) => {
                    const updated = [...additional];
                    updated[idx].name = e.target.value;
                    setAdditional(updated);
                  }}
                />
                <input
                  type="number"
                  min="0"
                  className="w-1/4 bg-transparent border-b border-gray-400 text-black dark:text-white"
                  value={item.value}
                  onChange={(e) => updateAdditional(item.name, e.target.value)}
                /> см
              </div>
            ))}
            <button className="text-blue-600 text-sm" onClick={addAdditionalField}>+ Додати вимір</button>
          </div>
        )}

        {/* BMI */}
        <div className="text-center mt-6">
          <h2 className="text-lg font-bold">Ваш ІМТ</h2>
          {newHeight && newWeight && (
            <BMIIndicator height={parseFloat(newHeight)} weight={parseFloat(newWeight)} />
          )}
        </div>

        {/* Weight Chart */}
        <div className="mt-6">
          <h3 className="text-center font-semibold mb-2">СТАТИСТИКА ВАГИ</h3>
          <Line data={weightChartData} />
        </div>

        {/* Add New Weight */}
        <div className="mt-4 space-y-2">
          <input
            type="number"
            min="0"
            value={addWeightValue}
            onChange={e => setAddWeightValue(e.target.value)}
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
            placeholder="Вага"
          />
          <input
            type="datetime-local"
            value={addWeightDate}
            max={new Date().toISOString().slice(0, 16)}
            onChange={e => setAddWeightDate(e.target.value)}
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
          />
          <button onClick={handleAddWeight} className="w-full bg-blue-500 text-white p-2 rounded">Додати вагу</button>
        </div>

        {/* History Toggle */}
        <button className="mt-2 text-center text-blue-600 underline" onClick={() => setShowHistory(!showHistory)}>
          Переглянути історію
        </button>

        {/* History List */}
        {showHistory && (
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2 max-h-48 overflow-y-auto">
            {measurements.map((m, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>{new Date(m.date).toLocaleDateString()}</span>
                <span>{m.weight} кг</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalIndicators;
