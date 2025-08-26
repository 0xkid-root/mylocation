import React, { useState, useEffect } from 'react';
import { MapPin, Globe, Wifi, Clock, Copy, Check, RefreshCw } from 'lucide-react';

interface LocationData {
  ipv4?: string;
  ipv6?: string;
  country: string;
  country_code: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isp: string;
  org: string;
  postal: string;
  asn: string;
}

const MyLocation: React.FC = () => {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  const fetchLocationData = async () => {
    setLoading(true);
    setError('');
    
    try {
      let ipv4Address = null;
      let ipv6Address = null;
      let locationInfo = null;
      
      // First, try to get IPv4 address specifically
      try {
        const ipv4Response = await fetch('https://api.ipify.org?format=json');
        if (ipv4Response.ok) {
          const ipv4Data = await ipv4Response.json();
          // Validate that it's actually IPv4 (no colons)
          if (ipv4Data.ip && !ipv4Data.ip.includes(':')) {
            ipv4Address = ipv4Data.ip;
          }
        }
      } catch (error) {
        console.log('IPv4 fetch failed:', error);
      }
      
      // If we don't have IPv4, try ipapi.co and check what we get
      if (!ipv4Address) {
        try {
          const response = await fetch('https://ipapi.co/json/');
          if (response.ok) {
            const data = await response.json();
            if (!data.error) {
              // Check if the returned IP is IPv4 or IPv6
              if (data.ip && !data.ip.includes(':')) {
                ipv4Address = data.ip;
              } else if (data.ip && data.ip.includes(':')) {
                ipv6Address = data.ip;
              }
              locationInfo = data;
            }
          }
        } catch (error) {
          console.log('ipapi.co fetch failed:', error);
        }
      }
      
      // Get location data for the IPv4 address if we have one
      if (ipv4Address && !locationInfo) {
        try {
          const locationResponse = await fetch(`https://ipapi.co/${ipv4Address}/json/`);
          if (locationResponse.ok) {
            const data = await locationResponse.json();
            if (!data.error) {
              locationInfo = data;
            }
          }
        } catch (error) {
          console.log('Location fetch failed:', error);
        }
      }
      
      // Try to get IPv6 address if we don't have one yet
      if (!ipv6Address) {
        try {
          const ipv6Response = await fetch('https://api64.ipify.org?format=json');
          if (ipv6Response.ok) {
            const ipv6Data = await ipv6Response.json();
            // Validate that it's actually IPv6 (contains colons)
            if (ipv6Data.ip && ipv6Data.ip.includes(':')) {
              ipv6Address = ipv6Data.ip;
            }
          }
        } catch (error) {
          console.log('IPv6 fetch failed:', error);
        }
      }
      
      // If we still don't have any IP or location data, throw an error
      if (!ipv4Address && !ipv6Address) {
        throw new Error('Failed to fetch IP address information');
      }
      
      // Use a fallback if we don't have location info
      if (!locationInfo) {
        locationInfo = {
          country_name: 'Unknown',
          country_code: 'XX',
          city: 'Unknown',
          region: 'Unknown',
          latitude: 0,
          longitude: 0,
          timezone: 'Unknown',
          org: 'Unknown',
          postal: 'Unknown',
          asn: 'Unknown'
        };
      }
      
      setLocationData({
        ipv4: ipv4Address || 'Not available',
        ipv6: ipv6Address,
        country: locationInfo.country_name || 'Unknown',
        country_code: locationInfo.country_code || 'XX',
        city: locationInfo.city || 'Unknown',
        region: locationInfo.region || 'Unknown',
        latitude: locationInfo.latitude || 0,
        longitude: locationInfo.longitude || 0,
        timezone: locationInfo.timezone || 'Unknown',
        isp: locationInfo.org || 'Unknown',
        org: locationInfo.org || 'Unknown',
        postal: locationInfo.postal || 'Unknown',
        asn: locationInfo.asn || 'Unknown'
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLocationData(null);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  useEffect(() => {
    fetchLocationData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Detecting your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            My Location
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Your current IPv4 and IPv6 addresses with location information detected automatically
          </p>
          <button
            onClick={fetchLocationData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Location
          </button>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-100 border border-red-300 rounded-lg p-4">
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {locationData && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">Your Location Details</h2>
              </div>

              <div className="p-6">
                {/* IP Addresses Simple Display */}
                <div className="mb-8 space-y-4">
                  {/* IPv4 Address */}
                  {locationData.ipv4 && locationData.ipv4 !== 'Not available' ? (
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-medium text-gray-700">My IPv4:</span>
                          <a href={`#${locationData.ipv4}`} className="text-lg font-mono text-blue-600 hover:text-blue-800 underline">
                            {locationData.ipv4}
                          </a>
                        </div>
                        <button
                          onClick={() => copyToClipboard(locationData.ipv4!, 'ipv4')}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                          title="Copy IPv4 address"
                        >
                          {copied === 'ipv4' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-medium text-gray-500">My IPv4:</span>
                        <span className="text-lg text-gray-400">Not available</span>
                      </div>
                    </div>
                  )}
                  
                  {/* IPv6 Address */}
                  {locationData.ipv6 ? (
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-medium text-gray-700">My IPv6:</span>
                          <a href={`#${locationData.ipv6}`} className="text-lg font-mono text-purple-600 hover:text-purple-800 underline break-all">
                            {locationData.ipv6}
                          </a>
                        </div>
                        <button
                          onClick={() => copyToClipboard(locationData.ipv6!, 'ipv6')}
                          className="p-1 text-gray-400 hover:text-purple-600 transition-colors duration-200 flex-shrink-0"
                          title="Copy IPv6 address"
                        >
                          {copied === 'ipv6' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-medium text-gray-500">My IPv6:</span>
                        <span className="text-lg text-gray-400">Not available</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Location Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Information</h3>
                    
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Country</p>
                          <p className="font-medium">{locationData.country} ({locationData.country_code})</p>
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(locationData.country, 'country')}
                        className="text-gray-400 hover:text-blue-600"
                      >
                        {copied === 'country' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-500">City</p>
                          <p className="font-medium">{locationData.city || 'Not available'}</p>
                        </div>
                      </div>
                      {locationData.city && (
                        <button
                          onClick={() => copyToClipboard(locationData.city, 'city')}
                          className="text-gray-400 hover:text-green-600"
                        >
                          {copied === 'city' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-500">Region</p>
                          <p className="font-medium">{locationData.region || 'Not available'}</p>
                        </div>
                      </div>
                      {locationData.region && (
                        <button
                          onClick={() => copyToClipboard(locationData.region, 'region')}
                          className="text-gray-400 hover:text-purple-600"
                        >
                          {copied === 'region' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-indigo-600" />
                        <div>
                          <p className="text-sm text-gray-500">Coordinates</p>
                          <p className="font-medium">
                            {locationData.latitude?.toFixed(4)}, {locationData.longitude?.toFixed(4)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(`${locationData.latitude}, ${locationData.longitude}`, 'coords')}
                        className="text-gray-400 hover:text-indigo-600"
                      >
                        {copied === 'coords' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Information</h3>
                    
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Wifi className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">ISP / Organization</p>
                          <p className="font-medium">{locationData.isp || 'Not available'}</p>
                        </div>
                      </div>
                      {locationData.isp && (
                        <button
                          onClick={() => copyToClipboard(locationData.isp, 'isp')}
                          className="text-gray-400 hover:text-blue-600"
                        >
                          {copied === 'isp' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-500">Timezone</p>
                          <p className="font-medium">{locationData.timezone || 'Not available'}</p>
                        </div>
                      </div>
                      {locationData.timezone && (
                        <button
                          onClick={() => copyToClipboard(locationData.timezone, 'timezone')}
                          className="text-gray-400 hover:text-green-600"
                        >
                          {copied === 'timezone' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      )}
                    </div>

                    {locationData.postal && (
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="text-sm text-gray-500">Postal Code</p>
                            <p className="font-medium">{locationData.postal}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => copyToClipboard(locationData.postal, 'postal')}
                          className="text-gray-400 hover:text-purple-600"
                        >
                          {copied === 'postal' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    )}

                    {locationData.asn && (
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-indigo-600" />
                          <div>
                            <p className="text-sm text-gray-500">ASN</p>
                            <p className="font-medium">{locationData.asn}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => copyToClipboard(locationData.asn, 'asn')}
                          className="text-gray-400 hover:text-indigo-600"
                        >
                          {copied === 'asn' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Approximate Location</h3>
                  <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg p-8 text-center">
                    <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">
                      {locationData.city}, {locationData.region}, {locationData.country}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Coordinates: {locationData.latitude?.toFixed(6)}, {locationData.longitude?.toFixed(6)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLocation;