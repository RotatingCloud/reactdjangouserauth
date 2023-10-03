import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import ToggleButton from '../components/ToggleButton';


const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

  
    const login = async () => {

      try {

        axios.post('http://127.0.0.1:8000/login/', {

          username,
          password,

        })
        .then(response => {

            const { access, refresh, user } = response.data;
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('user_data', JSON.stringify(user));  // Store user data in local storage
            navigate('/home');

        })

        .catch((error) => {

          console.error("There was an error!", error);

          if(error.response.status === 401){

            setError("Invalid credentials");

          }

        });

      } catch (error) {

        setError("Login failed");
        console.log("login error", error);
        
      }
    }

    const forgot_password = () => { navigate('/request-change-password') }
  
    const go_to_register = () => { navigate('./register') }

    return (

        <div id = "container">
            {error && <label id='error'>{error}</label>}
            <div id='input-div'>

                <label id='input-label'>Username</label>
                <input

                  id='input-field'
                  type = "text"
                  placeholder="Username"
                  onChange={e => setUsername(e.target.value)}

                />

            </div>

            <div id='input-div'>
            
              <label id='input-label'>Password</label>
              <input

                id='input-field'
                type = "password"
                placeholder="Password"
                onChange={e => setPassword(e.target.value)}

              />

            </div>

            <button onClick={login}>Login</button>
            <button onClick={go_to_register}>Register</button>
            <button onClick={forgot_password}>Forgot Password</button>
            <ToggleButton/>

        </div>
    )
}

export default Login;