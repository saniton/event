import React, { useState } from 'react';
import '../login.css';


const Login = () => {
  const [name, setName] = useState('');
  const [qrNumber, setQRNumber] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [presentToken, setPresentToken] = useState(localStorage.getItem('token') || '');

  const handleLogin = async () => {
    try {
      const response = await fetch('https://event-server2.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, qrNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful
        localStorage.setItem('token', data.token); // Store the token in local storage
        localStorage.setItem('userName', data.user.name); // Store the user's email
        localStorage.setItem('userEmail', data.user.email); // Store the user's email
        localStorage.setItem('userPhoneNumber', data.user.phoneNumber); // Store the user's email
        localStorage.setItem('userQR', qrNumber);


        window.location.href = `./getData/${qrNumber}`;
        console.log(data.message);
        setLoginError(false);
      } else {
        // Login failed
        console.log(data.message);
        setLoginError(true);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoginError(true);
    }
  };

  
    return (
      <div className="ph_no">
      <h2>Login</h2>
        <form>
        <div className='padding'>
          <label>
            <center>Name:</center>
            </label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className='padding'>
          <label>
          <center>QR Number:</center>
            </label>

            <input type="text" value={qrNumber} onChange={(e) => setQRNumber(e.target.value)} />
          </div>
          
          <button type="button" onClick={handleLogin}>
            Login
          </button>
        </form>
        <p>New Guest? <a href="/">Register</a></p>
        {loginError && <p style={{ color: 'red' }}>Login failed. Please check your credentials.</p>}
      </div>
    );
  };
  
  export default Login;
  
  
