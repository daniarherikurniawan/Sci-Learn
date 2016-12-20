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
- server directory : cd /usr/share/Sci-Learn/
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

###Coloring
time: #618b8b

#### advanced query
User.model.findById( profile_id)
	.populate({
		path:'connections',
		select:'name email date_created',
		match: {'name': new RegExp(search_term, "i")},
		options: {
			sort: {'date_created': 'desc'},
	    	limit: 8
	    }
	})
	.exec(
	function(err, results){
		callback(results.connections)
	});
	
		Disaster.object
			.find({ $and:[
						{'_id' : { $in : data.array_id}},{

						$or:[{
							$and: [
									{ 'date_start': {'$gte': certain_date}},
									{ 'date_end': { '$lt': next_date}},
									]},{
							$and: [
								{ 'date_start': {'$lt': next_date}},
								{ $or:[ 
									{'date_end': { '$gte': certain_date}},
									{'date_end': null }]
							}]}]
						}
				]
				})
			.select({id_victims : 1, type : 1, _id: 1})
			.exec(function(err, disaster){


to know showGroupPost is false or true 
'{{showGroupPost}}'!=''



db.courses.remove({"_id" : ObjectId("585715aa350ec0922967113a")})

db.courses.updateMany({},{$set: {"course_accessibility" : "Public Course"}})

db.users.updateMany({},{$set: {"courses" : []}})

db.groups.updateMany({},{$set: {"courses_id" : []}})

db.users.find({'_id': ObjectId('576cf49b3a71b5df0510f209')}).pretty()


