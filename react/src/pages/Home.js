import axios from "axios";
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import ToggleButton from '../components/ToggleButton';
import CheckAuthButton from "../components/CheckAuthButton";

const Home = () => {

  const navigate = useNavigate();
  const [username, setUsername] = useState('Unknown');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [is_activated, setIsActivated] = useState('Not Verified');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {

    const token = localStorage.getItem('access_token');

    if (!token) {

      navigate('/');
      return;

    }

    const storedUserData = localStorage.getItem('user_data');

    if (storedUserData) {

        const userData = JSON.parse(storedUserData);

        setUsername(userData.username);
        setFirstName(userData.first_name);
        setLastName(userData.last_name);
        setIsActivated(userData.is_activated ? 'Verified' : 'Not Verified');

    }

    axios.get('http://127.0.0.1:8000/get-account-data/', {

        headers: {

          'Authorization': `Bearer ${token}`
        }

      })
      .then(response => {
        
      // If request is successful, populate state
        if (response.status === 200) {

          console.log("response data:", response.data);

          setUsername(response.data.username);
          setFirstName(response.data.first_name);
          setLastName(response.data.last_name);
          setIsActivated(response.data.is_activated ? 'Verified' : 'Not Verified');

        }
      })

  }, [navigate]);

  const sign_out = () => {

    axios.post('http://127.0.0.1:8000/logout/', {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    .then(() => {
      localStorage.removeItem("access_token");
      navigate('/');
    })
    .catch(error => {
      console.error("Error during sign-out!", error);
      localStorage.removeItem("access_token");
      navigate('/');
    });

  };

  const verify_account = () => {

    setIsLoading(true);

    axios.post('http://127.0.0.1:8000/resend-activation-email/', {
      username,
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    .then((response) => {

      setIsLoading(false);

      console.log("This is the response: ", response)

      if(response.status === 200) {

        setMessage("Verification email sent!")
        console.log("Verification email sent!")

        setTimeout(() => {
          setMessage('');
        }, 5000);

      }
    })
    .catch((error) => {

      setIsLoading(false);
      setMessage("Error sending verification email!");
      console.error("Error sending verification email!", error);

      setTimeout(() => {
        setMessage('');
      }, 5000);

    })
    

  };

  return (
    <div id='container'>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <label>{message}</label>
      <h1>{first_name} <i>"{username}"</i> {last_name}</h1>
      <h3>Account Status: {is_activated}</h3>
      <button onClick={sign_out} className='signout'>Sign Out</button>
      <button onClick={() => navigate('/edit-profile')}>Edit Profile</button>
      {is_activated !== 'Verified' && <button onClick={verify_account}>Verify Account</button>}
      <button onClick={() => navigate('/request-change-password')}>Change Password</button>
      <button onClick={() => navigate('/delete-account')}>Delete Account</button>
      <ToggleButton/>
      <CheckAuthButton/>
    </div>
  )
}

export default Home;
