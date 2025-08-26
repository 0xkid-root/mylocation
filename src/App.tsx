import React, { useState } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import MyLocation from './components/MyLocation';
import IPWhoisLookup from './components/IPWhoisLookup';
import MACAddressLookup from './components/MACAddressLookup';
import InternetSpeedTest from './components/InternetSpeedTest';
import DNSLookup from './components/DNSLookup';
import PortScanner from './components/PortScanner';
import PingTest from './components/PingTest';
import Footer from './components/Footer';

function App() {
  const [currentTool, setCurrentTool] = useState('home');

  const renderCurrentTool = () => {
    switch (currentTool) {
      case 'home':
        return <Home onToolSelect={setCurrentTool} />;
      case 'my-location':
        return <MyLocation />;
      case 'ip-whois':
        return <IPWhoisLookup />;
      case 'mac-lookup':
        return <MACAddressLookup />;
      case 'speed-test':
        return <InternetSpeedTest />;
      case 'dns-lookup':
        return <DNSLookup />;
      case 'port-scanner':
        return <PortScanner />;
      case 'ping-test':
        return <PingTest />;
      default:
        return <Home onToolSelect={setCurrentTool} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header onToolSelect={setCurrentTool} currentTool={currentTool} />
      <main>
        {renderCurrentTool()}
      </main>
      <Footer />
    </div>
  );
}

export default App;