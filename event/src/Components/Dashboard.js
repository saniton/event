import React, { useEffect, useState } from 'react';
import emailjs from 'emailjs-com';

function Dashboard() {
  const [connections, setConnections] = useState(null);

  useEffect(() => {
    // Fetch data from API
    fetch('http://localhost:3001/connections')
      .then(response => response.json())
      .then(data => setConnections(data))
      .catch(error => console.error(error));
  }, []);

  const sendmails = async () => {
    try {

        for (const email in connections) {

            const connectionData = connections[email];
            let message = '';
            connectionData.forEach(async connection => {
                message = `${message} \n name: ${connection.userName}  email: ${connection.userEmail} phone: ${connection.userPhoneNumber}`
                  
            });

            const templateParams = {
                message: message,
                sendto: email
                // Add more template parameters as needed
              };
        
              const result = await emailjs.send(
                'service_fr3nxol',
                'template_o0e90m8',
                templateParams,
                'OhPDafu9J26PK0AbS'
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
  }

  return (
    <div style={{ backgroundColor : 'white', margin: '20px'}}>
      <h1>Dashboard <button onClick={sendmails}>Send mails</button></h1>
      {connections ? (
        Object.keys(connections).map(email => (
          <div key={email}>
            <h2>{email}</h2>
            <ul>
              {connections[email].map(connection => (
                <li key={connection._id}>
                  <p><strong>User Name:</strong> {connection.userName}</p>
                  <p><strong>User Email:</strong> {connection.userEmail}</p>
                  <p><strong>User Phone Number:</strong> {connection.userPhoneNumber}</p>
                  <p><strong>Connection Time:</strong> {new Date(connection.connectionTime).toLocaleString()}</p>
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

export default Dashboard;
