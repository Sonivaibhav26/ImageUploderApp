var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var router = express.Router();
var path = require('path');

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));//for parsing application
app.use(express.static(__dirname + '/public'));

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});
//server 
app.listen(port, function () {
    console.log('Server running on port' + port);
})