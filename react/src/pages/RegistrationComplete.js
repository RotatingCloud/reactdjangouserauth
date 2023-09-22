import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RegistrationComplete = () => {

  const navigate = useNavigate();

  useEffect(() => {
    
    const registrationStatus = localStorage.getItem('reg_token');

    // Check if user has a token and has completed registration
    if (registrationStatus === null) {

      navigate('/');  // Redirect to login page

    }
    
  }, [navigate]);

  const back = () => {

    localStorage.removeItem('reg_token');  // Remove token
    
    navigate('/');  // Redirect to login page

  };

  return (
    <div>
      <div id='container'>
        <label>Registration Success! Check your email for a link to verify your profile!</label>
        <button onClick={back}>Go Back</button>  {/* Fixed this line */}
      </div>
    </div>
  );
};

export default RegistrationComplete;
