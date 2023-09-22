import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import ToggleButton from '../components/ToggleButton';
import { useParams } from 'react-router-dom';

const ChangePassword = () => {

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { uidb64, token } = useParams();
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const redirect_login = () => {
        console.log("Redirect called");  // Debugging line
        navigate('/home');
    }

    const change_password = async () => {


        if(check_password()) {

            axios.post(`http://127.0.0.1:8000/change-password/${uidb64}/${token}/`, 
            {

                "new_password": newPassword,

            })
            .then((response) => {
                    
                if (response.status === 200) {

                    console.log(response.data.access)

                }
        
            })
            .catch((error) => {

                if(error.status === 401) {

                    setMessage("error", error.response.data.message);
                }
            })

        } else {

            setMessage("Passwords do not match");
        }
    }

    const check_password = () => {
         if(newPassword !== confirmPassword) {
            return false;
        }else {
            return true;
        }
    }

  return (
    <div>
      <div id="container">

        <label>{message}</label>

        <h2>Change password</h2>

        <div id='input-div'>
            
            <label id='input-label'>New Password</label>
            <input

                id='input-field'
                type = "password"
                placeholder="New Password"
                onChange={e => setNewPassword(e.target.value)}

            />

                
        </div>

        
        <div id='input-div'>

            <label id='input-label'>Confirm New Password</label>
            <input

                id='input-field'    
                type = "password"
                placeholder="New Password"
                onChange={e => setConfirmPassword(e.target.value)}

            />

            </div>

        <button onClick={change_password}>Submit</button>
        <button onClick={redirect_login}>Cancel</button>
        <ToggleButton></ToggleButton>

      </div>

    </div>
  )
}

export default ChangePassword
