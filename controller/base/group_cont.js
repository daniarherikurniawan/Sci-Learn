// var Post = require('../../dbhelper/post_model');
var User = require('../../dbhelper/user_model');
var Group = require('../../dbhelper/group_model');
// var Chat = require('../../dbhelper/chat_model');
// var async = require("async");


module.exports = {

	get_by_id: function(id, res){
		Group.object
			.findById(id)
			.exec(function(err, Group){
				if (err) {
					response.setFailedResponse(res, err);
				} else {
					response.setSucceededResponse(res, Group);
				}
				return ;
		})
	},

    get_all_list: function(user_id, res){
					console.log(user_id)
        User.object.findById(user_id)
            .select('groups')
            .populate({
					path:'groups',
					select:'group_name'
					// options: {
				 //    	limit: 8
				 //    }
				})
            .exec(function(err, user_data){
				if (err) {
					response.setFailedResponse(res, "failed");
				} else {
					response.setSucceededResponse(res, user_data.groups);
				}
                return ;
            })
    },

    get_group_by_id: function(user_id, res){
        Group.object
            .find()
            .select('group_name')
            .exec(function(err, all_Group){
				if (err) {
					response.setFailedResponse(res, err);
				} else {
					response.setSucceededResponse(res, all_Group);
				}
                return ;
            })
    },

	delete: function(Group_email, res){
		Group.object.remove({Group_email: Group_email}, function(err) {
			if (err) {
				response.setFailedResponse(res, err);
			} else {
				response.setSucceededResponse(res, Group_email + " has been deleted");
			}
		})
	},

	createGroup: function(req, res){
		var GroupObj = new Group.model(req);
	 	// res.send("lcdcdc "+GroupObj)
	    GroupObj.save(function(err){
			if (err) {
				response.setFailedResponse(res, err);
			} else {
				response.setSucceededResponse(res, "Group has been created");
			}
			return ;
		});
	},

	update: function(req, res){
		Group.object.findOneAndUpdate({_id: req.id},
			req,
			{upsert:true}, 
			function(err){
				if (err) {
					response.setFailedResponse(res, err);
				} else {
					response.setSucceededResponse(res, req.id + " has been updated");
				}
	  	});
	}
}

