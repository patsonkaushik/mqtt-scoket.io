/* Pusher.js
Server side node.js script that services real-time websocket requests
Allows websocket connections to subscribe and publish to MQTT topics
*/
 
const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mqtt = require('mqtt')
 

// create an mqtt client object and connect to the mqtt broker
//var client = mqtt.connect('mqtt://192.168.1.116');
var client  = mqtt.connect('mqtt://test.mosquitto.org')


console.log(io);
io.sockets.on('connection', function (socket) {
    // socket connection indicates what mqtt topic to subscribe to in data.topic
    socket.on('subscribe', function (data) {
        console.log('Subscribing to '+data.topic);
        socket.join(data.topic);
        client.subscribe(data.topic);
    });
    // when socket connection publishes a message, forward that message
    // the the mqtt broker
    socket.on('publish', function (data) {
        console.log('Publishing to '+data.topic);
        client.publish(data.topic,data.payload);
        console.log('public')
    });
});

// listen to messages coming from the mqtt broker
client.on('message', function (topic, payload, packet) {
    console.log(topic+'='+payload);
    io.sockets.emit('mqtt',{'topic':String(topic),
                            'payload':String(payload)});
});


// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

http.listen(5000, () => {
    console.log('listening on *:5000');
  });