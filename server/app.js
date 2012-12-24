var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(6688);

var players = [];

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

io.sockets.on("connection", function (socket) {
    socket.emit("game_update", { hello: "world" });
    socket.on("player_connect", function (data) {
        console.log(data);
    });
});