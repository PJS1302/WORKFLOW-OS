import { useState, useEffect } from 'react';
import api from '../services/api';

export const useFetch = (url, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get(url);
        if (isMounted) {
          setData(res.data.data || res.data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) setError(err.response?.data?.error || 'Error fetching data');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (url) fetchData();

    return () => { isMounted = false; };
  }, [url, ...dependencies]);

  return { data, loading, error, setData };
};