import React, { useState } from 'react';
import { Search, Shield, Server, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface PortResult {
  port: number;
  status: 'open' | 'closed' | 'filtered';
  service: string;
  description: string;
}

interface ScanResult {
  host: string;
  ports: PortResult[];
  scanTime: number;
}

const PortScanner: React.FC = () => {
  const [host, setHost] = useState('');
  const [portRange, setPortRange] = useState('1-1000');
  const [scanType, setScanType] = useState('common');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const commonPorts = [
    { port: 21, service: 'FTP', description: 'File Transfer Protocol' },
    { port: 22, service: 'SSH', description: 'Secure Shell' },
    { port: 23, service: 'Telnet', description: 'Telnet Protocol' },
    { port: 25, service: 'SMTP', description: 'Simple Mail Transfer Protocol' },
    { port: 53, service: 'DNS', description: 'Domain Name System' },
    { port: 80, service: 'HTTP', description: 'Hypertext Transfer Protocol' },
    { port: 110, service: 'POP3', description: 'Post Office Protocol v3' },
    { port: 143, service: 'IMAP', description: 'Internet Message Access Protocol' },
    { port: 443, service: 'HTTPS', description: 'HTTP Secure' },
    { port: 993, service: 'IMAPS', description: 'IMAP over SSL' },
    { port: 995, service: 'POP3S', description: 'POP3 over SSL' },
    { port: 3389, service: 'RDP', description: 'Remote Desktop Protocol' },
    { port: 5432, service: 'PostgreSQL', description: 'PostgreSQL Database' },
    { port: 3306, service: 'MySQL', description: 'MySQL Database' },
    { port: 1433, service: 'MSSQL', description: 'Microsoft SQL Server' },
    { port: 27017, service: 'MongoDB', description: 'MongoDB Database' }
  ];

  const validateHost = (host: string): boolean => {
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*$/;
    return ipRegex.test(host) || domainRegex.test(host);
  };

  const getPortsToScan = (): number[] => {
    if (scanType === 'common') {
      return commonPorts.map(p => p.port);
    } else {
      const [start, end] = portRange.split('-').map(Number);
      const ports = [];
      for (let i = start; i <= Math.min(end, 65535); i++) {
        ports.push(i);
      }
      return ports.slice(0, 100); // Limit to 100 ports for demo
    }
  };

  const getServiceInfo = (port: number): { service: string; description: string } => {
    const portInfo = commonPorts.find(p => p.port === port);
    return portInfo ? 
      { service: portInfo.service, description: portInfo.description } :
      { service: 'Unknown', description: 'Unknown service' };
  };

  const simulatePortScan = async () => {
    if (!host.trim()) {
      setError('Please enter a host or IP address');
      return;
    }

    if (!validateHost(host)) {
      setError('Please enter a valid IP address or domain name');
      return;
    }

    setLoading(true);
    setError('');
    setProgress(0);

    const portsToScan = getPortsToScan();
    const results: PortResult[] = [];
    const startTime = Date.now();

    for (let i = 0; i < portsToScan.length; i++) {
      const port = portsToScan[i];
      const serviceInfo = getServiceInfo(port);
      
      // Simulate random port status
      const random = Math.random();
      let status: 'open' | 'closed' | 'filtered';
      
      if (random < 0.1) {
        status = 'open';
      } else if (random < 0.8) {
        status = 'closed';
      } else {
        status = 'filtered';
      }

      // Make common ports more likely to be open
      if (commonPorts.some(p => p.port === port) && Math.random() < 0.3) {
        status = 'open';
      }

      results.push({
        port,
        status,
        service: serviceInfo.service,
        description: serviceInfo.description
      });

      setProgress(((i + 1) / portsToScan.length) * 100);
      
      // Simulate scanning delay
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    const scanTime = Date.now() - startTime;

    setScanResult({
      host,
      ports: results,
      scanTime
    });

    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      simulatePortScan();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'closed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'filtered':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'text-green-600 bg-green-100';
      case 'closed':
        return 'text-red-600 bg-red-100';
      case 'filtered':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const openPorts = scanResult?.ports.filter(p => p.status === 'open') || [];
  const closedPorts = scanResult?.ports.filter(p => p.status === 'closed') || [];
  const filteredPorts = scanResult?.ports.filter(p => p.status === 'filtered') || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Port Scanner
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Scan for open ports on any host or IP address to identify running services and potential security vulnerabilities
          </p>
        </div>

        {/* Scan Configuration */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Host or IP Address</label>
                <input
                  type="text"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter IP address or domain (e.g., google.com)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Scan Type</label>
                <select
                  value={scanType}
                  onChange={(e) => setScanType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-lg"
                >
                  <option value="common">Common Ports</option>
                  <option value="range">Port Range</option>
                </select>
              </div>
            </div>

            {scanType === 'range' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Port Range</label>
                <input
                  type="text"
                  value={portRange}
                  onChange={(e) => setPortRange(e.target.value)}
                  placeholder="e.g., 1-1000 or 80-443"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-lg"
                />
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={simulatePortScan}
                disabled={loading}
                className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Start Scan
                  </>
                )}
              </button>
            </div>

            {loading && (
              <div className="mt-4">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">Scanning... {progress.toFixed(0)}% complete</p>
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {scanResult && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">Scan Results for {scanResult.host}</h2>
                <p className="text-red-100 text-sm">Scan completed in {scanResult.scanTime}ms</p>
              </div>

              <div className="p-6">
                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{openPorts.length}</div>
                    <div className="text-sm text-gray-500">Open Ports</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{closedPorts.length}</div>
                    <div className="text-sm text-gray-500">Closed Ports</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{filteredPorts.length}</div>
                    <div className="text-sm text-gray-500">Filtered Ports</div>
                  </div>
                </div>

                {/* Open Ports (Priority) */}
                {openPorts.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Open Ports ({openPorts.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {openPorts.map((port, index) => (
                        <div key={index} className="p-4 border border-green-200 rounded-lg bg-green-50">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Server className="w-4 h-4 text-green-600" />
                              <span className="font-semibold text-gray-900">Port {port.port}</span>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(port.status)}`}>
                              {port.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">{port.service}</p>
                            <p className="text-gray-600">{port.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Ports Table */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">All Scanned Ports</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-2 text-left">Port</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Service</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scanResult.ports.map((port, index) => (
                          <tr key={index} className={`${port.status === 'open' ? 'bg-green-50' : ''}`}>
                            <td className="border border-gray-300 px-4 py-2 font-mono">{port.port}</td>
                            <td className="border border-gray-300 px-4 py-2">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(port.status)}
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(port.status)}`}>
                                  {port.status.toUpperCase()}
                                </span>
                              </div>
                            </td>
                            <td className="border border-gray-300 px-4 py-2 font-medium">{port.service}</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">{port.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Security Warning */}
                {openPorts.length > 0 && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Security Notice</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Open ports may indicate running services. Ensure that only necessary services are exposed 
                          and that they are properly secured with authentication and encryption.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Information Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">About Port Scanning</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Port Status Meanings</h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span><strong>Open:</strong> Service is listening and accepting connections</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span><strong>Closed:</strong> No service is listening on this port</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span><strong>Filtered:</strong> Port is blocked by firewall or filter</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Common Use Cases</h4>
                <ul className="text-sm space-y-1">
                  <li>• Network security assessment</li>
                  <li>• Service discovery and inventory</li>
                  <li>• Troubleshooting connectivity issues</li>
                  <li>• Compliance and audit requirements</li>
                  <li>• Penetration testing (authorized only)</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-sm text-red-700">
                <strong>Legal Notice:</strong> Only scan hosts that you own or have explicit permission to test. 
                Unauthorized port scanning may violate terms of service or local laws.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortScanner;