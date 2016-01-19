var http = require('http');
module.exports = function (params, callback) {
    if (!params.data) params.data = {};
    var body = JSON.stringify(params.data);
    if (!params.headers) params.headers = {};
    var request_params = {
        port: 9292,
        method: params.method,
        path: params.path,
        headers: params.headers
    };
    request_params.headers['content-type'] = 'application/json';
    request_params.headers['content-length'] = body.length;
    var request = http.request(request_params, function (response) {
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