const express = require('express');
const logger = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors')
const passport = require('passport');
const app = express();
require('dotenv').config();
app.use(cors())
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(
  session({
    key: process.env.SECRET_KEY,
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));


/*=====SOCKET.IO CODE=======*/
//=========================//


const rooms = []
const connectedUsers = []
const authHelpers = require('./services/auth/auth-helpers')


// || a get request to /genurl is a request for a new room. authHelpers.genurl
// || creates a random URL to associate with the room and adds it to the server's
// || list as well as sending the room's ID back to the client to share.
// \/


app.get('/genurl', authHelpers.genUrl, (req, res) => {
  rooms.push(res.locals.newRoom)
  res.json({
    message: 'Game created',
    token: res.locals.newRoom
  })
})


const http = require('http').Server(app)
var io = require('socket.io')(http);


  // || When a user connects to the http server, io pushes the client id
  // || (a number generated by socket.io) to an array tracked by the server.
  // || it then begins to listen to emissions from that client.
  // \/


io.on('connection', function(client) {

  console.log('a user connected', client.id);
  connectedUsers.push({id: client.id, color: newColor})


  // || A sendData emission tells the server that an existing user has updated some
  // || information. The server here matches the client with a room, and emits the
  // || update to all users listed in that room.
  // \/

  client.on('SendData', (data) => {

    const index = connectedUsers.findIndex(item => item.id ===client.id)

    connectedUsers[index] = { ...connectedUsers[index], ...data, id: client.id, }

    let thisRoom = connectedUsers.filter((el) => {
      return el.token === data.token
    })

    thisRoom.forEach((el) => {
      io.to(el.id).emit('socket-users', thisRoom)
    })
  })


  // || A giveToken emission from the client indicates that there is a new user
  // || wishing to be paired with an existing room, or is creating a new room.
  // || The server here identifies the user. If the user exists already, it makes sure
  // || to update the server's version of the client's data:
  // \/


  client.on('giveToken', (data) => {

    let valid = rooms.find(el => el === data.token)

    if(valid || !data.token) {

      const index = connectedUsers.findIndex(item => item.id === client.id)

      if(connectedUsers[index]){

        connectedUsers[index] = { ...connectedUsers[index], ...data}

      }else {

        data.id = client.id
        connectedUsers.push(data)

      }

      let thisRoom = connectedUsers.filter((el) => {

        return el.token === data.token

      })

      thisRoom.forEach((el) => {

        io.to(el.id).emit('socket-users', thisRoom)

      })

    }else {

      client.emit('invalid-token', 'Token Invalid')

    }

  })

  client.on('end-session', (data) => {

    if(data.user) {

      let thisRoom = connectedUsers.filter((el) => {

        return(el.token === data.token)

      })

      thisRoom.forEach((el) => {

        io.to(el.id).emit('session-ended', 'test')

      })

    }
  })

  client.on('disconnect', () => {
    console.log('a client disconnected', client.id)
    console.log('connectedUsers - before:', connectedUsers)
    let index = connectedUsers.findIndex(item => item.id === client.id)
    connectedUsers.splice(index, 1)
    console.log('connectedUsers', connectedUsers)
  })

})

http.listen(3002, () => {
  console.log('Server listening on port 3002')
})


//=============================//
//=============================//

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// app.get('/', (req,res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

const authRoutes = require('./routes/auth-routes');
app.use('/api/auth', authRoutes);

const epicRoutes = require('./routes/epic-routes');
app.use('/api/epic', epicRoutes);

const deckRoutes = require('./routes/deck-routes');
app.use('/api/decks', deckRoutes);

app.use('*', (req, res) => {
  res.status(400).json({
    message: 'Not Found!',
  });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    error: err,
    message: err.message,
  });
});
