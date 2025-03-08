import { useState, useEffect } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

export const useFetch = <T>(url: string, config?: AxiosRequestConfig) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<T>(url, {
          signal: controller.signal,
          ...config,
        });
        setData(response.data);
      } catch (err) {
        if (axios.isCancel(err)) return;
        setError('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [url, config]);

  return { data, loading, error };
};
