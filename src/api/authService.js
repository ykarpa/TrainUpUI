import axios from 'axios';
import API_URL from '../config';

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const register = async (registrationDTO) => {
  const response = await instance.post('/api/auth/register', registrationDTO);

  localStorage.setItem('token', response.data.token);
  localStorage.setItem('userId', response.data.userId);
  localStorage.setItem('role', response.data.role);
  return response.data;
};

export const login = async (loginDTO) => {
  const response = await instance.post(`${API_URL}/api/auth/login`, loginDTO);

  localStorage.setItem('token', response.data.token);
  localStorage.setItem('userId', response.data.userId);

  const roles = response.data.roles;
  localStorage.setItem('roles', roles.map(r => r.name).join(','));
  return response.data;
};

export const getUserById = async (id) => {
  const response = await instance.get(`/api/auth/${id}`);
  return response.data;
};

export const checkUsernameExists = async (username) => {
  const res = await axios.get(`${API_URL}/api/auth/check-username?username=${username}`);
  return res.data.exists;
};

export const checkEmailExists = async (email) => {
  const res = await axios.get(`${API_URL}/api/auth/check-email?email=${email}`);
  return res.data.exists;
};