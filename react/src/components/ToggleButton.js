import React, { useEffect } from 'react';
import { useTheme } from './ThemeContext';  // Make sure the path is correct

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

const setCookie = (name, value, days) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};

const ToggleButton = () => {
  
  const { theme, toggleTheme, setTheme } = useTheme(); // Now setTheme is available

  useEffect(() => {
    const savedTheme = getCookie('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [setTheme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    setCookie('theme', theme, 365);

  }, [theme]);

  return (
    <div>
      <button onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
};

export default ToggleButton;
