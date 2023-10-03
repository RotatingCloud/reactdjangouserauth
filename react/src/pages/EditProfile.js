import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

import ToggleButton from '../components/ToggleButton';
import CheckAuthButton from '../components/CheckAuthButton';

import useFetchUserData from '../hooks/useFetchUserData';

const EditProfile = () => {

  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  
  const [userData, error] = useFetchUserData('http://127.0.0.1:8000/get-account-data/');

  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');

  const [initialUsername, setInitialUsername] = useState('');
  const [initialEmail, setInitialEmail] = useState('');
  const [initialFirstName, setInitialFirstName] = useState('');
  const [initialLastName, setInitialLastName] = useState('');

  // Watch for changes in userData and update state accordingly
  useEffect(() => {
    if (userData) {
      setUsername(userData.username || '');
      setEmail(userData.email || '');
      setFirstName(userData.first_name || '');
      setLastName(userData.last_name || '');

      setInitialUsername(userData.username || '');
      setInitialEmail(userData.email || '');
      setInitialFirstName(userData.first_name || '');
      setInitialLastName(userData.last_name || '');
    }
  }, [userData]);

  useEffect(() => {
    if (
      (first_name.trim() !== initialFirstName || last_name.trim() !== initialLastName || username.trim() !== initialUsername || email.trim() !== initialEmail) &&
      first_name.trim() !== '' &&
      last_name.trim() !== '' &&
      username.trim() !== '' &&
      email.trim() !== ''
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [first_name, last_name, username, email, initialFirstName, initialLastName, initialUsername, initialEmail]);
  

  const update_data = async () => {

    try {

        setIsLoading(true);

        const token = localStorage.getItem('access_token');

        const dataToSend = {};

        if (first_name && first_name.trim() !== "") {
            dataToSend.first_name = first_name;
        }
        if (last_name && last_name.trim() !== "") {
            dataToSend.last_name = last_name;
        }
        if (username && username.trim() !== "") {
            dataToSend.username = username;
        }
        if (email && email.trim() !== "") {
            dataToSend.email = email;
        }

        // Make POST request to update user details
        const response = await axios.post('http://127.0.0.1:8000/edit_profile/', 

            dataToSend, 
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (response.status === 200) {

            setIsLoading(false);
            const userData = response.data;

            setUsername(userData.username);
            setFirstName(userData.first_name);
            setLastName(userData.last_name);

            // Update localStorage with the new data
            localStorage.setItem('user_data', JSON.stringify(userData));

            setMessage('User details updated successfully!');
        }

    } catch (error) {

        setIsLoading(false);
        console.error("There was an error updating user details:", error);
        setMessage('Something went wrong :/');

    };
  }

  const redirect = () => {

    console.log("Redirect called");  // Debugging line
    navigate('/home');

  }
  
  return (
    <div>
      <div id="container">

        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}

        <label>{message}</label>
        
        <h1>Edit Profile</h1>

        <div id='input-div'>

          <label id='input-label'>First Name</label>
          <input
                  id='input-field'
                  type = "text"
                  value = {first_name}
                  placeholder={first_name}
                  onChange={e => setFirstName(e.target.value)}

                />

        </div>

        <div id='input-div'>

          <label id='input-label'>Last Name</label>
          <input
                  
                  id='input-field'
                  type = "text"
                  value = {last_name}
                  placeholder={last_name}
                  onChange={e => setLastName(e.target.value)}

                />

        </div>

        <div id='input-div'>

          <label id='input-label'>Username</label>
          <input

                  id='input-field'
                  type = "text"
                  value = {username}
                  placeholder={username}
                  onChange={e => setUsername(e.target.value)}

                />

        </div>

        <div id='input-div'>

          <label id='input-label'>E-Mail</label>
          <input

                  id='input-field'
                  type = "text"
                  value = {email}
                  placeholder={email}
                  onChange={e => setEmail(e.target.value)}

                />

        </div>

        <button onClick={redirect}>Back</button>
        
        <button disabled={isDisabled} onClick={update_data}>Update</button>

        <ToggleButton/>

        <CheckAuthButton/>

      </div>
    </div>
  )
}

export default EditProfile
