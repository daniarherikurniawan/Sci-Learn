function highlightDiscussionInput(){
	$("div#main").animate({ scrollTop: 0 }, "slow");
	$('textarea#title').focus();

}

if (numOfPost != 0){
	document.getElementById('statePage').innerHTML = '';
}