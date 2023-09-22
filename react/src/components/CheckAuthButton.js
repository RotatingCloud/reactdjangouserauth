import React, { useState } from 'react';
import axios from 'axios';

const CheckAuthButton = () => {
  // eslint-disable-next-line
  const [_, setResult] = useState('');
  const [buttonColor, setButtonColor] = useState('default');

  const check_auth = async () => {
    const token = localStorage.getItem('access_token');
    console.log("This is the localStorage token: ", token);

    try {

      const response = await axios.get('http://localhost:8000/check-auth/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        console.log("This is the response: ", response.data.message);
        console.log("username: ", response.data.username)
        console.log("user_id:", response.data.user_id)
        console.log("email: ", response.data.email)
        console.log("is_activated: ", response.data.is_activated)
        setResult(`response.data: ${response.data.message}`);
        setButtonColor('green');
      } else {
        setResult('Something went wrong');
        setButtonColor('red');
      }

    } catch (error) {
      console.log("Authentication failed", error);
      setResult('Authentication failed');
      setButtonColor('red');
    }
  };

  return (
    <div>
      <button 
        onClick={check_auth} 
        style={{ backgroundColor: buttonColor }}
      >
        Check Auth
      </button>
    </div>
  );
};

export default CheckAuthButton;
