var app = require("http").createServer(handler);
var path = require("path");
//var io = require("socket.io").listen(app);
var fs = require("fs");

app.listen(80);

function getExtension(filename) {
    var ext = path.extname(filename||'').split('.');
    return ext[ext.length - 1];
}

function handler (request, response) {
    console.log("request starting...");
     
    var filePath = "." + request.url;
    if (filePath == "./")
        filePath = "./index.html";
     
    path.exists(filePath, function(exists) {
        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                }
                else {
                    var ext = getExtension(filePath);
                    if(ext === "html") {
                        response.writeHead(200, { "Content-Type": "text/html" });
                    }
                    if(ext === "png") {
                        response.writeHead(200, { "Content-Type": "image/png" });
                    }
                    response.end(content, "utf-8");
                }
            });
        }
        else {
            response.writeHead(404);
            response.end();
        }
    });
}

//io.sockets.on("connection", function (socket) {});