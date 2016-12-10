# Void
Encrypted and secure text communication

Message encryption is done via AES using rsakeys and publickeys.Encryption is done on client side and decryption is done client side. The only text that the server sees is an encrypted message.


Installation Directions:

Linux Server:
1) Install nodejs on the server
sudo apt-get install nodejs
sudo apt-get install nodejs-legacy
2) Clone git repository into desired directory
3) All dependencies should be included the repository, but to be sure run the following command from the project directory
sudo apt-get install npm
npm install -d
4) Start server - by default the port it runs on is 5000. You can also add command line arguments to specifiy port (-p PORTNUMBER and debug (-d)
node server.js




