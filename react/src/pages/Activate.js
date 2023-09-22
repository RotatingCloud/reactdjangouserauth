import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Activate = () => {

  const { uidb64, token } = useParams();
  const[message, setMessage] = useState("");

    useEffect(() => {

      console.log("uidb64: ", uidb64);

      axios.post(`http://127.0.0.1:8000/activate/${uidb64}/${token}/`)

        .then((response) => {
            console.log("This is the response: ", response);
            if (response.status === 200) {
                setMessage("Account activated");
            }
        })
        .catch((error) => {
            console.error("There was an error!", error);
            if(error.response.status === 401){
                setMessage("Invalid credentials");
            }
        });

    }, [uidb64, token]);


  return (
    <div>
      <div id='container'>
        <label>{message}</label>
      </div>
    </div>
  )
}

export default Activate
