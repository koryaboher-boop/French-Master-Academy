/**
 * خادم محلي لتشغيل «أكاديمية إتقان الفرنسية» على الجهاز والشبكة المحلية
 * French Master Academy — Local & Hotspot Web Server (V1.0)
 * لا يحتاج أي تثبيت — يكفي وجود Node.js:  node server.js
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

const APP_DIR = __dirname;
const DEFAULT_PORT = 3000;
const isSilent = process.argv.includes('--silent');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.otf': 'font/otf',
  '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.txt': 'text/plain; charset=utf-8', '.pdf': 'application/pdf'
};

function getNetworkAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  const virtualRegex = /(virtual|vbox|vmware|vethernet|hyper-v|wsl|loopback)/i;
  for (const name of Object.keys(interfaces)) {
    if (virtualRegex.test(name)) continue;
    for (const netInfo of interfaces[name]) {
      if (netInfo.family === 'IPv4' && !netInfo.internal) addresses.push({ iface: name, ip: netInfo.address });
    }
  }
  if (addresses.length === 0) {
    for (const name of Object.keys(interfaces)) {
      for (const netInfo of interfaces[name]) {
        if (netInfo.family === 'IPv4' && !netInfo.internal) addresses.push({ iface: name, ip: netInfo.address });
      }
    }
  }
  return addresses;
}

function openBrowser(url) {
  const startCmd = process.platform === 'win32' ? `start "" "${url}"` :
                   process.platform === 'darwin' ? `open "${url}"` : `xdg-open "${url}"`;
  exec(startCmd, (err) => {
    if (err && !isSilent) console.log(`[!] تعذر فتح المتصفح تلقائياً: ${err.message}`);
  });
}

function createServer(port) {
  const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

    let decodedUrl;
    try { decodedUrl = decodeURIComponent(req.url.split('?')[0]); }
    catch { decodedUrl = req.url.split('?')[0]; }

    let filePath = path.join(APP_DIR, decodedUrl === '/' ? 'index.html' : decodedUrl);
    if (!filePath.startsWith(APP_DIR)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('ممنوع الوصول');
      return;
    }

    fs.stat(filePath, (err, stats) => {
      if (err) {
        // SPA fallback
        if (!path.extname(decodedUrl) || decodedUrl.startsWith('/#')) {
          fs.readFile(path.join(APP_DIR, 'index.html'), (err2, data) => {
            if (err2) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('الملف غير موجود'); return; }
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
          });
          return;
        }
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('الملف غير موجود: ' + decodedUrl);
        return;
      }
      if (stats.isDirectory()) filePath = path.join(filePath, 'index.html');

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      const range = req.headers.range;

      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
        if (start >= stats.size) { res.writeHead(416, { 'Content-Range': `bytes */${stats.size}` }); res.end(); return; }
        const chunksize = (end - start) + 1;
        fs.createReadStream(filePath, { start, end }).pipe(res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${stats.size}`,
          'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': contentType,
        }));
      } else {
        res.writeHead(200, {
          'Content-Length': stats.size, 'Content-Type': contentType, 'Accept-Ranges': 'bytes',
          'Cache-Control': ['.html', '.js', '.webmanifest'].includes(ext) ? 'no-cache' : 'public, max-age=31536000'
        });
        fs.createReadStream(filePath).pipe(res);
      }
    });
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      if (!isSilent) console.log(`[!] المنفذ ${port} مشغول، جاري تجربة المنفذ ${port + 1}...`);
      createServer(port + 1);
    } else if (!isSilent) console.error('[!] خطأ في السيرفر:', err);
  });

  server.listen(port, '0.0.0.0', () => {
    const localUrl = `http://localhost:${port}`;
    const netAddrs = getNetworkAddresses();
    if (!isSilent) {
      console.log('\n' + '='.repeat(66));
      console.log('   🚀  أكاديمية إتقان الفرنسية — تعمل الآن على جهازك (V1.0)');
      console.log('='.repeat(66));
      console.log('   📌 المحتوى: 6 مستويات (A0→C1) · 61 مساراً · 225 درساً · 582 فيديو موثّق');
      console.log('   📝 1800 تمرينًا تفاعليًا · 2934 مفردة وبطاقة مع مراجعة ذكية');
      console.log('-'.repeat(66));
      console.log(`\n   💻 [1] رابط هذا الجهاز:\n       👉  ${localUrl}\n`);
      if (netAddrs.length > 0) {
        console.log('   📱 [2] رابط الهوت سبوت / الواي فاي (للهواتف المتصلة بنفس الشبكة):');
        for (const item of netAddrs) console.log(`       👉  http://${item.ip}:${port}   [${item.iface}]`);
        console.log('\n   💡 افتح الرابط من أي هاتف متصل بنفس الشبكة!');
      }
      console.log('\n   📴 ملاحظة: الفيديوهات التعليمية مدمجة من يوتيوب وتحتاج إنترنت،');
      console.log('      وباقي التطبيق كله (الدروس والتمارين والمراجعة) يعمل دون إنترنت.');
      console.log('\n   اضغط [Ctrl + C] لإيقاف السيرفر في أي وقت.');
      console.log('='.repeat(66) + '\n');
    }
    openBrowser(localUrl);
  });
}

createServer(DEFAULT_PORT);
