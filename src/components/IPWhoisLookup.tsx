import React, { useState } from 'react';
import { Search, Globe, MapPin, Building, Server, Copy, Check, Clock } from 'lucide-react';

interface WhoisData {
  ip: string;
  country: string;
  country_code: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isp: string;
  org: string;
  asn: string;
  postal: string;
  hostname?: string;
}

const IPWhoisLookup: React.FC = () => {
  const [ipAddress, setIpAddress] = useState('');
  const [whoisData, setWhoisData] = useState<WhoisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  const validateIP = (ip: string): boolean => {
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
  };

  const performWhoisLookup = async () => {
    if (!ipAddress.trim()) {
      setError('Please enter an IP address');
      return;
    }

    if (!validateIP(ipAddress)) {
      setError('Please enter a valid IP address');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`https://ipapi.co/${ipAddress}/json/`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch WHOIS data');
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.reason || 'Invalid IP address');
      }
      
      setWhoisData({
        ip: data.ip,
        country: data.country_name,
        country_code: data.country_code,
        city: data.city,
        region: data.region,
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
        isp: data.org,
        org: data.org,
        asn: data.asn,
        postal: data.postal,
        hostname: data.hostname
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setWhoisData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performWhoisLookup();
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            IP WHOIS Lookup
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get detailed WHOIS information for any IP address including location, ISP, organization, and network details
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter IP address (e.g., 8.8.8.8)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-lg"
                />
              </div>
              <button
                onClick={performWhoisLookup}
                disabled={loading}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
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
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {whoisData && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">WHOIS Information for {whoisData.ip}</h2>
              </div>

              <div className="p-6">
                {/* IP Address Highlight */}
                <div className="mb-8">
                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <Globe className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">IP Address</p>
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(whoisData.ip, 'ip')}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors duration-200"
                      >
                        {copied === 'ip' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 font-mono break-all">{whoisData.ip}</p>
                  </div>
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Geographic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-green-600" />
                      Geographic Information
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-500">Country</p>
                          <p className="font-medium">{whoisData.country} ({whoisData.country_code})</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(whoisData.country, 'country')}
                          className="text-gray-400 hover:text-green-600"
                        >
                          {copied === 'country' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-500">City</p>
                          <p className="font-medium">{whoisData.city || 'Not available'}</p>
                        </div>
                        {whoisData.city && (
                          <button
                            onClick={() => copyToClipboard(whoisData.city, 'city')}
                            className="text-gray-400 hover:text-green-600"
                          >
                            {copied === 'city' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        )}
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-500">Region</p>
                          <p className="font-medium">{whoisData.region || 'Not available'}</p>
                        </div>
                        {whoisData.region && (
                          <button
                            onClick={() => copyToClipboard(whoisData.region, 'region')}
                            className="text-gray-400 hover:text-green-600"
                          >
                            {copied === 'region' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        )}
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-500">Coordinates</p>
                          <p className="font-medium">{whoisData.latitude}, {whoisData.longitude}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(`${whoisData.latitude}, ${whoisData.longitude}`, 'coords')}
                          className="text-gray-400 hover:text-green-600"
                        >
                          {copied === 'coords' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Network Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Building className="w-5 h-5 text-emerald-600" />
                      Network Information
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-500">ISP / Organization</p>
                          <p className="font-medium">{whoisData.isp || 'Not available'}</p>
                        </div>
                        {whoisData.isp && (
                          <button
                            onClick={() => copyToClipboard(whoisData.isp, 'isp')}
                            className="text-gray-400 hover:text-emerald-600"
                          >
                            {copied === 'isp' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        )}
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-500">ASN</p>
                          <p className="font-medium">{whoisData.asn || 'Not available'}</p>
                        </div>
                        {whoisData.asn && (
                          <button
                            onClick={() => copyToClipboard(whoisData.asn, 'asn')}
                            className="text-gray-400 hover:text-emerald-600"
                          >
                            {copied === 'asn' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        )}
                      </div>

                      {whoisData.hostname && (
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <p className="text-sm text-gray-500">Hostname</p>
                            <p className="font-medium break-all">{whoisData.hostname}</p>
                          </div>
                          <button
                            onClick={() => copyToClipboard(whoisData.hostname!, 'hostname')}
                            className="text-gray-400 hover:text-emerald-600"
                          >
                            {copied === 'hostname' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      )}

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-500">Timezone</p>
                            <p className="font-medium">{whoisData.timezone || 'Not available'}</p>
                          </div>
                        </div>
                        {whoisData.timezone && (
                          <button
                            onClick={() => copyToClipboard(whoisData.timezone, 'timezone')}
                            className="text-gray-400 hover:text-blue-600"
                          >
                            {copied === 'timezone' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        )}
                      </div>

                      {whoisData.postal && (
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <p className="text-sm text-gray-500">Postal Code</p>
                            <p className="font-medium">{whoisData.postal}</p>
                          </div>
                          <button
                            onClick={() => copyToClipboard(whoisData.postal, 'postal')}
                            className="text-gray-400 hover:text-emerald-600"
                          >
                            {copied === 'postal' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Information Cards */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Accurate Data</h3>
              </div>
              <p className="text-gray-600 text-sm">Get reliable WHOIS information from authoritative sources with real-time lookup.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Global Coverage</h3>
              </div>
              <p className="text-gray-600 text-sm">Comprehensive database covering IP addresses from all regions worldwide.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Server className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Network Details</h3>
              </div>
              <p className="text-gray-600 text-sm">Detailed network information including ISP, ASN, and organizational data.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPWhoisLookup;