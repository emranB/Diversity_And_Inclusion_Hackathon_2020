var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var osc = require('osc');
var ip = "0.0.0.0";
var port = process.env.PORT || 5555;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true 
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

/* Include Static scripts from client side once server side includes have completed */
app.use(express.static(__dirname + '/'));

/* Redirect all calls to 'index.html', and let Angular handle routing */
app.all('/*', function (req, res) {
    res.sendFile('views/index.html', {root: __dirname});
});









var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 5656,
    metadata: true
});

udpPort.on("message", function (oscMsg, timeTag, info) {
    console.log("Server received msg: ", oscMsg);
    console.log("Remote info is: ", info);
});
 
udpPort.open();
 
udpPort.on("ready", function () {
    udpPort.send({
        address: "/s_new",
        args: [
            {
                type: "s",
                value: "default"
            },
            {
                type: "i",
                value: 100
            }
        ]
    }, "0.0.0.0", 235);
});




app.listen(port, ip, function (req, res) {
    console.log("Listening to port: " + port);
});