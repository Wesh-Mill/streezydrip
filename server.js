const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const server = http.createServer((req, res) => {
    // Default to index.html for root
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(__dirname, filePath);

    // Security: prevent directory traversal
    if (!filePath.startsWith(path.join(__dirname))) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 - File Not Found');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 - Server Error');
            }
        } else {
            // Detect content type
            let contentType = 'text/html';
            if (filePath.endsWith('.js')) contentType = 'application/javascript';
            if (filePath.endsWith('.css')) contentType = 'text/css';
            if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) contentType = 'image/jpeg';
            if (filePath.endsWith('.png')) contentType = 'image/png';
            if (filePath.endsWith('.gif')) contentType = 'image/gif';

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log(`
    ✅ Serveur HTML lancé sur http://localhost:${PORT}
    
    Ouvre ton navigateur et va à:
    👉 http://localhost:${PORT}
    `);
});
