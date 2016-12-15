module.exports = {
    setSucceededResponse: function(response, data) {
        var body = {
            "status": 1,
            "message": data
        };
        response.status(201).send(body);
    },

    setFailedResponse: function(response, message) {
        var body = {
            "status": 0,
            "message": message
        };

        response.status(500).send(body);
    }
}


/*error like*/
// /home/daniar/documents/Sci-Learn/controller/base/response_cont.js:8
//         response.status(201).send(body);
//                  ^
/*because the res is not object*/
// response function (result){
//             res.send(result);
//         }
