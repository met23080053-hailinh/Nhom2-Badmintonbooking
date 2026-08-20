const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('frontend/src', function(filePath) {
    if (filePath.endsWith('.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Add backdrop-blur-sm if it's not already there
        let newContent = content.replace(/bg-black\/50(?!\s+backdrop-blur)/g, 'bg-black/50 backdrop-blur-sm');
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent);
            console.log('Added blur to overlay in: ' + filePath);
        }
    }
});
