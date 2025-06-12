import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import WorkoutCalendar from './components/WorkoutCalendar';
import WorkoutDetails from './components/WorkoutDetails';
import CreateWorkout from './components/CreateWorkout';
import ChatList from './components/ChatList';
import ChatView from './components/ChatView';
import Settings from './components/Settings';
import Home from './components/Home';
import TrainingPrograms from './components/TrainingPrograms';
import TrainingProgramDetails from './components/TrainingProgramDetails';
import Profile from './components/Profile';
import PersonalIndicators from './components/PersonalIndicators';
import ClientList from './components/ClientList';
import ClientQuickView from './components/ClientQuickView';
import Welcome from './components/Welcome';
import { useAuth } from './api/AuthContext';
import MyWorkout from './components/MyWorkouts';
import EditWorkout from './components/EditWorkout';


if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark');
}

const App = () => {
  const { token } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={localStorage.getItem('token') ? <Home /> : <Login />} />
        <Route path="/register" element={localStorage.getItem('token') ? <Home /> : <Register />} />
        <Route path="/calendar" element={<WorkoutCalendar />} />
        <Route path="/workouts/:workoutId" element={<WorkoutDetails />} />
        <Route path="/create-workout/:userId" element={<CreateWorkout />} />
        <Route path="/chats" element={<ChatList />} />
        <Route path="/chat/:chatId" element={<ChatView />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/clients" element={<ClientList />} />
        <Route path="/clients/:clientId" element={<ClientQuickView />} />
        <Route path="/programs" element={<TrainingPrograms />} />
        <Route path="/workouts/:workoutId/edit" element={<EditWorkout />} />
        <Route path="/my-workouts" element={<MyWorkout />} />
        <Route path="/programs/:programId" element={<TrainingProgramDetails />} />
        <Route path="/" element={localStorage.getItem('token') ? <Home /> : <Welcome />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/indicators" element={<PersonalIndicators />} />
      </Routes>
    </Router>
  );
};

export default App;