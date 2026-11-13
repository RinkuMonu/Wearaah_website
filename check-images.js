const fs = require('fs');
const path = require('path');

function getFiles(dir, exts = ['.jsx', '.js']) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath, exts));
    } else {
      if (exts.includes(path.extname(fullPath))) results.push(fullPath);
    }
  });
  return results;
}

const files = getFiles('src');
const imageRegex = /['"](\/(?:images?|logo)\/[^'"><\s]+)['"]/g;
const foundPaths = new Set();
const missingPaths = new Map();

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  let match;
  while ((match = imageRegex.exec(content)) !== null) {
    const imgPath = match[1];
    foundPaths.add(imgPath);
    const cleanPath = imgPath.replace(/^\//, '');
    const publicTarget = path.join('public', cleanPath);
    if (!fs.existsSync(publicTarget)) {
      if (!missingPaths.has(imgPath)) missingPaths.set(imgPath, []);
      missingPaths.get(imgPath).push(f);
    }
  }
});

console.log('Total unique image paths found in src:', foundPaths.size);
console.log('Missing image paths count:', missingPaths.size);
for (const [img, occurrences] of missingPaths.entries()) {
  console.log('MISSING:', img, 'in', occurrences.join(', '));
}

