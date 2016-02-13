//modules
var express = require('express');
var app = express();
var http = require('http').Server(app)
var io = require('socket.io')(http);
var jsonfile = require('jsonfile');
var fs = require('fs');
//vars
var port = process.env.Port || 8080;
var urlToUsersJson = 'users.json';
//paths
app.use(express.static(__dirname + '/'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/publish/index.html');
});
//create connection
io.on('connection', function(socket) {
	console.log('a user connected');
	//read json file and send its data to client after connection
	jsonfile.readFile(urlToUsersJson, function(err, data) {
		//console.log('Error: '+err);
		//actual data sending
		socket.emit('firstcall', data);
	});
	//receive json and resave it
	socket.on('message', function(data) {
		//console.log(data);
		//console.log("message received!!");
		//write changes to json file
		fs.writeFile(urlToUsersJson, data, function(err) {
			console.log("Writing once");
			if(err){
				console.log(err);
			}
		});
	});

	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
});

http.listen(port, function() {
	console.log('listening port: ' + port);
});