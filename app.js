var express = require('express');
var app = express();

/**
 * https://app.trackimo.com/oauth2/auth?client_id=<client_id>&redirect_uri=http://<server>:<port>/oauth2/handler&scope=locations,notifications,devices,accounts&response_type=code
 */

app.get('/oauth2/handler', function (req, res) {

    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    var code = query.code || false;
    if (!code) {
        res.status(400).send("'code' param is missing from the URL");
    }
    else {
        // We have the 'code' param in the url, let's prep the request
        var request = require('request');
        var requestData = {
            "client_id": '<client_id>',
            "client_secret": '<client_secret>',
            "code": code,
            "redirect_uri": 'http://<server>:<port>/oauth2/handler'
        };

        var options = {
            uri: 'https://app.trackimo.com/api/v3/oauth2/token',
            method: 'POST',
            json: requestData
        };

        var out = {};
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);

                // We got the access token!
                var access_token = body.access_token;

                res.json(body);
                res.end();
            }
            else {
                res.write(error);
                res.end();
            }
        });
    }

});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});