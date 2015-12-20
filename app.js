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
    console.log("Connected!");
  
    socket.on('rpi.init', function(leds) {
        
        rpis.push(socket);

        for (var i in leds) {
            leds.push({
                "pos":leds[i].pos,
                "rpi":(rpis.length-1),
                "index":leds[i].index
            });
        }

        console.log(leds);
        console.log(data);

        console.log("Initialized Rpi with "+Object.keys(leds).length+" leds");
    });

    socket.on('disconnect', function() {
        console.log('Got disconnect!');
        var i = rpis.indexOf(socket);

        if(i > -1) {
            console.log("It was RPI disconnect");

            for(var j = leds.length - 1; j>=0; j--) {
                if(leds[j].rpi == i) {
                    leds.splice(j, 1);
                }
            }

            rpis.splice(i, 1);
        }
    });

    socket.on('capture.car', function(data) {
        var minPos = data.pos;
        var maxPos = minPos + 100;
        
        console.log("Captured car at "+data.pos);

        for(var i in leds) {
            
            if(leds[i].pos > minPos && leds[i].pos < maxPos) {
            
                // rpis[leds[i].rpi].emit("light.up", {
                //     "index": leds[i].index
                // });

                // console.log("Lighting up #"+i);
            }
        }


    });
});