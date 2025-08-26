import React, { useState } from 'react';
import { Search, Menu, X, Globe, Wifi, Clock, MapPin, Zap, Shield } from 'lucide-react';

interface HeaderProps {
  onToolSelect: (tool: string) => void;
  currentTool: string;
}

const Header: React.FC<HeaderProps> = ({ onToolSelect, currentTool }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const tools = [
    { id: 'home', name: 'Home', icon: Globe },
    { id: 'my-location', name: 'My Location', icon: MapPin },
    { id: 'ip-whois', name: 'IP WHOIS Lookup', icon: Search },
    { id: 'mac-lookup', name: 'MAC Address Lookup', icon: Wifi },
    { id: 'speed-test', name: 'Internet Speed Test', icon: Zap },
    { id: 'dns-lookup', name: 'DNS Lookup', icon: Globe },
    { id: 'port-scanner', name: 'Port Scanner', icon: Shield },
    { id: 'ping-test', name: 'Ping Test', icon: Clock },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onToolSelect('my-location');
      // You can pass the search query to the IP lookup tool
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MyLocation</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {tools.slice(0, 6).map((tool) => (
              <button
                key={tool.id}
                onClick={() => onToolSelect(tool.id)}
                className={`text-sm font-medium transition-colors duration-200 ${
                  currentTool === tool.id
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {tool.name}
              </button>
            ))}
            <div className="relative group">
              <button className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200">
                All Tools
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  {tools.slice(6).map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <button
                        key={tool.id}
                        onClick={() => onToolSelect(tool.id)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tool.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Tools or Enter IP"
                className="w-72 px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-blue-600"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-blue-600"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => {
                      onToolSelect(tool.id);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left rounded-lg flex items-center space-x-3 transition-colors duration-200 ${
                      currentTool === tool.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tool.name}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Tools or Enter IP"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                />
              </form>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;