Database configuration:
- open file app.js
- in line 18th (var url = 'mongodb://localhost:27017/studybook';), change the address of mongoDB that is used. studybook is the name of db. This link (http://www.tutorialspoint.com/mongodb/mongodb_quick_guide.htm) provides a general knowledge about mongodb. The address localhost:27017 is a default from the installation. 
- you should specify the db name. 
- the app will create automatically necessary tables/collections as needed when the system is running
- install npm using apt-get or yum
- npm install
installing npm and Node.js please refers this link https://docs.npmjs.com/getting-started/installing-node


Start the project:
```
sudo nodemon --watch controller/ --watch dbconfig/ --watch dbhelper/  --watch routes/ --watch app.js
```
if crashed, remove nodemon at usr/bin/nodemon
reinstall sudo npm install nodemon -g in the directory of StudyBook
node --max-old-space-size=8192 server.js 
sudo fuser -k 8000/tcp
kill -9 16941

open in browser : http://localhost:8000/
to stop : ctrl + c

note:
- highly reccommended for using Linux based OS since most of the tutorials are using terminal / cmd.

update server:
- git clean -f -n


for Daniar:
- server directory : cd /usr/share/sci-Learn/
- admin page: http://www.sci-learn.com/agent/login
- server : pm2 status
			pm2 www restart

If error:

pm2 restart www
pm2 show www
pm2 logs www

ss -nlp | grep 8000
sudo kill -9 27252


finally:
pm2 start bin/www 


migrate database using dumb instead