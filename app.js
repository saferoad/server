var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(8080, '10.132.205.225');

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

var rpis = [];

io.on('connection', function (socket) {
  console.log("Connected!");
  
  socket.on('rpi.init', function(data) {
  	console.log("New RPI detected!");
    rpis.push(socket);
  });

  socket.on('git.pull', function (data) {
    for(var i in rpis) {
      rpis[i].emit("git.pull");
    }
  });
});