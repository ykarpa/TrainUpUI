import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import BottomNav from '../components/BottomNav';
import { Undo, SquarePen } from 'lucide-react';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  const userId = Number(localStorage.getItem('userId'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axiosInstance.get(`/api/chats/user/${userId}`);
        setChats(res.data);
      } catch (error) {
        console.error('Error loading chats:', error);
      }
    };

    fetchChats();
  }, [userId]);

  const getOtherParticipant = (chat) =>
    chat.participant1.id === userId ? chat.participant2 : chat.participant1;

  const getLastMessage = (chat) => {
    if (!chat.messages || chat.messages.length === 0) return 'Немає повідомлень';
    const last = chat.messages[chat.messages.length - 1];
    return `${last.sender.id === userId ? 'Ви' : getOtherParticipant(chat).firstName}: ${last.content}`;
  };

  const searchUsers = async (query) => {
    try {
      const res = await axiosInstance.get(`/api/users/search?query=${query}`);
      setSearchResults(res.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleGetOrCreateChat = async (otherUserId) => {
    try {
      const res = await axiosInstance.post(`/api/chats/get-or-create`, {
        userId1: userId,
        userId2: otherUserId,
      });
      const chatId = res.data.id;
      navigate(`/chat/${chatId}`);
    } catch (error) {
      console.error('Error creating/getting chat:', error);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => navigate(-1)} className="mr-2">
          <Undo className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">Ваші чати</h1>
        <button
          onClick={() => setShowSearch((prev) => !prev)}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <SquarePen className="w-5 h-5" />
        </button>
      </div>

      {/* User search */}
      {showSearch && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Пошук користувача..."
            value={searchTerm}
            onChange={(e) => {
              const value = e.target.value;
              setSearchTerm(value);
              if (value.trim()) searchUsers(value);
              else setSearchResults([]);
            }}
            className="w-full p-2 rounded border mb-2 dark:bg-gray-800 dark:border-gray-700"
          />
          {searchResults.length > 0 && (
            <ul className="bg-gray-100 dark:bg-gray-800 rounded p-2">
              {searchResults.map((user) => (
                <li key={user.id} className="flex justify-between items-center py-1">
                  <span>{user.firstName} {user.lastName} ({user.username})</span>
                  <button
                    onClick={() => handleGetOrCreateChat(user.id)}
                    className="text-blue-500 hover:underline"
                  >
                    Почати чат
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {chats.map((chat) => {
          const other = getOtherParticipant(chat);
          return (
            <Link
              to={`/chat/${chat.id}`}
              key={chat.id}
              className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <img
                src={other.avatarUrl || '/default-avatar.png'}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <div className="font-semibold">{other.firstName} {other.lastName}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px]">
                  {getLastMessage(chat)}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default ChatList;
