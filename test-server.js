// 簡易テストサーバー
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080; // 別のポートを使用

const server = http.createServer((req, res) => {
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('File not found');
      return;
    }
    
    const ext = path.extname(filePath);
    const contentType = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css'
    }[ext] || 'text/plain';
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`
🚀 テストサーバーが起動しました！
   http://localhost:${PORT}
   
⚠️  注意: このサーバーではAPI機能は動作しません
   API機能をテストする場合は npm run dev を使用してください
  `);
});