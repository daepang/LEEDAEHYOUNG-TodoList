const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const apiDir = path.join(__dirname, '../src/app/api');
const backupDir = path.join(__dirname, '../src/api-backup');

function moveDir(src, dest) {
    if (fs.existsSync(src)) {
        fs.renameSync(src, dest);
    }
}

try {
    // 1. Move API folder to backup to avoid export errors
    console.log('Moving API folder to backup...');
    moveDir(apiDir, backupDir);

    // 2. Run Next.js build with ELECTRON_BUILD env
    console.log('Running Next.js build...');
    execSync('cross-env ELECTRON_BUILD=true next build', { stdio: 'inherit' });

    // 3. Compile Electron main process
    console.log('Compiling Electron...');
    execSync('tsc -p electron', { stdio: 'inherit' });

    // 4. Package with electron-builder
    console.log('Packaging with electron-builder...');
    execSync('electron-builder', { stdio: 'inherit' });

} catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
} finally {
    // 5. Restore API folder regardless of success/failure
    console.log('Restoring API folder...');
    moveDir(backupDir, apiDir);
}
