import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import emailjs from 'emailjs-com';
import './BoothReg.css';

const BoothDisp = () => {
  const [boothData, setBoothData] = useState(null);
  const [loginError, setLoginError] = useState(false);
  const { boothNumber } = useParams();
  const [presentToken, setPresentToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://event-server2.onrender.com/getBoothData/${boothNumber}`);
        console.log('Response:', response);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid content type. Expected JSON.');
        }

        const data = await response.json();
        setBoothData(data);
      } catch (error) {
        console.error('Error fetching booth data:', error.message);
      }
    };

    fetchData();
  }, [boothNumber]);

  const verifyToken = async () => {
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
        localStorage.setItem('token', '');
        window.location.href = './admin';
        setLoginError(true);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoginError(true);
    }
  };

  const handleSubmit = async () => {
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    const userPhoneNumber = localStorage.getItem('userPhoneNumber');

    try {
      const templateParams = {
        to_name: boothData.boothName,
        to_email: boothData.email,
        to_phone_number: boothData.phoneNumber,
        name: userName,
        email: userEmail,
        phone_number: userPhoneNumber,
      };

      const result = await emailjs.send(
        'service_bnz3qy9',
        'template_jggssck',
        templateParams,
        'Acnzw1AS8KGhKspGo'
      );

      console.log(result);

      if (result.text === 'OK') {
        alert('Email sent successfully!');
      } else {
        alert('Failed to send email.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again.');
    }

    try {
      if (!userEmail) {
        console.error('User email not found in localStorage.');
        alert('Failed to send email. User email not found.');
        return;
      }
      const templateParams = {
        name: userName,
        email: userEmail,
        phoneNumber: userPhoneNumber,
        to_email: boothData.email,
        to_name: boothData.boothName,
        to_phone_number: boothData.phoneNumber,
      };

      const result = await emailjs.send(
        'service_bnz3qy9',
        'template_mophnb9',
        templateParams,
        'Acnzw1AS8KGhKspGo'
      );

      console.log(result);

      if (result.text === 'OK') {
        alert('Email sent successfully!');
      } else {
        alert('Failed to send email.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again.');
    }
  };

  useEffect(() => {
    if (!presentToken && presentToken.length < 10) {
      window.location.href = '/login';
    }

    verifyToken();
  }, []);

  return (
    <div className="ph_no">
      {boothData ? (
        <div>
          <h1>Booth Details</h1>
          <table>
            <tbody>
              <tr>
                <td>Name:</td>
                <td>{boothData.boothName}</td>
              </tr>
              <tr>
                <td>Phone Number:</td>
                <td>{boothData.phoneNumber}</td>
              </tr>
              <tr>
                <td>Email:</td>
                <td>{boothData.email}</td>
              </tr>
              <tr>
                <td>Booth Number:</td>
                <td>{boothData.boothNumber}</td>
              </tr>
            </tbody>
          </table>
          <br />
          <button className="btn-btn primary" onClick={handleSubmit}>
            Connect
          </button>
        </div>
      ) : (
        <p style={{padding: '120px'}}>Booth Not Registered Yet...</p>
      )}
    </div>
  );
};

export default BoothDisp;
