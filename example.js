const port = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server, {});
server.listen(port);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});
//подписываемся на событие соединения нового клиента
io.sockets.on('connection', function (client) {
    //подписываемся на событие message от клиента
    client.on('message', function (message) {
        try {
            //посылаем сообщение себе
            client.emit('message', message);
            //посылаем сообщение всем клиентам, кроме себя
            client.broadcast.emit('message', message);
        } catch (e) {
            console.log(e);
            client.disconnect();
        }
    });
    client.on("add user", function(name){
        client.name = name;
        client.broadcast.emit("new user", name)
    });
    client.on("disconnect", function(){
      client.broadcast.emit("user left", client.name);
    });

});
app.use(function(req, res){
    res.status(404).send('404 Not Found');
});

app.use(function(err, req, res, next){
    res.status(500).send('500 Server Error');
});
