var User = require('../../../dbhelper/user_model');

module.exports = { 
	showSearchPage: function(req, res, limit, numOfCurrPage){
		if(req.query.search_term != null)
			search_term = req.query.search_term;
		else
			search_term = '';
			// console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
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
					}).sort({date_created: 'desc'})
					.skip(limit*numOfCurrPage)
					.exec(
					function(err, results){
					res.render('search', {profile: req.session.profile, results: results, numOfPeople: results.length,
						rec_topic : req.session.rec_topic, search_term: search_term, showByQuery : false, 
						popular_topic: req.session.popular_topic,
						partials: {leftSide:'leftSide', rightSide:'rightSide', topNavigation:'topNavigation'}});	
				});
			}else{
				var idForSearch = req.session.profile.connections.slice();
				idForSearch.push(req.session.profile._id);

				User.model
					.find({_id: {$nin : idForSearch} })
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
						res.render('search', {profile: req.session.profile, results: results, numOfPeople : count,
							rec_topic : req.session.rec_topic, limitPerPage : limit,  search_term: null,
						numOfLastPage: numOfLastPage, numOfCurrPage: numOfCurrPage, showByQuery : true, 
						popular_topic: req.session.popular_topic,
						partials: {leftSide:'leftSide', rightSide:'rightSide', topNavigation:'topNavigation'}});	
					});
					
				});
			}
		}else{
			res.redirect('/login');
		}
	}
}
