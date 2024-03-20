import React, { useEffect, useState } from 'react';
import emailjs from 'emailjs-com';

function Dashboard1() {
  const [connections, setConnections] = useState(null);

  useEffect(() => {
    // Fetch data from API
    fetch('https://event-server2.onrender.com/userConnections') // Update endpoint
      .then(response => response.json())
      .then(data => setConnections(data))
      .catch(error => console.error(error));
  }, []);

  const sendmails = async () => {
    try {
      for (const userEmail in connections) {
        const userData = connections[userEmail];
        let message = '';
        userData.forEach(async user => {
          message = `${message} \n name: ${user.reciverName}  email: ${user.reciverEmail} phone: ${user.reciverPhoneNumber}`;
        });

        const templateParams = {
          message: message,
          sendto: userEmail
          // Add more template parameters as needed
        };

        const result = await emailjs.send(
          'service_fr3nxol', // Update service for user emails
          'template_0qzpmmx', // Update template for user emails
          templateParams,
          'OhPDafu9J26PK0AbS' // Update template key for user emails
        );

        console.log(result);

        // Handle success or failure
        if (result.text === 'OK') {
          alert('Email sent successfully!');
        } else {
          alert('Failed to send email.');
        }
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again.');
    }
  };

  return (
    <div style={{ backgroundColor: 'white', margin: '20px' }}>
      <h1>
        Dashboard <button onClick={sendmails}>Send mails</button>
      </h1>
      {connections ? (
        Object.keys(connections).map(userEmail => (
          <div key={userEmail}>
            <h2>{userEmail}</h2>
            <ul>
              {connections[userEmail].map(connection => (
                <li key={connection._id}>
                  <p>
                    <strong>Reciever Name:</strong> {connection.reciverName}
                  </p>
                  <p>
                    <strong>Reciever Email:</strong> {connection.reciverEmail}
                  </p>
                  <p>
                    <strong>Reciever Phone Number:</strong>{' '}
                    {connection.reciverPhoneNumber}
                  </p>
                  <p>
                    <strong>Connection Time:</strong>{' '}
                    {new Date(connection.connectionTime).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Dashboard1;
