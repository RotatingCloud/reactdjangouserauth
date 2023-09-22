import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ToggleButton from '../components/ToggleButton';
import './Register.css';
import { useEffect } from 'react';

const Register = () => {

  const [username, setUsername] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [usernameValid, setUsernameValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(true);
  const navigate = useNavigate();

  const signup = async () => {

      if (!checkUsername()) {
        if (username.length < 3) {
          setErrorMessage('Username is too short! 3 char minimum');
        } else {
          setErrorMessage('Username is too long! 25 char maximum');
        }

      } else if(!checkUsername() && (username.length > 25)) {

        setErrorMessage('Username is too short! 3 char minimum')
      
      } else if(!checkEmail()) {

        setErrorMessage('Please enter a valid email')
      
      } else if(!checkPassword()) {

        setErrorMessage('Password must include number and must be a reasonable length')
      
      } else if(!checkConfirmPassword()) {

        setErrorMessage( 'Passwords do not match!')
      
      } else {

        try {

          const response = await axios.post('http://127.0.0.1:8000/register/', {
            username,
            email,
            password,
            first_name,
            last_name,
          });

          if (response.status === 201) {
            console.log('User registered in:', response.data);
            localStorage.setItem("reg_token", response.data.reg_token);
            console.log("reg_token:", response.data.reg_token);
            redirect()
          }

        } catch (error) {

          if (error.response && error.response.data) {
            const serverError = error.response.data.error;
        
            if (serverError === 'Username is already taken') {
              setErrorMessage('Username is already taken');
            } else if (serverError === 'Email is already taken') {
              setErrorMessage('Email is already taken');
            } else {
              setErrorMessage('Something went wrong :/');
            }
          }
        }

      } 
  };
      
  const redirect = () => {
        navigate('/registration-complete');
  }

  function checkUsername() {
    if(username.length > 25 || username.length < 3) {
      setUsernameValid(false);
      return false;
    }
    setUsernameValid(true);  // Reset to true when valid
    return true;
  }
  
  function checkPassword() {
    const hasNumber = /\d/;
    if(password.length < 8 || password.length > 25 || !hasNumber.test(password)) {
      setPasswordValid(false);
      return false;
    }
    setPasswordValid(true);  // Reset to true when valid
    return true;
  }
  
  function checkConfirmPassword() {

    if(!(password === confirmPassword)) {

      setConfirmPasswordValid(false);
      return false;

    }
    setConfirmPasswordValid(true);  // Reset to true when valid
    return true;
  }
  
  function checkEmail() {
    if(!(email.includes("@") && email.includes("."))) {
      setEmailValid(false);
      return false;
    }
    setEmailValid(true);  // Reset to true when valid
    return true;
  }

  useEffect(() => {
    const checkConfirmPassword = () => {
      if (!(password === confirmPassword)) {
        setConfirmPasswordValid(false);
        return false;
      }
      setConfirmPasswordValid(true);  // Reset to true when valid
      return true;
    };
  
    checkConfirmPassword();
  }, [password, confirmPassword]);

  return (
    <div id = 'container'>

        {errorMessage && <label id='error'>{errorMessage}</label>}

            <div id='input-div'>

                <label id='input-label'>Username</label>
                <input id='input-field'

                  className={usernameValid ? '': 'red-input'}
                  type = "text"
                  placeholder="Username"
                  onChange={e => { setUsername(e.target.value); checkUsername(); }}

                />

            </div>

            <div id='input-div'>

                <label id='input-label'>First Name</label>
                <input id='input-field'

                  type = "text"
                  placeholder="First Name"
                  onChange={e => { setFirstName(e.target.value);}}

                />

            </div>

            <div id='input-div'>

                <label id='input-label'>Last Name</label>
                <input id='input-field'

                  type = "text"
                  placeholder="Last Name"
                  onChange={e => { setLastName(e.target.value);}}

                />

            </div>

            <div id='input-div'>

                <label id='input-label'>E-Mail</label>
                <input id='input-field'

                  className={emailValid ? '': 'red-input'}
                  type = "text"
                  placeholder="E-Mail"
                  onChange={e => {setEmail(e.target.value); checkEmail(); }}

                />

            </div>

            <div id='input-div'>
            
              <label id='input-label'>Password</label>
              <input id='input-field'

                className={passwordValid ? '': 'red-input'}
                type = "password"
                placeholder="Password"
                onChange={e => {setPassword(e.target.value); checkPassword();}}

              />

            </div>

            <div id='input-div'>
            
              <label id='input-label'>Confirm Password</label>
              <input id='input-field'

                className={confirmPasswordValid ? '': 'red-input'}
                type = "password"
                placeholder="Confirm Password"
                onChange={e => {setConfirmPassword(e.target.value);}}

              />

            </div>

        <button onClick={signup}>SIGN-UP</button>
        <button onClick={redirect}>CANCEL</button>
        <ToggleButton/>
        
    </div>
  )
}

export default Register
