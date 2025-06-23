// Quick test script to verify logging improvements
const express = require('express');
const morgan = require('morgan');

const app = express();
const PORT = 3001;

// Use the same custom logging format from server.js
const customMorganFormat = (tokens, req, res) => {
  const status = tokens.status(req, res);
  const method = tokens.method(req, res);
  const url = tokens.url(req, res);
  const responseTime = tokens['response-time'](req, res);
  const contentLength = tokens.res(req, res, 'content-length') || '-';
  const userAgent = tokens['user-agent'](req, res);
  const referer = tokens.referrer(req, res) || '-';
  
  const date = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  // Color codes for different status codes
  const getStatusColor = (status) => {
    const code = parseInt(status);
    if (code >= 200 && code < 300) return '\x1b[32m'; // Green for success
    if (code >= 300 && code < 400) return '\x1b[33m'; // Yellow for redirect
    if (code >= 400 && code < 500) return '\x1b[31m'; // Red for client error
    if (code >= 500) return '\x1b[35m'; // Magenta for server error
    return '\x1b[0m'; // Reset
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET': return '\x1b[36m'; // Cyan
      case 'POST': return '\x1b[32m'; // Green
      case 'PUT': return '\x1b[33m'; // Yellow
      case 'DELETE': return '\x1b[31m'; // Red
      case 'PATCH': return '\x1b[35m'; // Magenta
      default: return '\x1b[0m'; // Reset
    }
  };

  const statusColor = getStatusColor(status);
  const methodColor = getMethodColor(method);
  const reset = '\x1b[0m';

  // Get browser name from user agent
  const getBrowser = (userAgent) => {
    if (!userAgent) return 'Unknown';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Other';
  };

  const browser = getBrowser(userAgent);

  return [
    `🕐 ${date}`,
    `${methodColor}${method.padEnd(6)}${reset}`,
    `${statusColor}${status}${reset}`,
    `📄 ${contentLength.toString().padStart(6)} bytes`,
    `⚡ ${responseTime}ms`,
    `🌐 ${url}`,
    `🔗 ${referer !== '-' ? referer.replace('http://localhost:3000', 'localhost') : 'direct'}`,
    `🖥️  ${browser}`
  ].join(' │ ');
};

app.use(morgan(customMorganFormat));

app.get('/test', (req, res) => {
  res.json({ message: 'Logging test successful!' });
});

app.get('/test-304', (req, res) => {
  res.status(304).send();
});

app.listen(PORT, () => {
  console.log('\n' + '═'.repeat(60));
  console.log('🧪 Logging Test Server Started');
  console.log('═'.repeat(60));
  console.log(`🌐 Test at: http://localhost:${PORT}/test`);
  console.log(`🔄 304 Test: http://localhost:${PORT}/test-304`);
  console.log('═'.repeat(60) + '\n');
});
