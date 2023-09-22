import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DeleteAccount = () => {

    const [password, setPassword] = useState('');
    const [confirmPassword, setComfirmPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const redirect_home = () => {
        console.log("Redirect called");  // Debugging line
        navigate('/home');
    }

    const redirect_login = () => {
        console.log("Redirect called");  // Debugging line
        navigate('/');
    }

    const delete_account = async () => {

        const token = localStorage.getItem('access_token');

        if(checkPasswords()) {

            axios.post('http://127.0.0.1:8000/delete-account/', 
            {
                password
            }, 
                
            { 
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then((response) => {

                console.log("This is the response: ", response);
                
                if(response.status === 200) {

                    console.log("account deleted")
                    redirect_login();
                }
            })
            .catch((error) => {

                console.log("This is the error: ", error);
            })

        }
    }

    const checkPasswords = () => {

        if(password === confirmPassword) {
            return true;
        } else {
            setError("Passwords do not match!");
            return false;
        }
    }

  return (
    <div>

        
      
        <div id='container'>

            <label id='error'>{error}</label>

            <h3>Please confirm your password to delete your account</h3>

            <div id='input-div'>

          <label id='input-label'>Password</label>
          <input

                  id='input-field'
                  type = "password"
                  onChange={e => setPassword(e.target.value)}

                />

        </div>

        <div id='input-div'>

          <label id='input-label'>Confirm Password</label>
          <input
                    
                  id='input-field'
                  type = "password"
                  onChange={e => setComfirmPassword(e.target.value)}

                />

        </div>
        
        <button onClick={delete_account}>Delete Account</button>
        <button onClick={redirect_home}>Back</button>

        </div>

    </div>
  )
}

export default DeleteAccount
