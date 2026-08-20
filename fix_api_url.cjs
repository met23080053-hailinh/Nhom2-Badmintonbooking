const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        if (fs.statSync(dirPath).isDirectory()) {
            walkDir(dirPath, callback);
        } else {
            callback(dirPath);
        }
    });
}

walkDir('frontend/src', function(filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content
            // Replace 'http://localhost:8000/...' with `http://${window.location.hostname}:8000/...`
            .replace(/'http:\/\/localhost:8000\/([^']+)'/g, '`http://${window.location.hostname}:8000/$1`')
            // Replace "http://localhost:8000/..." with `http://${window.location.hostname}:8000/...`
            .replace(/"http:\/\/localhost:8000\/([^"]+)"/g, '`http://${window.location.hostname}:8000/$1`')
            // Replace `http://localhost:8000/...` with `http://${window.location.hostname}:8000/...`
            .replace(/`http:\/\/localhost:8000\/([^`]+)`/g, '`http://${window.location.hostname}:8000/$1`');
            
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent);
            console.log('Fixed API URLs in: ' + filePath);
        }
    }
});
