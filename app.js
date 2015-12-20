var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');
var rpis = [];
var leds = [];

require('dotenv').load();

app.listen(process.env.LOCAL_PORT, process.env.LOCAL_IP);

function handler (req, res) {
    fs.readFile(__dirname + '/index.html', function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }

        res.writeHead(200);
        res.end(data);
    });
}


io.on('connection', function (socket) {

    socket.on('capture.car', function(data) {
        socket.emit("light.up");        
    });
});