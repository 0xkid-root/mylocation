import React, { useState } from 'react';
import { Zap, Download, Upload, Wifi, Clock, Play, RotateCcw } from 'lucide-react';

interface SpeedTestResult {
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
  jitter: number;
  server: string;
  ip: string;
}

const InternetSpeedTest: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<'idle' | 'ping' | 'download' | 'upload' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<SpeedTestResult | null>(null);
  const [currentSpeed, setCurrentSpeed] = useState(0);

  const simulateSpeedTest = async () => {
    setIsRunning(true);
    setCurrentTest('ping');
    setProgress(0);
    setResult(null);

    // Simulate ping test
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Simulate download test
    setCurrentTest('download');
    setProgress(0);
    for (let i = 0; i <= 100; i += 5) {
      setProgress(i);
      setCurrentSpeed(Math.random() * 100 + 50); // Random speed between 50-150 Mbps
      await new Promise(resolve => setTimeout(resolve, 150));
    }

    // Simulate upload test
    setCurrentTest('upload');
    setProgress(0);
    for (let i = 0; i <= 100; i += 5) {
      setProgress(i);
      setCurrentSpeed(Math.random() * 50 + 20); // Random speed between 20-70 Mbps
      await new Promise(resolve => setTimeout(resolve, 150));
    }

    // Generate final results
    const finalResult: SpeedTestResult = {
      downloadSpeed: Math.round((Math.random() * 50 + 75) * 100) / 100, // 75-125 Mbps
      uploadSpeed: Math.round((Math.random() * 30 + 35) * 100) / 100, // 35-65 Mbps
      ping: Math.round(Math.random() * 20 + 10), // 10-30 ms
      jitter: Math.round(Math.random() * 5 + 1), // 1-6 ms
      server: 'Test Server - New York, NY',
      ip: '192.168.1.100'
    };

    setResult(finalResult);
    setCurrentTest('complete');
    setIsRunning(false);
    setCurrentSpeed(0);
  };

  const resetTest = () => {
    setCurrentTest('idle');
    setProgress(0);
    setResult(null);
    setCurrentSpeed(0);
  };

  const getTestStatusText = () => {
    switch (currentTest) {
      case 'ping':
        return 'Testing ping...';
      case 'download':
        return 'Testing download speed...';
      case 'upload':
        return 'Testing upload speed...';
      case 'complete':
        return 'Test completed!';
      default:
        return 'Ready to test';
    }
  };

  const getSpeedGrade = (speed: number, type: 'download' | 'upload') => {
    const thresholds = type === 'download' 
      ? { excellent: 100, good: 50, fair: 25 }
      : { excellent: 50, good: 25, fair: 10 };

    if (speed >= thresholds.excellent) return { grade: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (speed >= thresholds.good) return { grade: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (speed >= thresholds.fair) return { grade: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { grade: 'Poor', color: 'text-red-600', bg: 'bg-red-100' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500 rounded-full mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Internet Speed Test
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Test your internet connection speed with our accurate and reliable speed test tool
          </p>
        </div>

        {/* Speed Test Interface */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Speed Test</h2>
            </div>

            <div className="p-8">
              {/* Main Speed Display */}
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <div className="w-48 h-48 mx-auto mb-6 relative">
                    {/* Speedometer Background */}
                    <div className="w-full h-full rounded-full border-8 border-gray-200 relative overflow-hidden">
                      <div 
                        className="absolute inset-0 rounded-full border-8 border-transparent"
                        style={{
                          background: `conic-gradient(from 0deg, #10B981 0deg, #10B981 ${progress * 3.6}deg, transparent ${progress * 3.6}deg)`,
                          borderColor: currentTest === 'download' ? '#3B82F6' : currentTest === 'upload' ? '#EF4444' : '#10B981'
                        }}
                      ></div>
                    </div>
                    
                    {/* Speed Value */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">
                          {isRunning ? currentSpeed.toFixed(1) : (result ? Math.max(result.downloadSpeed, result.uploadSpeed).toFixed(1) : '0')}
                        </div>
                        <div className="text-sm text-gray-500">Mbps</div>
                      </div>
                    </div>
                  </div>

                  {/* Status Text */}
                  <p className="text-lg font-medium text-gray-700 mb-4">
                    {getTestStatusText()}
                  </p>

                  {/* Progress Bar */}
                  {isRunning && (
                    <div className="w-64 mx-auto mb-6">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">{progress}% complete</p>
                    </div>
                  )}

                  {/* Control Buttons */}
                  <div className="flex justify-center gap-4">
                    {!isRunning && currentTest !== 'complete' && (
                      <button
                        onClick={simulateSpeedTest}
                        className="px-8 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2 font-semibold"
                      >
                        <Play className="w-5 h-5" />
                        Start Test
                      </button>
                    )}
                    
                    {currentTest === 'complete' && (
                      <button
                        onClick={resetTest}
                        className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2 font-semibold"
                      >
                        <RotateCcw className="w-5 h-5" />
                        Test Again
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Results */}
              {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Download className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{result.downloadSpeed}</div>
                    <div className="text-sm text-gray-500 mb-2">Mbps Download</div>
                    <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getSpeedGrade(result.downloadSpeed, 'download').bg} ${getSpeedGrade(result.downloadSpeed, 'download').color}`}>
                      {getSpeedGrade(result.downloadSpeed, 'download').grade}
                    </div>
                  </div>

                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <Upload className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{result.uploadSpeed}</div>
                    <div className="text-sm text-gray-500 mb-2">Mbps Upload</div>
                    <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getSpeedGrade(result.uploadSpeed, 'upload').bg} ${getSpeedGrade(result.uploadSpeed, 'upload').color}`}>
                      {getSpeedGrade(result.uploadSpeed, 'upload').grade}
                    </div>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{result.ping}</div>
                    <div className="text-sm text-gray-500 mb-2">ms Ping</div>
                    <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${result.ping < 20 ? 'bg-green-100 text-green-600' : result.ping < 50 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
                      {result.ping < 20 ? 'Excellent' : result.ping < 50 ? 'Good' : 'Poor'}
                    </div>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Wifi className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{result.jitter}</div>
                    <div className="text-sm text-gray-500 mb-2">ms Jitter</div>
                    <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${result.jitter < 3 ? 'bg-green-100 text-green-600' : result.jitter < 6 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
                      {result.jitter < 3 ? 'Excellent' : result.jitter < 6 ? 'Good' : 'Poor'}
                    </div>
                  </div>
                </div>
              )}

              {/* Test Details */}
              {result && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Test Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Server:</span> {result.server}
                    </div>
                    <div>
                      <span className="font-medium">Your IP:</span> {result.ip}
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
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Understanding Your Speed Test Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Download Speed</h4>
                <p className="text-sm mb-4">
                  Measures how fast data travels from the internet to your device. Important for streaming, 
                  downloading files, and browsing websites.
                </p>
                <ul className="text-sm space-y-1">
                  <li><span className="font-medium">25+ Mbps:</span> Good for 4K streaming</li>
                  <li><span className="font-medium">10+ Mbps:</span> Good for HD streaming</li>
                  <li><span className="font-medium">5+ Mbps:</span> Good for standard streaming</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Upload Speed</h4>
                <p className="text-sm mb-4">
                  Measures how fast data travels from your device to the internet. Important for video calls, 
                  uploading files, and online gaming.
                </p>
                <ul className="text-sm space-y-1">
                  <li><span className="font-medium">10+ Mbps:</span> Good for video conferencing</li>
                  <li><span className="font-medium">5+ Mbps:</span> Good for file uploads</li>
                  <li><span className="font-medium">1+ Mbps:</span> Basic web browsing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* SEO Content Section */}
        <div className="container mx-auto px-4 py-16">
          {/* Internet Speed FAQ */}
          <section className="bg-gray-50 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Internet Speed Test FAQ</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Why is my internet slower than advertised?</h3>
                <p className="text-gray-600">ISPs advertise "up to" speeds that represent maximum theoretical speeds. Actual speeds can be lower due to network congestion, distance from servers, and equipment limitations.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">When should I test my internet speed?</h3>
                <p className="text-gray-600">Test at different times of day to get a comprehensive view. Peak hours (evenings) often show slower speeds due to network congestion, while off-peak hours show optimal performance.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">How can I improve my internet speed?</h3>
                <p className="text-gray-600">Use ethernet instead of WiFi, restart your router regularly, close unnecessary applications, update network drivers, and consider upgrading your internet plan or equipment.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">What causes high ping and jitter?</h3>
                <p className="text-gray-600">High ping can be caused by distance to servers, network congestion, or poor routing. Jitter indicates inconsistent latency, often due to network instability or interference.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default InternetSpeedTest;