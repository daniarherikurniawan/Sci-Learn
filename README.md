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

nginx config file on: /etc/nginx/conf.d/node-app.conf
service nginx reload


jenkins config file on: /etc/sysconfig/jenkins (to edit JENKINS_ARGS if needed )
/etc/init.d/jenkins restart
link jenkins on http://www.sci-learn.com:8080/
/var/lib/jenkins/secrets/initialAdminPassword



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


585970b6afb0b7bb60126fa4
db.courses.remove({"_id" : ObjectId("5857ff1fecc671d91543e177")})

db.courses.updateMany({},{$set: {"course_accessibility" : "Public Course"}})

db.users.updateMany({},{$set: {"courses" : []}})

db.groups.updateMany({},{$set: {"courses_id" : []}})

db.users.find({'_id': ObjectId('576cf49b3a71b5df0510f209')}).pretty()

db.groups.update({"group_name": "HMIF ITB 2012"},{$set: {"courses_id" :[ObjectId("585970b6afb0b7bb60126fa4")]}})

db.groups.find({"group_name": "HMIF ITB 2012"}).pretty()

db.course.updateMany({},{$set: {"course_materials" : null}})

window.encodeURIComponent(
)

  function sendRequest(){
    alert("lolo")
     var http = new XMLHttpRequest();
    http.open("POST", "/course/material/addWeeklyMaterial", true);
    http.setRequestHeader("Content-type","application/json; charset=utf-8");
    var params = JSON.stringify(data_json_material);
    http.send((params));
    http.onload = function() {
      result = JSON.parse(http.responseText);
      if(http.responseText=="404" || result.status == 0){
        alert(http.responseText);
      }else{
        alert(result)
      }
    }
  }


db.users.find({awards: {$elemMatch: {award:'National Medal', year:1975}}})


Course.object.findOne({'weekly_materials._id': week_id},  {_id: 0, 'weekly_materials.$': 1})
					.populate('weekly_materials.materials')
					.exec( function(err, course_data){
						if(err || course_data == null){
							console.log(err);
							res.send("404");
						}else{
							console.log(course_data)
							req.session.weekly_material = course_data.weekly_materials[0];



            if(result[i].group_name.length >= 25){
               group_list_name += result[i].group_name.substring(0, 24)+"...";
              // document.write("cdsc")
            }else{
                group_list_name += result[i].group_name;
            }


.populate( {
				    path: 'record_medical_facilities.id_medical_facility',
				    model: MedicalFacility.object
				    // ,select: 'name'
				  })
			.populate( {
				    path: 'is_refugee.record_refugee_camps.id_refugee_camp',
				    model: RefugeeCamp.object
				    // ,select: 'name'
				  })