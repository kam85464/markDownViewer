const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const filePath = path.join(__dirname, 'public/offline.html');

try {
  let html = fs.readFileSync(filePath, 'utf8');

  const getHash = (content) => {
    return crypto.createHash('sha256').update(content).digest('base64');
  };

  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);

  let styleHash = '';
  let scriptHash = '';

  if (styleMatch) {
    styleHash = `'sha256-${getHash(styleMatch[1])}'`;
    console.log('Calculated Style Hash:', styleHash);
  }

  if (scriptMatch) {
    scriptHash = `'sha256-${getHash(scriptMatch[1])}'`;
    console.log('Calculated Script Hash:', scriptHash);
  }

  const newCsp = `default-src 'self'; style-src 'self' ${styleHash}; script-src 'self' ${scriptHash};`;
  const cspRegex = /<meta http-equiv="Content-Security-Policy" content=".*?" \/>/;

  if (html.match(cspRegex)) {
    html = html.replace(cspRegex, `<meta http-equiv="Content-Security-Policy" content="${newCsp}" />`);
    fs.writeFileSync(filePath, html);
    console.log('✅ Successfully updated public/offline.html with secure CSP hashes.');
  } else {
    console.error('❌ Could not find CSP meta tag in offline.html');
  }
} catch (err) {
  console.error('Error securing offline.html:', err);
  process.exit(1);
}