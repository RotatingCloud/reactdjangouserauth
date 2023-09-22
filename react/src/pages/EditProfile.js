import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

import ToggleButton from '../components/ToggleButton';
import CheckAuthButton from '../components/CheckAuthButton';

const EditProfile = () => {

  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [message, setMessage] = useState('');
  const [is_activated, setIsActivated] = useState('Not Verified');
  
  const redirect = () => {

    console.log("Redirect called");  // Debugging line
    navigate('/home');

  }

  useEffect(() => {
    
    try {

      // Assuming you need to send the access token to validate the request
      const token = localStorage.getItem('access_token');

      // Make GET request to fetch user details
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
          setEmail(response.data.email);
          setFirstName(response.data.first_name);
          setLastName(response.data.last_name);
          setIsActivated(response.data.is_activated ? 'Verified' : 'Not Verified');

        }
      })
    } catch (error) {

      console.error("There was an error fetching user details:", error);

    };

  }, []); 

  const update_data = async () => {

    try {

      // Assuming you need to send the access token to validate the request
      const token = localStorage.getItem('access_token');

      // Make POST request to update user details
      const response = await axios.post('http://127.0.0.1:8000/edit_profile/', 
      
        {
          first_name,
          last_name,
          username,
          email,
        }, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {

        const userData = response.data;

        setUsername(userData.username);
        setFirstName(userData.first_name);
        setLastName(userData.last_name);
        setIsActivated(userData.is_activated ? 'Verified' : 'Not Verified');

        // Update localStorage with the new data
        localStorage.setItem('user_data', JSON.stringify(userData));

        setMessage('User details updated successfully!');
        
      }

    } catch (error) {

      console.error("There was an error updating user details:", error);
      setMessage('Something went wrong :/');

    };

  }
  

  return (
    <div>
      <div id="container">

        <label>{message}</label>
        
        <h1>Edit Profile</h1>

        <div id='input-div'>

          <label id='input-label'>First Name</label>
          <input
                  id='input-field'
                  type = "text"
                  placeholder={first_name}
                  onChange={e => setFirstName(e.target.value)}

                />

        </div>

        <div id='input-div'>

          <label id='input-label'>Last Name</label>
          <input
                  
                  id='input-field'
                  type = "text"
                  placeholder={last_name}
                  onChange={e => setLastName(e.target.value)}

                />

        </div>

        <div id='input-div'>

          <label id='input-label'>Username</label>
          <input

                  id='input-field'
                  type = "text"
                  placeholder={username}
                  onChange={e => setUsername(e.target.value)}

                />

        </div>

        <div id='input-div'>

          <label id='input-label'>E-Mail</label>
          <input

                  id='input-field'
                  type = "text"
                  placeholder={email}
                  onChange={e => setEmail(e.target.value)}

                />

        </div>

        <button onClick={redirect}>Back</button>
        
        <button onClick={update_data}>Update</button>

        <ToggleButton/>

        <CheckAuthButton/>

      </div>
    </div>
  )
}

export default EditProfile
