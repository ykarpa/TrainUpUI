// імпорти не змінюються
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Undo, X } from 'lucide-react';
import BottomNav from './BottomNav';
import instance from '../api/axiosInstance';

const ClientList = () => {
  const navigate = useNavigate();
  const trainerId = localStorage.getItem('userId');
  const [trainer, setTrainer] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [groupedClients, setGroupedClients] = useState({});
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const isCoach = localStorage.getItem('roles').split(',').includes('TRAINER');

  useEffect(() => {
    if (!isCoach) return;
    instance.get(`/api/users/${trainerId}`)
      .then(res => {
        const data = res.data;
        setTrainer(data);
        if (data.locations.length > 0) setSelectedLocation(data.locations[0]);

        const grouped = {};
        data.clients.forEach(client => {
          const locs = client.locations || ['Невідомо'];
          locs.forEach(loc => {
            if (!grouped[loc]) grouped[loc] = [];
            grouped[loc].push(client);
          });
        });
        setGroupedClients(grouped);
      })
      .catch(err => console.error('Помилка при завантаженні:', err));
  }, [trainerId]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await instance.get(`/api/users/search?query=${searchQuery}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error('Помилка при пошуку:', err);
    }
  };

  const assignClient = async (clientId) => {
    try {
      await instance.put(`/api/users/${clientId}/assign-trainer`, null, {
        params: { trainerId, location: selectedLocation }
      });
      setShowSearch(false);
      window.location.reload();
    } catch (err) {
      console.error('Помилка при додаванні клієнта:', err);
    }
  };

  if (!trainer) return <div className="text-center mt-20">Завантаження...</div>;

  return (
    <div className="max-w-sm mx-auto p-4 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen relative">
      {/* Верхній бар */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate(-1)} className="text-gray-700 dark:text-gray-300">
          <Undo className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">Клієнти</h1>
        <div className="w-5 h-5" />
      </div>

      {/* Локації */}
      <div className={`flex gap-2 mb-4 ${trainer.locations.length <= 2 ? 'justify-left' : 'overflow-x-auto'}`}>
        {trainer.locations.map(loc => (
          <button
            key={loc}
            onClick={() => setSelectedLocation(loc)}
            className={`flex-shrink-0 px-4 py-1 rounded-full ${
              selectedLocation === loc
                ? 'bg-black dark:bg-white text-white dark:text-black'
                : 'bg-gray-300 dark:bg-gray-700 text-black dark:text-white'
            }`}
          >
            {loc}
          </button>
        ))}
      </div>

      {/* Картки клієнтів */}
      <div className="grid grid-cols-3 gap-2">
        {(groupedClients[selectedLocation] || []).map(client => (
          <Link
            to={`/clients/${client.id}`}
            key={client.id}
            className="block p-2 border rounded-lg text-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {client.photoUrl ? (
              <img
                src={client.photoUrl}
                alt="Фото клієнта"
                className="w-12 h-12 mx-auto rounded-full object-cover mb-1"
              />
            ) : (
              <div className="text-3xl mb-1">👤</div>
            )}
            <div className="text-sm truncate">{client.firstName}</div>
          </Link>
        ))}

        {/* Кнопка "Додати" */}
        <div
          onClick={() => setShowSearch(true)}
          className="p-2 border border-dashed border-gray-500 rounded-lg text-center bg-white dark:bg-gray-800 cursor-pointer"
        >
          <div className="text-3xl mb-1">➕</div>
          <div className="text-sm">Додати</div>
        </div>
      </div>

      {/* Модальне вікно */}
      {showSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg max-w-sm w-full text-black dark:text-white relative">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">Пошук клієнта</h2>
              <button
                onClick={() => setShowSearch(false)}
                className="text-gray-500 hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Ім'я, прізвище або username"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim()) {
                  handleSearch();
                } else {
                  setSearchResults([]);
                }
              }}
              className="w-full p-2 border rounded mb-2 text-black"
            />

            {searchResults.length > 0 && (
              <ul className="max-h-60 overflow-y-auto divide-y">
                {searchResults.map(user => (
                  <li key={user.id} className="flex justify-between items-center p-2">
                    <div>
                      <div className="font-semibold">{user.firstName} {user.lastName}</div>
                      <div className="text-sm text-gray-400">@{user.username}</div>
                    </div>
                    <button
                      onClick={() => assignClient(user.id)}
                      className="text-sm text-blue-500 hover:underline"
                    >
                      Додати
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default ClientList;
