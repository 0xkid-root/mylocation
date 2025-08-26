import React from 'react';
import { Globe, Mail, Shield, Info } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">MyLocation</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Professional network analysis tools for IT professionals, cybersecurity experts, and network administrators. Free IP geolocation, WHOIS lookup, internet speed testing, DNS analysis, port scanning, and network diagnostics. Trusted worldwide for accurate network intelligence and security auditing.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-200">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-200">
                <Shield className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-200">
                <Info className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Network Tools</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-blue-500 transition-colors duration-200">My Location Lookup</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors duration-200">My IP Address</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors duration-200">WHOIS Lookup</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors duration-200">MAC Address Lookup</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors duration-200">Speed Test</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors duration-200">DNS Lookup</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors duration-200">Port Scanner</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors duration-200">Ping Test</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-blue-500 transition-colors duration-200">API Documentation</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors duration-200">Network Guides</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors duration-200">Security Best Practices</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors duration-200">FAQ</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors duration-200">Support</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors duration-200">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 MyLocation. All rights reserved. Built with modern web technologies.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-blue-500 text-sm transition-colors duration-200">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 text-sm transition-colors duration-200">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 text-sm transition-colors duration-200">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;