var User = require('../../../dbhelper/user_model');

module.exports = { 
	showSearchPage: function(req, res,search_term, limit, numOfCurrPage){
		limit = parseInt(limit);
		numOfCurrPage = parseInt(numOfCurrPage);
		if(req.session.profile!=null){
			if(search_term != ''){
				var idForSearch = req.session.profile.connections.slice();
				idForSearch.push(req.session.profile._id);
				User.model.find({
						$and: [
							{ name: new RegExp(search_term, "i")},
							{_id: {$nin : idForSearch}}
						]
					})
					.select('name email education img_profile_name activeness occupation')
					.sort({date_created: 'desc'})
					.skip(limit*numOfCurrPage)
					.limit(limit)
					.exec(
					function(err, results){
					if(err)
						console.log(err)
					User.model.find({
							$and: [
								{ name: new RegExp(search_term, "i")},
								{_id: {$nin : idForSearch}}
							]
						}).count(function(err, count){
						numOfLastPage = Math.ceil(count/limit);
						numOfCurrPage =  numOfCurrPage	
						res.render('search', {profile: req.session.profile, list_user: results, numOfPeople : count,
							rec_topic : req.session.rec_topic, limitPerPage : limit,  search_term: search_term,
						numOfLastPage: numOfLastPage, numOfCurrPage: numOfCurrPage, showByQuery : true, 
						 search_page :true, setting: req.session.setting,
						popular_topic: req.session.popular_topic,
						partials: {leftSide:'partial/leftSide', rightSide:'partial/rightSide', list_user:'partial/list_user',
						create_group_modal: 'modal/create_group_modal',
						list_group:'partial/list_group', topNavigation:'partial/topNavigation'}});	
					});
				});
			}else{
				var idForSearch = req.session.profile.connections.slice();
				idForSearch.push(req.session.profile._id);

				User.model
					.find({_id: {$nin : idForSearch} })
					.select('name email education img_profile_name activeness occupation')
					.sort({date_created: 'desc'})
					.skip(limit*numOfCurrPage)
					.limit(limit)
					.exec(
					function(err, results){
					if(err)
						console.log(err)

					User.model.count({}, function( err, count){
						count = count -1 -req.session.profile.connections.length;
						numOfLastPage = Math.ceil(count/limit);
						numOfCurrPage =  numOfCurrPage	
						res.render('search', {profile: req.session.profile, list_user: results, numOfPeople : count,
							rec_topic : req.session.rec_topic, limitPerPage : limit,  search_term: null,
						numOfLastPage: numOfLastPage, numOfCurrPage: numOfCurrPage, showByQuery : true, 
						 search_page :true, setting: req.session.setting,
						popular_topic: req.session.popular_topic,
						partials: {leftSide:'partial/leftSide', rightSide:'partial/rightSide', list_user:'partial/list_user',
						create_group_modal: 'modal/create_group_modal',
						list_group:'partial/list_group', topNavigation:'partial/topNavigation'}});	
					});
					
				});
			}
		}else{
			res.redirect('/login');
		}
	}
}
