import React, { useState } from 'react';
import { Search, Wifi, Building, Info, Copy, Check } from 'lucide-react';

interface MACData {
  mac: string;
  company: string;
  address: string;
  country: string;
  type: string;
}

const MACAddressLookup: React.FC = () => {
  const [macAddress, setMacAddress] = useState('');
  const [macData, setMacData] = useState<MACData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  // Sample MAC database (in a real app, this would be from an API)
  const macDatabase: { [key: string]: MACData } = {
    '00:1B:63': {
      mac: '00:1B:63',
      company: 'Apple, Inc.',
      address: '1 Infinite Loop, Cupertino, CA 95014, US',
      country: 'United States',
      type: 'MA-L'
    },
    '00:50:56': {
      mac: '00:50:56',
      company: 'VMware, Inc.',
      address: '3401 Hillview Ave, Palo Alto, CA 94304, US',
      country: 'United States',
      type: 'MA-L'
    },
    '00:0C:29': {
      mac: '00:0C:29',
      company: 'VMware, Inc.',
      address: '3401 Hillview Ave, Palo Alto, CA 94304, US',
      country: 'United States',
      type: 'MA-L'
    },
    '00:1A:A0': {
      mac: '00:1A:A0',
      company: 'Dell Inc.',
      address: 'One Dell Way, Round Rock, TX 78682, US',
      country: 'United States',
      type: 'MA-L'
    },
    '00:15:5D': {
      mac: '00:15:5D',
      company: 'Microsoft Corporation',
      address: 'One Microsoft Way, Redmond, WA 98052, US',
      country: 'United States',
      type: 'MA-L'
    }
  };

  const validateMAC = (mac: string): boolean => {
    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$|^([0-9A-Fa-f]{2}[:-]){2}([0-9A-Fa-f]{2})$/;
    return macRegex.test(mac);
  };

  const formatMAC = (mac: string): string => {
    // Remove all separators and convert to uppercase
    const cleanMac = mac.replace(/[:-]/g, '').toUpperCase();
    // Add colons every 2 characters
    return cleanMac.match(/.{2}/g)?.join(':') || mac;
  };

  const getOUI = (mac: string): string => {
    const cleanMac = mac.replace(/[:-]/g, '').toUpperCase();
    return cleanMac.substring(0, 6).match(/.{2}/g)?.join(':') || '';
  };

  const lookupMAC = () => {
    if (!macAddress.trim()) {
      setError('Please enter a MAC address');
      return;
    }

    if (!validateMAC(macAddress)) {
      setError('Please enter a valid MAC address (e.g., 00:1B:63:84:45:E6 or 00-1B-63-84-45-E6)');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate API call delay
    setTimeout(() => {
      const oui = getOUI(macAddress);
      const vendorData = macDatabase[oui];

      if (vendorData) {
        setMacData({
          ...vendorData,
          mac: formatMAC(macAddress)
        });
      } else {
        setMacData({
          mac: formatMAC(macAddress),
          company: 'Unknown Vendor',
          address: 'Not available',
          country: 'Not available',
          type: 'Unknown'
        });
      }
      setLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      lookupMAC();
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const generateRandomMAC = () => {
    const ouis = Object.keys(macDatabase);
    const randomOUI = ouis[Math.floor(Math.random() * ouis.length)];
    const randomSuffix = Array.from({ length: 3 }, () => 
      Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()
    ).join(':');
    setMacAddress(`${randomOUI}:${randomSuffix}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
            <Wifi className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            MAC Address Lookup
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the manufacturer and vendor information for any MAC address using our comprehensive OUI database
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={macAddress}
                  onChange={(e) => setMacAddress(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter MAC address (e.g., 00:1B:63:84:45:E6)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-lg font-mono"
                />
              </div>
              <button
                onClick={lookupMAC}
                disabled={loading}
                className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Lookup
                  </>
                )}
              </button>
            </div>

            <div className="flex justify-center">
              <button
                onClick={generateRandomMAC}
                className="text-sm text-purple-600 hover:text-purple-700 underline"
              >
                Try a random MAC address
              </button>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {macData && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">MAC Address Information</h2>
              </div>

              <div className="p-6">
                {/* MAC Address */}
                <div className="mb-8">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Wifi className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">MAC Address</p>
                      </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(macData.mac, 'mac')}
                        className="p-2 text-gray-400 hover:text-purple-600 transition-colors duration-200"
                      >
                        {copied === 'mac' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xl font-semibold text-gray-900 font-mono break-all">{macData.mac}</p>
                  </div>
                </div>

                {/* Vendor Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Building className="w-5 h-5 text-purple-600" />
                      Vendor Information
                    </h3>
                    
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Building className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Company</p>
                          <p className="font-medium">{macData.company}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(macData.company, 'company')}
                        className="text-gray-400 hover:text-blue-600"
                      >
                        {copied === 'company' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Info className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-500">Assignment Type</p>
                          <p className="font-medium">{macData.type}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(macData.type, 'type')}
                        className="text-gray-400 hover:text-green-600"
                      >
                        {copied === 'type' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Wifi className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-500">OUI (First 3 octets)</p>
                          <p className="font-medium font-mono">{getOUI(macData.mac)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(getOUI(macData.mac), 'oui')}
                        className="text-gray-400 hover:text-purple-600"
                      >
                        {copied === 'oui' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Info className="w-5 h-5 text-blue-600" />
                      Contact Information
                    </h3>
                    
                    <div className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Building className="w-5 h-5 text-indigo-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="font-medium">{macData.address}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(macData.address, 'address')}
                          className="text-gray-400 hover:text-indigo-600 mt-1"
                        >
                          {copied === 'address' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Info className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="text-sm text-gray-500">Country</p>
                          <p className="font-medium">{macData.country}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(macData.country, 'country')}
                        className="text-gray-400 hover:text-orange-600"
                      >
                        {copied === 'country' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="mt-8 p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">About MAC Address Lookup</h4>
                  <p className="text-sm text-gray-600">
                    MAC (Media Access Control) address lookup helps identify the manufacturer of network devices. 
                    The first three octets (OUI - Organizationally Unique Identifier) are assigned by IEEE to manufacturers, 
                    while the last three octets are assigned by the manufacturer to individual devices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Information Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">What is MAC Address Lookup?</h3>
            <div className="prose text-gray-600">
              <p className="mb-4">
                MAC Address Lookup is a tool that identifies the manufacturer or vendor of a network device based on its MAC address. 
                Every network interface has a unique MAC address assigned by the manufacturer.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Common Use Cases:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Network troubleshooting and device identification</li>
                    <li>Security analysis and unauthorized device detection</li>
                    <li>Asset management and inventory tracking</li>
                    <li>Forensic investigations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">MAC Address Format:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>48-bit identifier (6 bytes)</li>
                    <li>Usually displayed as 6 groups of 2 hexadecimal digits</li>
                    <li>Separated by colons (:) or hyphens (-)</li>
                    <li>First 3 bytes identify the manufacturer (OUI)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MACAddressLookup;