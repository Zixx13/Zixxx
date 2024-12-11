const cluster = require('cluster');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
const express = require('express');
const app = express();

// Variabel untuk mengontrol status running
let isRunning = false;

// Express.js 
const ports = [4000, 3000, 5000, 8000, 8080];
let availablePortIndex = 0;

function checkPort(port) {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      server.close();
      resolve(true);
    });
    server.on('error', reject);
  });
}

async function startServer() {
  const port = ports[availablePortIndex];
  const isPortAvailable = await checkPort(port);

  if (isPortAvailable) {
    console.log('\x1b[33m%s\x1b[0m', `🌐 Port ${port} is open`);
    app.get('/', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      const data = {
        status: 'true',
        message: 'Bot Successfully Activated!',
        author: '@Tan'
      };
      const result = {
        response: data
      };
      res.send(JSON.stringify(result, null, 2));
    });
  } else {
    console.log(`Port ${port} is already in use. Trying another port...`);
    availablePortIndex++;

    if (availablePortIndex >= ports.length) {
      console.log('No more available ports. Exiting...');
      process.exit(1);
    } else {
      ports[availablePortIndex] = parseInt(port) + 1;
      startServer();
    }
  }
}

function displayRunningText() {
  const runningText = "🌟 Running Shizuka V1.2 🌟";
  const colors = ['\x1b[32m', '\x1b[34m', '\x1b[31m']; // Hijau, Biru, Merah
  let colorIndex = 0;

  const termWidth = process.stdout.columns || 80; // Lebar terminal
  const padding = Math.max(0, (termWidth - runningText.length) / 2);
  const centeredText = ' '.repeat(Math.floor(padding)) + runningText;

  const interval = setInterval(() => {
    process.stdout.write(`${colors[colorIndex]}${centeredText}\x1b[0m\r`);
    colorIndex = (colorIndex + 1) % colors.length;
  }, 333); // Ganti warna setiap 333ms

  setTimeout(() => {
    clearInterval(interval);
    console.log(`\n${centeredText}`);
  }, 3000); // Tampilkan selama 3 detik
}

function start(file) {
  if (isRunning) return;
  isRunning = true;
  //console.clear();
  const args = [path.join(__dirname, file), ...process.argv.slice(2)];
  const p = spawn(process.argv[0], args, {
    stdio: ["inherit", "inherit", "inherit", "ipc"],
  });

  p.on("message", (data) => {
    console.log('\x1b[36m%s\x1b[0m', `🟢 RECEIVED ${data}`);
    switch (data) {
      case "reset":
        p.kill();
        isRunning = false;
        start.apply(this, arguments);
        break;
      case "uptime":
        p.send(process.uptime());
        break;
    }
  });

  p.on("exit", (code) => {
    isRunning = false;
    console.error('\x1b[31m%s\x1b[0m', `Exited with code: ${code}`);
    start('index.js');

    if (code === 0) return;

    fs.watchFile(args[0], () => {
      fs.unwatchFile(args[0]);
      console.error('\x1b[31m%s\x1b[0m', `File ${args[0]} has been modified. Script will restart...`);
      start("index.js");
    });
  });

  p.on("error", (err) => {
    console.error('\x1b[31m%s\x1b[0m', `Error: ${err}`);
    p.kill();
    isRunning = false;
    console.error('\x1b[31m%s\x1b[0m', `Error occurred. Script will restart...`);
    start("index.js");
  });

  const pluginsFolder = path.join(__dirname, "node_modules");


    fs.readdir(pluginsFolder, (err, files) => {
    if (err) {
      console.error('\x1b[31m%s\x1b[0m', `Error reading verifikasi folder: ${err}`);
      return;
    }
    //console.log('\x1b[33m%s\x1b[0m', `🟡 Found ${files.length} verifikasi in folder ${pluginsFolder}`);
    try {
      require.resolve('@whiskeysockets/baileys');
     // console.log('\x1b[33m%s\x1b[0m', `🟡 Baileys library version ${require('@whiskeysockets/baileys/package.json').version} is installed`);
    } catch (e) {
      console.error('\x1b[31m%s\x1b[0m', `❌ Baileys library is not installed`);
    }
  });
   console.log('\x1b[33m%s\x1b[0m', `🌟 Shizuka V1.2 `);
   console.log('\x1b[33m%s\x1b[0m', `🌟 Github :Tanmyname `);
  const ramInGB = os.totalmem() / (1024 * 1024 * 1024);
  console.log(`🌟 \x1b[33mTotal RAM: ${ramInGB.toFixed(2)} GB \x1b[0m`);
  const freeRamInGB = os.freemem() / (1024 * 1024 * 1024);
  console.log(`🌟 \x1b[33mFree RAM: ${freeRamInGB.toFixed(2)} GB \x1b[0m`);
  console.log('\x1b[33m%s\x1b[0m', `🌟 Creator @Tan  `);
      const tmpDir = './tmp';
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir);
  console.log('\x1b[33m%s\x1b[0m', `📁 Created directory ${tmpDir}`);
}

  setInterval(() => {}, 1000);
}

displayRunningText();
setTimeout(() => {
  start("index.js");
}, 3000);


process.on('unhandledRejection', (reason) => {
  console.error('\x1b[31m%s\x1b[0m', `Unhandled promise rejection: ${reason}`);
  console.error('\x1b[31m%s\x1b[0m', 'Unhandled promise rejection. Script will restart...');
  start('index.js');
});

process.on('exit', (code) => {
  console.error(`Exited with code: ${code}`);
  console.error('Script will restart...');
  start('index.js');
});
