const fs = require('fs');
const path = require('path');

// Function to recursively find all .ts files in a directory
function findTsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findTsFiles(filePath, fileList);
    } else if (file.endsWith('.ts') && file.includes('route')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to remove 'use server' directive from a file
function removeUseServerDirective(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file contains 'use server'
    if (content.includes("'use server'") || content.includes('"use server"')) {
      console.log(`Fixing file: ${filePath}`);
      
      // Remove the 'use server' directive and any empty line after it
      content = content.replace(/'use server';\s*\n\s*\n/g, '');
      content = content.replace(/"use server";\s*\n\s*\n/g, '');
      content = content.replace(/'use server';\s*\n/g, '');
      content = content.replace(/"use server";\s*\n/g, '');
      
      // Write the updated content back to the file
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed file: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return false;
  }
}

// Main function
function main() {
  const apiDir = path.join(__dirname, 'app', 'api');
  const routeFiles = findTsFiles(apiDir);
  
  console.log(`Found ${routeFiles.length} route files`);
  
  let fixedCount = 0;
  
  routeFiles.forEach(file => {
    const fixed = removeUseServerDirective(file);
    if (fixed) {
      fixedCount++;
    }
  });
  
  console.log(`Fixed ${fixedCount} files`);
}

main();
