const CyberPatterns = {
    categories: [
        'Network',
        'Security',
        'Web',
        'Forensics',
        'Logs',
        'Malware',
        'CTF'
    ],
    
    patterns: {
        'Network': [
            {
                name: 'IPv4 Address',
                pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
                description: 'Matches valid IPv4 addresses',
                example: '192.168.1.1'
            },
            {
                name: 'IPv6 Address',
                pattern: '(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))',
                description: 'Matches valid IPv6 addresses',
                example: '2001:0db8:85a3:0000:0000:8a2e:0370:7334'
            },
            {
                name: 'MAC Address',
                pattern: '(?:[0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2}',
                description: 'Matches MAC addresses with : or - separator',
                example: '00:1B:44:11:3A:B7'
            },
            {
                name: 'Port Number',
                pattern: '\\b(?:6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{0,3})\\b',
                description: 'Matches valid port numbers (1-65535)',
                example: '8080'
            },
            {
                name: 'CIDR Notation',
                pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\/(?:3[0-2]|[12]?[0-9])\\b',
                description: 'Matches IP addresses with CIDR subnet',
                example: '192.168.0.0/24'
            }
        ],
        'Security': [
            {
                name: 'Email Address',
                pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
                description: 'Matches email addresses',
                example: 'user@example.com'
            },
            {
                name: 'URL',
                pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)',
                description: 'Matches HTTP/HTTPS URLs',
                example: 'https://example.com/path'
            },
            {
                name: 'MD5 Hash',
                pattern: '\\b[a-fA-F0-9]{32}\\b',
                description: 'Matches MD5 hash values',
                example: '5d41402abc4b2a76b9719d911017c592'
            },
            {
                name: 'SHA-1 Hash',
                pattern: '\\b[a-fA-F0-9]{40}\\b',
                description: 'Matches SHA-1 hash values',
                example: 'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d'
            },
            {
                name: 'SHA-256 Hash',
                pattern: '\\b[a-fA-F0-9]{64}\\b',
                description: 'Matches SHA-256 hash values',
                example: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae'
            },
            {
                name: 'Base64 String',
                pattern: '(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?',
                description: 'Matches Base64 encoded strings',
                example: 'VGhpcyBpcyBhIHRlc3Q='
            },
            {
                name: 'JWT Token',
                pattern: 'eyJ[A-Za-z0-9-_=]+\\.eyJ[A-Za-z0-9-_=]+\\.[A-Za-z0-9-_.+/=]+',
                description: 'Matches JSON Web Tokens',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
        ],
        'Web': [
            {
                name: 'HTML Tags',
                pattern: '<\\/?[a-z][^>]*>',
                description: 'Matches HTML tags',
                example: '<div class="container">'
            },
            {
                name: 'SQL Injection',
                pattern: '(\'|\\"|\\`)(\\s)*(or|and|union|select|insert|update|delete|drop|create)(\\s)*(\'|\\"|\\`|\\(|=)',
                description: 'Basic SQL injection pattern detection',
                example: '\' OR \'1\'=\'1'
            },
            {
                name: 'XSS Pattern',
                pattern: '<(script|img|svg|iframe)[^>]*>.*?<\\/(script|img|svg|iframe)>|on\\w+\\s*=\\s*["\'].*?["\']',
                description: 'Detects potential XSS patterns',
                example: '<script>alert("XSS")</script>'
            },
            {
                name: 'HTTP Headers',
                pattern: '^[A-Za-z-]+:\\s*.+$',
                description: 'Matches HTTP header lines',
                example: 'Content-Type: application/json'
            },
            {
                name: 'Cookie Value',
                pattern: '([a-zA-Z0-9_]+)=([^;]+)',
                description: 'Matches cookie key-value pairs',
                example: 'session_id=abc123def456'
            }
        ],
        'Forensics': [
            {
                name: 'Windows Path',
                pattern: '[A-Za-z]:\\\\(?:[^\\\\/:*?"<>|\\r\\n]+\\\\)*[^\\\\/:*?"<>|\\r\\n]*',
                description: 'Matches Windows file paths',
                example: 'C:\\Users\\Admin\\Documents\\file.txt'
            },
            {
                name: 'Unix Path',
                pattern: '\\/(?:[^\\/ ]+\\/)*[^\\/ ]+',
                description: 'Matches Unix/Linux file paths',
                example: '/home/user/documents/file.txt'
            },
            {
                name: 'Registry Key',
                pattern: 'HKEY_[A-Z_]+(?:\\\\[^\\\\]+)*',
                description: 'Matches Windows registry keys',
                example: 'HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft'
            },
            {
                name: 'File Extension',
                pattern: '\\.[a-zA-Z0-9]{1,4}$',
                description: 'Matches file extensions',
                example: '.exe'
            },
            {
                name: 'Process ID',
                pattern: '\\bPID:\\s*\\d+\\b',
                description: 'Matches process IDs in logs',
                example: 'PID: 1234'
            }
        ],
        'Logs': [
            {
                name: 'Apache Log Entry',
                pattern: '^(\\S+) \\S+ \\S+ \\[(\\d{2}\\/\\w{3}\\/\\d{4}:\\d{2}:\\d{2}:\\d{2} [+-]\\d{4})\\] "(\\S+) (\\S+) (\\S+)" (\\d{3}) (\\d+|-)(.*)$',
                description: 'Matches Apache combined log format',
                example: '192.168.1.1 - - [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326'
            },
            {
                name: 'Syslog Entry',
                pattern: '^(\\w{3}\\s+\\d{1,2}\\s+\\d{2}:\\d{2}:\\d{2})\\s+(\\S+)\\s+(\\S+)(?:\\[(\\d+)\\])?:\\s*(.*)$',
                description: 'Matches syslog format entries',
                example: 'Oct 10 13:55:36 hostname sshd[1234]: Connection from 192.168.1.1'
            },
            {
                name: 'Timestamp ISO 8601',
                pattern: '\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d{3})?(?:Z|[+-]\\d{2}:\\d{2})',
                description: 'Matches ISO 8601 timestamps',
                example: '2023-10-15T14:30:00.000Z'
            },
            {
                name: 'Log Level',
                pattern: '\\b(DEBUG|INFO|WARN|WARNING|ERROR|FATAL|TRACE)\\b',
                description: 'Matches common log levels',
                example: 'ERROR'
            }
        ],
        'Malware': [
            {
                name: 'Hex String',
                pattern: '\\b0x[a-fA-F0-9]+\\b',
                description: 'Matches hexadecimal values',
                example: '0xDEADBEEF'
            },
            {
                name: 'PE Header',
                pattern: 'MZ[\\x00-\\xFF]{58}PE\\x00\\x00',
                description: 'Matches PE executable header',
                example: 'MZ...PE\\x00\\x00'
            },
            {
                name: 'Suspicious Strings',
                pattern: '(cmd\\.exe|powershell\\.exe|wscript\\.exe|cscript\\.exe|mshta\\.exe|rundll32\\.exe)',
                description: 'Common malware process names',
                example: 'powershell.exe'
            },
            {
                name: 'Bitcoin Address',
                pattern: '\\b[13][a-km-zA-HJ-NP-Z1-9]{25,34}\\b',
                description: 'Matches Bitcoin addresses',
                example: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
            },
            {
                name: 'Domain Generation Algorithm',
                pattern: '[a-z]{6,12}\\.(com|net|org|info|biz)',
                description: 'Matches DGA-like domain patterns',
                example: 'xyzabc.com'
            }
        ],
        'CTF': [
            {
                name: 'Flag Format',
                pattern: 'flag\\{[^}]+\\}',
                description: 'Common CTF flag format',
                example: 'flag{this_is_a_flag}'
            },
            {
                name: 'Base32 String',
                pattern: '[A-Z2-7]+=*',
                description: 'Matches Base32 encoded strings',
                example: 'JBSWY3DPEBLW64TMMQ======'
            },
            {
                name: 'Hex Dump Line',
                pattern: '^[0-9a-f]{8}:\\s+(?:[0-9a-f]{2}\\s+){1,16}\\s+.*$',
                description: 'Matches hex dump format lines',
                example: '00000000: 48 65 6c 6c 6f 20 57 6f 72 6c 64  Hello World'
            },
            {
                name: 'ASCII Printable',
                pattern: '[\\x20-\\x7E]+',
                description: 'Matches printable ASCII characters',
                example: 'Hello World!'
            },
            {
                name: 'ROT13 Pattern',
                pattern: '[a-zA-Z]{4,}',
                description: 'Potential ROT13 encoded text',
                example: 'Uryyb Jbeyq'
            }
        ]
    },
    
    getPatternsByCategory(category) {
        return this.patterns[category] || [];
    },
    
    getAllCategories() {
        return this.categories;
    },
    
    searchPatterns(query) {
        const results = [];
        const lowerQuery = query.toLowerCase();
        
        for (const category in this.patterns) {
            this.patterns[category].forEach(pattern => {
                if (pattern.name.toLowerCase().includes(lowerQuery) || 
                    pattern.description.toLowerCase().includes(lowerQuery)) {
                    results.push({
                        ...pattern,
                        category
                    });
                }
            });
        }
        
        return results;
    }
};

// Make CyberPatterns globally accessible
window.CyberPatterns = CyberPatterns;