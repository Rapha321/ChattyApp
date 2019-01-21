const express = require('express');
const SocketServer = require('ws').Server;
const WebSocket = require('ws');
const uuid = require('uuid/v4');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });
const messageDatabase = [];
const onlineUsers= {counter: 0};

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.broadcast = data => {
  wss.clients.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
      console.log('data here: ', data)
      console.log('data sent to client from server: ', data);
    }
  });
};

wss.broadcastJSON = obj => wss.broadcast(JSON.stringify(obj));

wss.on('connection', (ws) => {
  console.log('Client connected');
  if(ws) {
    onlineUsers.counter++
  }

  wss.broadcastJSON(onlineUsers);

  ws.on('message', (data) => {
      const objData = JSON.parse(data);
      switch (objData.type) {
        case 'postMessage': {
          const objectToBroadcast = {
            id: uuid(),
            type: 'incomingMessage',
            username: objData.username,
            content: objData.content
          };
          console.log(">>> objData ", objData)
          console.log("objectToBroadcast: ", objectToBroadcast)
          messageDatabase.push(objectToBroadcast);
          wss.broadcastJSON(objectToBroadcast);
          break; }
        case 'postNotification': {
          const objectToBroadcast = {
            id: uuid(),
            type: 'incomingNotification',
            content: objData.content
          };
          messageDatabase.push(objectToBroadcast);
          wss.broadcastJSON(objectToBroadcast);
          break;
        }
        default:
      }
  });

  const initialMessage = {
    type: 'initial-messages',
    messages: messageDatabase
  };

  ws.send(JSON.stringify(initialMessage));

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected');
    onlineUsers.counter--;
    wss.broadcastJSON(onlineUsers);
  });
});







