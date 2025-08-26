import React, { useState} from 'react';
import { Search, MapPin, Globe, Wifi, Copy, Check, Zap, Shield, Server, Activity } from 'lucide-react';

interface LocationData {
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
}

interface HomeProps {
  onToolSelect: (tool: string) => void;
}

const Home: React.FC<HomeProps> = ({ onToolSelect }) => {
  const [ipAddress, setIpAddress] = useState('');
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const tools = [
    {
      id: 'my-location',
      name: 'My IP Location',
      description: 'Find your current IP address and location details',
      icon: MapPin,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      id: 'ip-whois',
      name: 'IP WHOIS Lookup',
      description: 'Get detailed WHOIS information for any IP address',
      icon: Search,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      id: 'mac-lookup',
      name: 'MAC Address Lookup',
      description: 'Find manufacturer details from MAC addresses',
      icon: Wifi,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    {
      id: 'speed-test',
      name: 'Internet Speed Test',
      description: 'Test your internet connection speed',
      icon: Zap,
      color: 'bg-yellow-500',
      hoverColor: 'hover:bg-yellow-600'
    },
    {
      id: 'dns-lookup',
      name: 'DNS Lookup',
      description: 'Perform DNS queries and get DNS records',
      icon: Server,
      color: 'bg-indigo-500',
      hoverColor: 'hover:bg-indigo-600'
    },
    {
      id: 'port-scanner',
      name: 'Port Scanner',
      description: 'Scan for open ports on any IP address',
      icon: Shield,
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600'
    },
    {
      id: 'ping-test',
      name: 'Ping Test',
      description: 'Test network connectivity and latency',
      icon: Activity,
      color: 'bg-teal-500',
      hoverColor: 'hover:bg-teal-600'
    }
  ];

  const validateIP = (ip: string): boolean => {
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
  };

  const fetchLocationData = async (ip?: string) => {
    setLoading(true);
    setError('');
    
    try {
      const url = ip ? `https://ipapi.co/${ip}/json/` : 'https://ipapi.co/json/';
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.reason || 'Invalid IP address');
      }
      
      setLocationData({
        ip: data.ip,
        country: data.country_name,
        country_code: data.country_code,
        city: data.city,
        region: data.region,
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
        isp: data.org,
        org: data.org
      });
      
      // Don't automatically set IP in input field for better UX
      // if (!ip) {
      //   setIpAddress(data.ip);
      // }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLocationData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!ipAddress.trim()) {
      fetchLocationData();
      return;
    }
    
    if (!validateIP(ipAddress)) {
      setError('Please enter a valid IP address');
      return;
    }
    
    fetchLocationData(ipAddress);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Remove automatic lookup on page load for better UX
  // useEffect(() => {
  //   fetchLocationData();
  // }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              My Location & Network Tools
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Comprehensive suite of network tools for IP geolocation, WHOIS lookup, speed testing, and more. 
              Get detailed information about any IP address or test your network connectivity.
            </p>
          </div>

          {/* Quick IP Lookup */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick IP Lookup</h2>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <input
                    type="text"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter any IP address (e.g., 8.8.8.8) or leave blank to find yours"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Find Location
                    </>
                  )}
                </button>
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {!locationData && !loading && !error && (
                <div className="text-center py-6">
                  <div className="text-gray-400 mb-2">
                    <Search className="w-12 h-12 mx-auto mb-3" />
                  </div>
                  <p className="text-gray-600 text-lg mb-2">Ready to discover IP location details?</p>
                  <p className="text-gray-500 text-sm">Enter any IP address above or click "Find Location" to detect your current IP</p>
                </div>
              )}

              {locationData && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="space-y-4">
                    {/* IP Address - Full Width */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">IP Address</span>
                        <button
                          onClick={() => copyToClipboard(locationData.ip)}
                          className="text-gray-400 hover:text-blue-500"
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="font-semibold text-lg font-mono break-all">{locationData.ip}</p>
                    </div>
                    
                    {/* Other details in grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div>
                      <span className="text-sm text-gray-500">Location</span>
                      <p className="font-semibold">{locationData.city}, {locationData.country}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">ISP</span>
                      <p className="font-semibold">{locationData.isp}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Timezone</span>
                      <p className="font-semibold">{locationData.timezone}</p>
                    </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">All Network Tools</h2>
            <p className="text-lg text-gray-600">Choose from our comprehensive suite of network analysis tools</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  onClick={() => onToolSelect(tool.id)}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100 hover:border-blue-200"
                >
                  <div className="p-6">
                    <div className={`w-12 h-12 ${tool.color} ${tool.hoverColor} rounded-lg flex items-center justify-center mb-4 transition-colors duration-200`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                      {tool.name}
                    </h3>
                    <p className="text-gray-600">{tool.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Tools?</h2>
            <p className="text-lg text-gray-600">Professional-grade network tools with accurate results</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast & Accurate</h3>
              <p className="text-gray-600">Get instant results with high accuracy using multiple data sources</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600">Your data is protected and we don't store any personal information</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Coverage</h3>
              <p className="text-gray-600">Comprehensive database covering IP addresses worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Get answers about IP location lookup and network tools</p>
          </div>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">What is my IP address?</h3>
              <p className="text-gray-600">Your IP address is a unique identifier assigned to your device when connected to the internet. Our tool automatically detects both IPv4 and IPv6 addresses with detailed location information.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">How accurate is IP geolocation?</h3>
              <p className="text-gray-600">IP location accuracy varies: country-level is 95-99% accurate, while city-level ranges from 55-80%. We use multiple reliable databases for the most accurate results.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Are these tools free?</h3>
              <p className="text-gray-600">Yes, all our IP location and network tools are completely free to use with no registration required. Get instant results for IP lookup, WHOIS, speed test, and more.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">What is WHOIS lookup?</h3>
              <p className="text-gray-600">WHOIS lookup reveals detailed information about IP address ownership, including organization details, registration dates, and network information for security and troubleshooting.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Complete My Location & Network Tools Suite</h2>
            
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="mb-6 text-lg">
                Our comprehensive IP location lookup and network tools provide everything you need for network analysis, security auditing, and connectivity testing. Whether you're a network administrator, security professional, or curious user, our free tools deliver accurate, real-time information about IP addresses worldwide.
              </p>
              
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Professional Network Analysis Tools</h3>
              <p className="mb-6">
                Perfect for IT professionals, cybersecurity experts, and network administrators who need reliable tools for network troubleshooting, security investigations, and performance monitoring. Our tools help identify network issues, trace IP addresses, analyze domain configurations, and test connectivity across global networks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Educational Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {/* How IP Address Works */}
              <div>
                <h2 className="text-3xl font-bold text-blue-900 mb-6">How does an IP address work?</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  When your device connects to the Internet, your Internet Service Provider (ISP) assigns it an IP address. This address acts like a return address for data—allowing websites, apps, and services to send information back to you. IP addresses help route traffic to the correct destination, whether you're browsing the web, streaming video, or sending emails. Without an IP your device wouldn't be able to communicate with other systems on the network.
                </p>
              </div>

              {/* Private IP Address */}
              <div>
                <h2 className="text-3xl font-bold text-blue-900 mb-6">What is a private IP address?</h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-4">
                  A private IP address is assigned to devices within a local network, like your home or office WiFi. These addresses are used for internal communication and are not directly accessible from the Internet. Private IPs typically start with 10, 172, or 192 and are reserved by the Internet Assigned Numbers Authority (IANA). Unlike public IPs, which are visible online, private IPs stay hidden behind your router or firewall.
                </p>
                <p className="text-blue-600 font-medium">
                  <a href="#" className="hover:text-blue-800 underline">Learn more about private IP addresses »</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;