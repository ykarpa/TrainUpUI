import React from 'react';
import {
  User,
  CalendarDays,
  Dumbbell,
  MessageCircleMore,
  Home,
} from 'lucide-react';

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white dark:bg-gray-900 border-t dark:border-gray-700 flex justify-around py-3">
      <button onClick={() => (window.location.href = '/')}>
        <Home className="w-6 h-6 text-gray-800 dark:text-white" />
      </button>
      <button onClick={() => (window.location.href = '/my-workouts')}>
        <Dumbbell className="w-6 h-6 text-gray-800 dark:text-white" />
      </button>
      <button onClick={() => (window.location.href = '/chats')}>
        <MessageCircleMore className="w-6 h-6 text-gray-800 dark:text-white" />
      </button>
      <button onClick={() => (window.location.href = '/calendar')}>
        <CalendarDays className="w-6 h-6 text-gray-800 dark:text-white" />
      </button>
      <button onClick={() => (window.location.href = '/profile')}>
        <User className="w-6 h-6 text-gray-800 dark:text-white" />
      </button>
    </nav>
  );
};

export default BottomNav;
