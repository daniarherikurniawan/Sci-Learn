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