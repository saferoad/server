var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(8080);

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

var ledSocket = false;

io.on('connection', function (socket) {
  console.log("Connected!");
  
  socket.on('led.init', function(data) {
    ledSocket = socket;
  });

  socket.on('led.update', function (data) {
    if(ledSocket !== false) {
      ledSocket.emit("led.update", data);
    }
  });
});