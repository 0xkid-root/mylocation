import React, { useState, useEffect } from 'react';
import { Activity, Clock, Wifi, TrendingUp, Play, Square } from 'lucide-react';

interface PingResult {
  sequence: number;
  time: number;
  status: 'success' | 'timeout' | 'error';
}

interface PingStats {
  sent: number;
  received: number;
  lost: number;
  lossPercentage: number;
  minTime: number;
  maxTime: number;
  avgTime: number;
}

const PingTest: React.FC = () => {
  const [host, setHost] = useState('google.com');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<PingResult[]>([]);
  const [stats, setStats] = useState<PingStats | null>(null);
  const [error, setError] = useState('');
  const [currentPing, setCurrentPing] = useState<number | null>(null);

  const validateHost = (host: string): boolean => {
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*$/;
    return ipRegex.test(host) || domainRegex.test(host);
  };

  const simulatePing = (): Promise<PingResult> => {
    return new Promise((resolve) => {
      const delay = Math.random() * 100 + 10; // 10-110ms
      const success = Math.random() > 0.05; // 95% success rate
      
      setTimeout(() => {
        resolve({
          sequence: results.length + 1,
          time: success ? Math.round(delay) : 0,
          status: success ? 'success' : 'timeout'
        });
      }, delay);
    });
  };

  const calculateStats = (pingResults: PingResult[]): PingStats => {
    const successfulPings = pingResults.filter(r => r.status === 'success');
    const times = successfulPings.map(r => r.time);
    
    return {
      sent: pingResults.length,
      received: successfulPings.length,
      lost: pingResults.length - successfulPings.length,
      lossPercentage: ((pingResults.length - successfulPings.length) / pingResults.length) * 100,
      minTime: times.length > 0 ? Math.min(...times) : 0,
      maxTime: times.length > 0 ? Math.max(...times) : 0,
      avgTime: times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0
    };
  };

  const startPing = async () => {
    if (!host.trim()) {
      setError('Please enter a host or IP address');
      return;
    }

    if (!validateHost(host)) {
      setError('Please enter a valid IP address or domain name');
      return;
    }

    setIsRunning(true);
    setError('');
    setResults([]);
    setStats(null);
    setCurrentPing(null);

    const pingResults: PingResult[] = [];

    // Run continuous ping
    const pingInterval = setInterval(async () => {
      if (!isRunning) {
        clearInterval(pingInterval);
        return;
      }

      const result = await simulatePing();
      pingResults.push(result);
      setResults([...pingResults]);
      setCurrentPing(result.status === 'success' ? result.time : null);
      
      const currentStats = calculateStats(pingResults);
      setStats(currentStats);

      // Stop after 20 pings for demo
      if (pingResults.length >= 20) {
        setIsRunning(false);
        clearInterval(pingInterval);
      }
    }, 1000);
  };

  const stopPing = () => {
    setIsRunning(false);
  };

  const clearResults = () => {
    setResults([]);
    setStats(null);
    setCurrentPing(null);
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isRunning) {
      startPing();
    }
  };

  const getLatencyColor = (time: number): string => {
    if (time < 50) return 'text-green-600';
    if (time < 100) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getLatencyBg = (time: number): string => {
    if (time < 50) return 'bg-green-100';
    if (time < 100) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-full mb-4">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Ping Test Tool
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Test network connectivity and measure latency to any host or IP address with real-time ping monitoring
          </p>
        </div>

        {/* Ping Interface */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Ping Test</h2>
            </div>

            <div className="p-6">
              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <input
                    type="text"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter host or IP address (e.g., google.com)"
                    disabled={isRunning}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-lg disabled:bg-gray-100"
                  />
                </div>
                <div className="flex gap-2">
                  {!isRunning ? (
                    <button
                      onClick={startPing}
                      className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2 font-semibold"
                    >
                      <Play className="w-5 h-5" />
                      Start Ping
                    </button>
                  ) : (
                    <button
                      onClick={stopPing}
                      className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2 font-semibold"
                    >
                      <Square className="w-5 h-5" />
                      Stop
                    </button>
                  )}
                  <button
                    onClick={clearResults}
                    disabled={isRunning}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-100 border border-red-300 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Current Ping Display */}
              {isRunning && (
                <div className="mb-6 text-center">
                  <div className="inline-block p-6 bg-teal-50 rounded-lg">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <Activity className={`w-6 h-6 ${isRunning ? 'animate-pulse text-teal-600' : 'text-gray-400'}`} />
                      <span className="text-lg font-semibold text-gray-900">
                        Pinging {host}
                      </span>
                    </div>
                    {currentPing !== null && (
                      <div className={`text-3xl font-bold ${getLatencyColor(currentPing)}`}>
                        {currentPing}ms
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Statistics */}
              {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Wifi className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-gray-900">{stats.sent}</div>
                    <div className="text-sm text-gray-500">Sent</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Activity className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-gray-900">{stats.received}</div>
                    <div className="text-sm text-gray-500">Received</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-red-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-gray-900">{stats.lossPercentage.toFixed(1)}%</div>
                    <div className="text-sm text-gray-500">Loss</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-gray-900">{stats.avgTime}ms</div>
                    <div className="text-sm text-gray-500">Avg Time</div>
                  </div>
                </div>
              )}

              {/* Detailed Statistics */}
              {stats && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Detailed Statistics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Minimum:</span>
                      <span className="ml-2 font-medium">{stats.minTime}ms</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Maximum:</span>
                      <span className="ml-2 font-medium">{stats.maxTime}ms</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Average:</span>
                      <span className="ml-2 font-medium">{stats.avgTime}ms</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Results Log */}
              {results.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Ping Results</h4>
                  <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                    <div className="space-y-1 p-2">
                      {results.slice().reverse().map((result, index) => (
                        <div
                          key={results.length - index}
                          className={`flex items-center justify-between p-2 rounded text-sm ${
                            result.status === 'success' 
                              ? `${getLatencyBg(result.time)} border border-gray-200` 
                              : 'bg-red-100 border border-red-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-gray-600">#{result.sequence}</span>
                            <span className="text-gray-700">
                              {result.status === 'success' 
                                ? `Reply from ${host}` 
                                : 'Request timeout'
                              }
                            </span>
                          </div>
                          <div className={`font-medium ${
                            result.status === 'success' 
                              ? getLatencyColor(result.time)
                              : 'text-red-600'
                          }`}>
                            {result.status === 'success' ? `${result.time}ms` : 'Timeout'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Understanding Ping Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Latency Ranges</h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span><strong>0-50ms:</strong> Excellent (Local/Fast connections)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span><strong>50-100ms:</strong> Good (Most web browsing)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span><strong>100ms+:</strong> High (May affect real-time apps)</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Common Use Cases</h4>
                <ul className="text-sm space-y-1">
                  <li>• Test network connectivity</li>
                  <li>• Measure network latency</li>
                  <li>• Troubleshoot connection issues</li>
                  <li>• Monitor network performance</li>
                  <li>• Verify server availability</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PingTest;