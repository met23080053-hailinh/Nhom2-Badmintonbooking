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
        let lines = content.split('\n');
        let changed = false;
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            // Only replace if it contains bg-primary and hover:bg-ink (but not hover:bg-ink/5 or /90)
            if (line.includes('bg-primary') && line.includes('hover:bg-ink') && !line.includes('hover:bg-ink/')) {
                lines[i] = line.replace(/hover:bg-ink/g, 'hover:bg-secondary hover:text-ink');
                changed = true;
            }
        }
        if (changed) {
            fs.writeFileSync(filePath, lines.join('\n'));
            console.log('Updated: ' + filePath);
        }
    }
});
