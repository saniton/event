import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import emailjs from 'emailjs-com';
import './PhoneNumberLogin.css'

const Display3 = () => {
  const [userData, setUserData] = useState(null);
  const [loginError, setLoginError] = useState(false);
  const { qrNumber } = useParams();
  const [presentToken, setPresentToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://event-server2.onrender.com/getUserData/${qrNumber}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid content type. Expected JSON.');
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchData();
  }, [qrNumber]);

  const verifyToken = async () =>{
    try {
      const response = await fetch('https://event-server2.onrender.com/api/tokenVerify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ presentToken }),
      });

      const data = await response.json();

      if (response.ok) {
        return;
      } else {
        localStorage.setItem('token', '')
        window.location.href="./admin";
        setLoginError(true);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoginError(true);
    }
  }

  const handleSubmit = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      const userName = localStorage.getItem('userName');
      const userPhoneNumber = localStorage.getItem('userPhoneNumber');
      const userQR = localStorage.getItem('userQR');
      console.log('---',userData.email)
      
      const response = await fetch('http://localhost:3001/connections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reciverQR : userData.qrNumber,
          reciverEmail : userData.email,
          reciverName : userData.name,
          reciverPhoneNumber : userData.phoneNumber,
          userQR,
          userEmail,
          userName,
          userPhoneNumber
        }),
      });

      if (response.ok) {
        alert(`${response.ok} got response 200!`)
        // Connection successful
        // You can perform further actions here if needed
      } else {
        // Connection failed
        console.log(response);
      }
    } catch (error) {
      console.error('Error during connection:', error);
    }
  }

  useEffect(() => {
    if (!presentToken && presentToken.length < 10) {
      window.location.href = '/login';
    }
    
    verifyToken();

  }, []);

  return (
    <div className="ph_no">
      {userData ? (
        <div>
          <h1>User Details</h1>
          <table>
            <tbody>
              <tr>
                <td>Name:</td>
                <td>{userData.name}</td>
              </tr>
              <tr>
                <td>Phone Number:</td>
                <td>{userData.phoneNumber}</td>
              </tr>
              <tr>
                <td>Email:</td>
                <td>{userData.email}</td>
              </tr>
              <tr>
                <td>QR Number:</td>
                <td>{userData.qrNumber}</td>
              </tr>
            </tbody>
          </table>
          <br />
          <button className='btn-btn primary' onClick={handleSubmit}>Connect</button>
        </div>
      ) : (
        <p style={{padding: '120px'}}>Not Registered Yet...</p>
      )}
    </div>
  );
};

export default Display3;
