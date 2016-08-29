function randomIntFromIntervalFunc(min,max){
	    return Math.floor(Math.random()*(max-min+1)+min);
	}

module.exports = { 
	addUniqueObj: function(idObj, arrayUniqueObj){
	  index = -1;
	  for (var i = arrayUniqueObj.length - 1; index == -1 && i >= 0; i--) {
	    if(idObj == arrayUniqueObj[i].id){
	      index = i;
	    }
	  };
	  if(index == -1){
	    newObj = new Object();
	      newObj.id = idObj;
	      newObj.num = 1;
	    arrayUniqueObj.push(newObj);
	  }else{
	    arrayUniqueObj[index].num++;
	  }

	  return arrayUniqueObj;
	},
	
	removeUniqueObj: function(idObj, arrayUniqueObj){
	  index = -1;
	  for (var i = arrayUniqueObj.length - 1; index == -1 && i >= 0; i--) {
	    if(idObj == arrayUniqueObj[i].id){
	      index = i;
	    }
	  };
	  
	  if(index == -1){
	    console.log(idObj+" ERORRRRRRRRRRRRRRRRRRRRRRRR!!!!! "+index+" ====================== "+arrayUniqueObj);
	  }else{
	    arrayUniqueObj[index].num--;
	  }

	  if(arrayUniqueObj[index].num == 0)
	    arrayUniqueObj.splice(index, 1);

	  return arrayUniqueObj;
	},

	randomIntFromInterval : function(min,max){
	    return randomIntFromIntervalFunc(min,max);
	},
	
	randomChars : function(num){
	    var chars = "";
	    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
	    for( var i=0; i < num; i++ )
	        chars += possible.charAt(Math.floor(Math.random() * possible.length));
	    return chars;
	},

	randomImageBorderColor: function(){
	  return {r: randomIntFromIntervalFunc(0,255),g: randomIntFromIntervalFunc(0,255),
	    b: randomIntFromIntervalFunc(0,255),r: randomIntFromIntervalFunc(0,100)};
	},

	createToken: function(){
	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	    for( var i=0; i < 15; i++ )
	        text += possible.charAt(Math.floor(Math.random() * possible.length));
	    return text;
	}
}