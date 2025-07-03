const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// .env.localファイルを読み込む
require('dotenv').config({ path: '.env.local' });

const PORT = 3000;

// APIハンドラーをインポート
const geminiHandler = require('./api/gemini.js').default;
const elevenLabsHandler = require('./api/elevenlabs.js').default;
const openAIHandler = require('./api/openai.js').default;

// MIMEタイプの設定
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // APIリクエストの処理
  if (pathname.startsWith('/api/')) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    // リクエストボディを読み取る
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        req.body = body ? JSON.parse(body) : {};
        
        // 環境変数をprocessに設定
        process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        process.env.ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
        process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY;

        // モックのres objectを作成
        const mockRes = {
          statusCode: 200,
          headers: {},
          setHeader: (key, value) => {
            mockRes.headers[key] = value;
          },
          status: (code) => {
            mockRes.statusCode = code;
            return mockRes;
          },
          json: (data) => {
            res.writeHead(mockRes.statusCode, {
              'Content-Type': 'application/json',
              ...mockRes.headers
            });
            res.end(JSON.stringify(data));
          },
          end: () => {
            res.writeHead(mockRes.statusCode, mockRes.headers);
            res.end();
          }
        };

        // APIハンドラーを呼び出す
        switch (pathname) {
          case '/api/gemini':
            await geminiHandler(req, mockRes);
            break;
          case '/api/elevenlabs':
            await elevenLabsHandler(req, mockRes);
            break;
          case '/api/openai':
            await openAIHandler(req, mockRes);
            break;
          default:
            res.writeHead(404);
            res.end('API endpoint not found');
        }
      } catch (error) {
        console.error('API error:', error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    });
    return;
  }

  // 静的ファイルの処理
  if (pathname === '/') {
    pathname = '/index.html';
  }

  const filePath = path.join(__dirname, pathname);
  const extname = path.extname(filePath);
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(500);
        res.end('Server error: ' + error.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`
🚀 ローカルサーバーが起動しました！
   http://localhost:${PORT}

📝 APIエンドポイント:
   - POST /api/gemini
   - POST /api/elevenlabs  
   - POST /api/openai

🔑 環境変数:
   - GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? '設定済み' : '未設定'}
   - ELEVENLABS_API_KEY: ${process.env.ELEVENLABS_API_KEY ? '設定済み' : '未設定'}
   - OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? '設定済み' : '未設定'}

⚡ Ctrl+C で停止
  `);
});