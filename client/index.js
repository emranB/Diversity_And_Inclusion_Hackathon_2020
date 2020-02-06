var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var osc = require('osc');
var ip = "0.0.0.0";
var port = process.env.PORT || 2222;
var urlencodedparser = bodyParser.urlencoded({extended:false})
var fs = require('fs');
var cfg = JSON.parse(fs.readFileSync('config.json', 'utf8'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true 
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Origin", "http://localhost"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, http://localhost");
    next();
  });

app.use(express.static(__dirname + '/'));
app.all('/', function (req, res) {
    res.sendFile('views/index.html', {root: __dirname});
});





app.listen(port, ip, function (req, res) {
    console.log("Listening to port: " + port);
});






var ipRemote = "134.190.186.126";

// Create an osc.js UDP Port listening on port 57121.
var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 5555,
    metadata: true
});
 
// Listen for incoming OSC messages.
udpPort.on("message", function (oscMsg, timeTag, info) {
    console.log("Client received msg: ", oscMsg);
    console.log("Remote info is: ", info);
});
 
// Open the socket.
udpPort.open();






app.post("/api/sendClientMsg", urlencodedparser, (req, res) => {
    console.log(req.body);
});






 
 
