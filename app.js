require('./environment')();
var express = require('express');
var app = express();

var port = 3000;
if(process.env.NODE_ENVIRONMENT === 'test') {
    port = 9292;
}
if(process.env.NODE_ENVIRONMENT === 'production') {
    port = process.env.PORT || 5000;
}
require('./controllers/users_controller')(app);
require('./controllers/sign_in_controller')(app);
require('./controllers/notes_controller')(app);
app.listen(port, function() {
    console.log('Listening on %d.', port);
});
