// based on: pubnub.com

const http = require('http');
const WebSocketServer = require('websocket').server;
const exec = require('child_process').exec;

const server = http.createServer();
server.listen(3000);

const wsServer = new WebSocketServer({
  httpServer: server
});

wsServer.on('request', function(request) {
  const connection = request.accept(null, request.origin);

  connection.on('message', function(message) {
    // this shouldn't be hardcoded but depends on how installed
    // from repo as is this would be the path if cloning into /home/pi
    const msgStr = message.utf8Data;
    const msgParts = message.utf8Data.split('_');

    if (msgStr.indexOf('s_p') !== -1) {
      // full sweep command variant
      msgParts[0] = msgStr; // override with original cmd
      msgParts[1] = "";
    }

    const cmd = `cd /home/pi/sensor-fusion-clu/pi/cli-commands
    python move-servo.py "${msgParts[0]}" ${msgParts[1]} > pylog.txt`;

    exec(cmd, function (error, stdout, stderr) {
      if (error) {
	      console.log('command failed', error.message);
      }
      if (stderr) {
	      console.log('stderr', stderr);
      }
    });
  });

  // connection.on('close', function(reasonCode, description)) {
  // });
});
