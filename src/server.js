const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const index = fs.readFileSync(`${__dirname}/../client/index.html`);

const onRequest = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const app = http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);

const io = socketio(app);

const square = {
  lastUpdate: new Date().getTime(),
  x: 0,
  y: 0,
  height: 100,
  width: 100,
  name: '',
};

io.on('connection', (socket) => {
  socket.join('room');

  socket.on('draw', (data) => {
    square.name = data.name;
    square.lastUpdate = new Date().getTime();
    square.x = data.coords.x;
    square.y = data.coords.y;
    square.height = data.coords.height;
    square.width = data.coords.width;

    io.sockets.in('room').emit('update', {
      name: square.name,
      coords: {
        lastUpdate: square.lastUpdate,
        x: square.x,
        y: square.y,
        width: square.width,
        height: square.height,
      },
    });
  });
});
