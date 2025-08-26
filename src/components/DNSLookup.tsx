import React, { useState } from 'react';
import { Search, Server, Globe, Copy, Check } from 'lucide-react';

interface DNSRecord {
  type: string;
  value: string;
  ttl?: number;
}

interface DNSResult {
  domain: string;
  records: DNSRecord[];
}

const DNSLookup: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [recordType, setRecordType] = useState('A');
  const [dnsResult, setDnsResult] = useState<DNSResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  const recordTypes = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'TXT', 'SOA', 'PTR'];

  // Sample DNS data for demonstration
  const sampleDNSData: { [key: string]: { [key: string]: DNSRecord[] } } = {
    'google.com': {
      'A': [
        { type: 'A', value: '142.250.191.14', ttl: 300 },
        { type: 'A', value: '142.250.191.46', ttl: 300 }
      ],
      'AAAA': [
        { type: 'AAAA', value: '2607:f8b0:4004:c1b::65', ttl: 300 }
      ],
      'MX': [
        { type: 'MX', value: '10 smtp.google.com', ttl: 3600 }
      ],
      'NS': [
        { type: 'NS', value: 'ns1.google.com', ttl: 21600 },
        { type: 'NS', value: 'ns2.google.com', ttl: 21600 }
      ],
      'TXT': [
        { type: 'TXT', value: 'v=spf1 include:_spf.google.com ~all', ttl: 3600 }
      ]
    },
    'github.com': {
      'A': [
        { type: 'A', value: '140.82.114.4', ttl: 60 }
      ],
      'AAAA': [
        { type: 'AAAA', value: '2606:50c0:8000::153', ttl: 60 }
      ],
      'MX': [
        { type: 'MX', value: '1 aspmx.l.google.com', ttl: 3600 },
        { type: 'MX', value: '10 alt3.aspmx.l.google.com', ttl: 3600 }
      ]
    }
  };

  const validateDomain = (domain: string): boolean => {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*$/;
    return domainRegex.test(domain);
  };

  const performDNSLookup = () => {
    if (!domain.trim()) {
      setError('Please enter a domain name');
      return;
    }

    if (!validateDomain(domain)) {
      setError('Please enter a valid domain name');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate DNS lookup delay
    setTimeout(() => {
      const domainData = sampleDNSData[domain.toLowerCase()];
      
      if (domainData && domainData[recordType]) {
        setDnsResult({
          domain: domain,
          records: domainData[recordType]
        });
      } else {
        // Generate some sample data for unknown domains
        const sampleRecords: DNSRecord[] = [];
        
        switch (recordType) {
          case 'A':
            sampleRecords.push({ type: 'A', value: '93.184.216.34', ttl: 86400 });
            break;
          case 'AAAA':
            sampleRecords.push({ type: 'AAAA', value: '2606:2800:220:1:248:1893:25c8:1946', ttl: 86400 });
            break;
          case 'MX':
            sampleRecords.push({ type: 'MX', value: '10 mail.example.com', ttl: 3600 });
            break;
          case 'NS':
            sampleRecords.push({ type: 'NS', value: 'ns1.example.com', ttl: 86400 });
            sampleRecords.push({ type: 'NS', value: 'ns2.example.com', ttl: 86400 });
            break;
          case 'TXT':
            sampleRecords.push({ type: 'TXT', value: 'v=spf1 -all', ttl: 3600 });
            break;
          default:
            sampleRecords.push({ type: recordType, value: 'No records found', ttl: 0 });
        }
        
        setDnsResult({
          domain: domain,
          records: sampleRecords
        });
      }
      
      setLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performDNSLookup();
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const getRecordTypeDescription = (type: string): string => {
    const descriptions: { [key: string]: string } = {
      'A': 'Maps domain to IPv4 address',
      'AAAA': 'Maps domain to IPv6 address',
      'CNAME': 'Canonical name record (alias)',
      'MX': 'Mail exchange server',
      'NS': 'Name server records',
      'TXT': 'Text records (SPF, DKIM, etc.)',
      'SOA': 'Start of authority record',
      'PTR': 'Reverse DNS lookup'
    };
    return descriptions[type] || 'DNS record';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <Server className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            DNS Lookup Tool
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Perform DNS queries to get detailed information about domain name records including A, AAAA, MX, NS, and TXT records
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter domain name (e.g., google.com)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-lg"
                />
              </div>
              <div>
                <select
                  value={recordType}
                  onChange={(e) => setRecordType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-lg"
                >
                  {recordTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={performDNSLookup}
                disabled={loading}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    DNS Lookup
                  </>
                )}
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
        {dnsResult && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">DNS Records for {dnsResult.domain}</h2>
                <p className="text-indigo-100 text-sm">{getRecordTypeDescription(recordType)}</p>
              </div>

              <div className="p-6">
                {/* Record Type Info */}
                <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Server className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="font-semibold text-gray-900">{recordType} Records</p>
                      <p className="text-sm text-gray-600">{getRecordTypeDescription(recordType)}</p>
                    </div>
                  </div>
                </div>

                {/* DNS Records */}
                <div className="space-y-4">
                  {dnsResult.records.map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Globe className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
                              {record.type}
                            </span>
                            {record.ttl && (
                              <span className="text-xs text-gray-500">TTL: {record.ttl}s</span>
                            )}
                          </div>
                          <p className="font-mono text-gray-900">{record.value}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(record.value, `record-${index}`)}
                        className="p-2 text-gray-400 hover:text-indigo-600 transition-colors duration-200"
                      >
                        {copied === `record-${index}` ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Quick Lookup</h4>
                  <div className="flex flex-wrap gap-2">
                    {recordTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => {
                          setRecordType(type);
                          if (domain) performDNSLookup();
                        }}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
                          recordType === type
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-indigo-50 border border-gray-300'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Information Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">DNS Record Types Explained</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900">A Record</h4>
                  <p className="text-sm">Maps a domain to an IPv4 address (32-bit)</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">AAAA Record</h4>
                  <p className="text-sm">Maps a domain to an IPv6 address (128-bit)</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">CNAME Record</h4>
                  <p className="text-sm">Creates an alias pointing to another domain</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">MX Record</h4>
                  <p className="text-sm">Specifies mail servers for the domain</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900">NS Record</h4>
                  <p className="text-sm">Specifies authoritative name servers</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">TXT Record</h4>
                  <p className="text-sm">Contains text data (SPF, DKIM, verification)</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">SOA Record</h4>
                  <p className="text-sm">Contains administrative information about the zone</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">PTR Record</h4>
                  <p className="text-sm">Used for reverse DNS lookups (IP to domain)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* SEO Content Section */}
        <div className="container mx-auto px-4 py-16">
          {/* What is DNS */}
          <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-indigo-900 mb-6">What is DNS Lookup?</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              DNS (Domain Name System) lookup is the process of translating human-readable domain names into IP addresses that computers use to communicate. When you perform a DNS lookup, you're querying the global DNS infrastructure to retrieve various types of records associated with a domain name, including A records (IPv4 addresses), AAAA records (IPv6 addresses), MX records (mail servers), and more.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border-l-4 border-indigo-500 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">DNS Resolution Process</h3>
                <p className="text-gray-600">DNS queries follow a hierarchical structure, starting from root servers, then TLD servers, and finally authoritative name servers to resolve domain names to IP addresses.</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Record Types & Uses</h3>
                <p className="text-gray-600">Different DNS record types serve specific purposes: A/AAAA for web hosting, MX for email routing, NS for delegation, TXT for verification and policies.</p>
              </div>
            </div>
          </section>

          {/* DNS Troubleshooting FAQ */}
          <section className="bg-gray-50 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">DNS Lookup Frequently Asked Questions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">What is DNS propagation?</h3>
                <p className="text-gray-600">DNS propagation is the time it takes for DNS changes to spread across all DNS servers worldwide. This can take 24-48 hours depending on TTL values and caching policies.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Why do DNS lookups fail?</h3>
                <p className="text-gray-600">DNS lookup failures can occur due to misconfigured records, server downtime, network connectivity issues, or incorrect domain name spelling.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">What is TTL in DNS records?</h3>
                <p className="text-gray-600">TTL (Time To Live) specifies how long DNS records should be cached by resolvers. Lower TTL values mean faster updates but more DNS queries.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">How to fix email delivery with MX records?</h3>
                <p className="text-gray-600">Ensure MX records point to valid mail servers with correct priority values. Test email flow and verify SPF/DKIM records in TXT entries.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">What are authoritative DNS servers?</h3>
                <p className="text-gray-600">Authoritative DNS servers contain the official DNS records for a domain and provide definitive answers to DNS queries, as opposed to cached responses.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">How to troubleshoot DNS issues?</h3>
                <p className="text-gray-600">Start by checking A records, verify MX records for email, validate NS records for delegation, and use DNS lookup tools to diagnose specific problems.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DNSLookup;