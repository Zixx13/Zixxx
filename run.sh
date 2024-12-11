#!/bin/bash
echo "system :"; termux-setup-storage 
echo "system :"; pkg update -y && pkg upgrade -y
echo "system :"; pkg install libwebp -y
echo "system :"; unzip node_modules.zip
echo "system :"; pkg install nodejs -y
echo "system :"; pkg install python3 -y
echo "system :"; pkg install ffmpeg -y
echo "system :"; pkg install imagemagick -y
echo "system :"; pkg install yarn 
echo "system :"; yarn install 
echo "system :"; npm start
