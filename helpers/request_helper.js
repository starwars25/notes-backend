var http = require('http');
module.exports = function (params, callback) {
    var body = JSON.stringify(params.data);

    var request = http.request({
        port: 9292,
        method: params.method,
        path: params.path,
        headers: {
            'content-type': 'application/json',
            'content-length': body.length
        }
    }, function (response) {
        var res = '';
        response.on('data', function (chunk) {
            res += chunk.toString();
        });
        response.on('end', function () {
            var output = {
                data: res,
                status: response.statusCode
            };
            callback(output);
        });
    });
    request.write(body);
    request.end();

};