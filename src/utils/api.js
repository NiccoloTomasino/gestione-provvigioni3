// src/utils/api.js
import axios from 'axios';

// Imposta l'URL base per le richieste API
const baseURL = process.env.NODE_ENV === 'production' 
  ? '/api'  // In produzione, le richieste andranno allo stesso dominio
  : 'http://localhost:5000/api';  // In sviluppo, collega al server locale

const api = axios.create({
  baseURL
});

// Funzioni per le richieste API
export const getProvvigioni = async () => {
  try {
    const response = await api.get('/provvigioni');
    return response.data;
  } catch (error) {
    console.error('Errore nel recupero delle provvigioni:', error);
    throw error;
  }
};

export const addProvvigione = async (provvigioneData) => {
  try {
    const response = await api.post('/provvigioni', provvigioneData);
    return response.data;
  } catch (error) {
    console.error('Errore nell\'aggiunta della provvigione:', error);
    throw error;
  }
};

export const updateProvvigione = async (id, provvigioneData) => {
  try {
    const response = await api.put(`/provvigioni/${id}`, provvigioneData);
    return response.data;
  } catch (error) {
    console.error(`Errore nell'aggiornamento della provvigione ${id}:`, error);
    throw error;
  }
};

export const deleteProvvigione = async (id) => {
  try {
    const response = await api.delete(`/provvigioni/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Errore nell'eliminazione della provvigione ${id}:`, error);
    throw error;
  }
};

export const getProvvigioneById = async (id) => {
  try {
    const response = await api.get(`/provvigioni/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Errore nel recupero della provvigione ${id}:`, error);
    throw error;
  }
};
