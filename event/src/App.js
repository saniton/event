import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PhoneNumberLogin from './Components/PhoneNumberLogin';
import Login from './Components/Login';
// import DisplayPage from './Components/DisplayPage';
import ScanQR from './Components/ScanQR';
import DisplayPage1 from './Components/Display1';
import BoothReg from './CBooth/BoothReg';
import ScanBoothQR from './CBooth/ScanBoothQR';
import BoothDisp from './CBooth/BoothDisp';
import Header from './UpQRade_Components/Header';
import Footer from './UpQRade_Components/Footer';
import DisplayPage from './Components/Display3';
import Dashboard from './Components/Dashboard';

function App() {
  return (
    <div className="App">
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={<PhoneNumberLogin />} />
          <Route path="/scanQR" element={<ScanQR/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/getData/:qrNumber" element={<DisplayPage1/>} />
          <Route path="/getUserData/:qrNumber" element={<DisplayPage />} />

          <Route path="/boothReg" element={<BoothReg />} />
          <Route path="/scanBoothQR" element={<ScanBoothQR/>}/>
          <Route path="/getBoothData/:boothNumber" element={<BoothDisp />} />
          <Route path="/dashboard" element={<Dashboard />} />

        </Routes>
      </Router>
      <Footer />

    </div>
  );
}

export default App;







