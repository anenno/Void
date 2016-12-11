#Void  
Encrypted and secure text communication  

Message encryption is done via AES using rsakeys and publickeys.Encryption is done on client side and decryption is done client side. The only text that the server sees is an encrypted message.  

Installation Directions:  

Linux:  
1) Install nodejs on the server and npm  
  
sudo apt-get install nodejs   
sudo apt-get install nodejs-legacy   
sudo apt-get install npm   
  
2) Clone git repository into desired directory   
  
3) All dependencies should be included the repository, but to be sure run the following command from the project directory   
  
sudo npm install -d   
  
4) Install forever (If it is not already installed or you have no other way of running a program in the background)  
  
sudo npm install forever -g  
  
4) Start server   
  
By default the port it runs on is 5000. You can also add command line arguments to specifiy port (-p PORTNUMBER and debug (-d)  
  
If using forever  
  
forever server.js -p PORTNUMBER    

If not using forever and want to run in the foreground  
  
node server.js   
  
  
For HTTPS Server  
   
Cert files should be created once using the following commands on server  







