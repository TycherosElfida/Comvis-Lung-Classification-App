import { useState } from 'react';
import axios from 'axios';

export const useInference = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const predict = async (file) => {
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // In development, Vite proxies /predict to http://127.0.0.1:8000/predict
      const response = await axios.post('/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to predict');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { predict, loading, result, error };
};
