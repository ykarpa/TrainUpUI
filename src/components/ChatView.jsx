import { Undo } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const ChatView = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const userId = Number(localStorage.getItem('userId'));

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await axiosInstance.get(`/api/messages/chat/${chatId}`);
      setMessages(res.data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };
  
  const fetchChat = async () => {
    try {
      const res = await axiosInstance.get(`/api/chats/${chatId}`);
      const chat = res.data;
      const other = chat.participant1.id === userId ? chat.participant2 : chat.participant1;
      setOtherUser(other);
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  };
  
  const sendMessage = async () => {
    if (input.trim() === '') return;
    try {
      await axiosInstance.post(`/api/messages/chat/${chatId}/send`, {
        senderId: userId,
        content: input,
      });
      setInput('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchChat();
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="max-w-sm mx-auto p-4 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen flex flex-col">

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)}>
          <Undo className="w-5 h-5" />
        </button>

        {otherUser && (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate(`/users/${otherUser.id}`)}
          >
            <img
              src={otherUser.avatarUrl || '/default-avatar.png'}
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
            <span className="font-medium">
              {otherUser.firstName} {otherUser.lastName}
            </span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 p-2 rounded max-w-xs ${
              msg.sender?.id === userId
                ? 'bg-blue-500 text-white ml-auto'
                : 'bg-gray-300 dark:bg-gray-700'
            }`}
          >
            {msg.content}
            <div className="text-xs text-right">{new Date(msg.timestamp).toLocaleString()}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex">
        <input
          type="text"
          placeholder="Ваше повідомлення..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border dark:border-gray-700 rounded-l bg-white dark:bg-gray-800 text-black dark:text-white"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded-r"
        >
          Надіслати
        </button>
      </div>
    </div>
  );
};

export default ChatView;
