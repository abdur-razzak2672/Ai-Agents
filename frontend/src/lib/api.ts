import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

export const generateFromUrl = async (url: string) => {
  const response = await api.post('/generations', { url });
  return response.data;
};

export const getHistory = async () => {
  const response = await api.get('/generations');
  return response.data;
};

export const updateGeneration = async (id: string, code: string) => {
  const response = await api.put(`/generations/${id}`, { code });
  return response.data;
};

// Medical AI Endpoints
export const analyzeSymptoms = async (userId: string, symptoms: string) => {
  const response = await api.post('/medical/analyze', { userId, symptoms });
  return response.data;
};

export const getMedicalHistory = async (userId: string) => {
  const response = await api.get(`/medical/history/${userId}`);
  return response.data;
};

export const getConsultation = async (id: string) => {
  const response = await api.get(`/medical/consultation/${id}`);
  return response.data;
};

export const verifyPrescription = async (id: string, data: any) => {
  const response = await api.patch(`/medical/verify/${id}`, data);
  return response.data;
};
