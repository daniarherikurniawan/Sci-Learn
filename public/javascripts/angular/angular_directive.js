var $app = angular.module("myApp", ['ngAnimate','ui.router','ui.bootstrap']);

$app.filter('searchFor', function(){
    return function(arr, searchString){
        if(!searchString){
            return arr;
        }
        var result = [];
        searchString = searchString.toLowerCase();
        angular.forEach(arr, function(item){
            if(item.title.toLowerCase().indexOf(searchString) !== -1){
            result.push(item);
        }
        });
        return result;
    };
});

$app.filter('searchForName', function(){
    return function(arr, searchString){
        if(!searchString){
            return arr;
        }
        var result = [];
        searchString = searchString.toLowerCase();
        angular.forEach(arr, function(possibleItem){
            if(possibleItem.name.toLowerCase().indexOf(searchString) !== -1){
            result.push(possibleItem);
        }
        });
        return result;
    };
});