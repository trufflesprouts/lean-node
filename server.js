/**
 * Module dependencies.
 */
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const path = require('path');
const admin = require('firebase-admin');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const serviceAccount = require('./firebase-adminsdk-key.json');
const env = require('./src/env').index;

/**
 * Firebase configuration.
 */
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: env.databaseURL,
  storageBucket: env.storageBucket
});

const database = admin.firestore();
const bucket = admin.storage().bucket();
// bucket.file('name.jpg').delete()

/**
 * Express configuration.
 */
const app = express();
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());

/**
 * Controllers (route handlers).
 */
const addUserController = require('./controllers/add');

/**
 * Primary app routes.
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.post('/add', addUserController.index);

/**
 * Web socket.
 */
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', socket => {
  console.log('New client connected');

  // listen to 'update' event from the client and update database accordingly
  socket.on('update', ({ id, ...rest }) => {
    database
      .collection('users')
      .doc(id)
      .update(rest);
  });

  // publish users when the database changes (listened by src/App.js)
  database.collection('users').onSnapshot(table => {
    socket.emit('users', table.docs.map(doc => doc.data()));
  });

  socket.on('disconnect', () => console.log('Client disconnected'));
});

server.listen(process.env.PORT || 8080);
