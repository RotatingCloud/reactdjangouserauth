import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ToggleButton from '../components/ToggleButton'


const RequestChangePassword = () => {

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const change_password = async () => {


          axios.post('http://127.0.0.1:8000/change-password-request/', 
          {
              "email": email,
          })
          .then((response) => {

            if (response.status === 200) {

              console.log(response.data.access)
              redirect_login();

            }

          })
          .catch((error) => {
            if(error.status === 401) {
              setMessage("Incorrect password");
            }
          })
    }

    const redirect_home = () => {
        console.log("Redirect called");  // Debugging line
        navigate('/home');
    }

    const redirect_login = () => {

        console.log("Redirect called");  // Debugging line
        navigate('/');
    }

  return (
    <div>

        <div id="container">

          <label>{message}</label>

            <h3>Change password</h3>

            <div id='input-div'>

                <label id='input-label'>E-Mail</label>
                <input

                  type = "text"
                  placeholder='Enter your email'
                  onChange={e => setEmail(e.target.value)}

                />
            </div>

            <button onClick={change_password}>Submit</button>
            <button onClick={redirect_home}>Back</button>
            <ToggleButton/>
        </div>

    </div>
  )
}

export default RequestChangePassword
