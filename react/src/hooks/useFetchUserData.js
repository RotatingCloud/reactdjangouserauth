import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchUserData = (url) => {  // Added url parameter

  const [userData, setUserData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);  // To store potential error data

  useEffect(() => {
    setIsLoading(true);  // Set loading to true at the start
    try {
      const token = localStorage.getItem('access_token');

      axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (response.status === 200) {
          setUserData({
            username: response.data.username,
            email: response.data.email,
            first_name: response.data.first_name,
            last_name: response.data.last_name,
          });
        }
        setIsLoading(false);
      })
      .catch(err => {
        setError(err);
        setIsLoading(false);
      });
    } catch (err) {
      setError(err);
      setIsLoading(false);
      console.error("There was an error fetching user details:", err);
    };
  }, [url]);  // Dependency on the url, so it'll refetch if url changes

  return [userData, error];  // Changed to return in array format
};
export default useFetchUserData;
