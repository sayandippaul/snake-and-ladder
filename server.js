// const express = require('express');
// const path = require('path');
// const app = express();
const port = process.env.PORT || 3000;
// const http = require('http');
// const server = http.createServer(app);

// const { Server } = require("socket.io");

// const io = require("socket.io")(http);

// // Serve static files from the 'public' directory
// app.use(express.static(path.join(__dirname, 'public')));

// // Serve the index.html file for the root URL
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });
// // io.on('connection', (socket) => {
// //     console.log('a user connected');
// //     socket.on('disconnect', () => {
// //       console.log('user disconnected');
// //     });
// //   });

// io.on('connection', (socket) => {
//     console.log('a user connected');


//     socket.on('chat message', (msg) => {
//         console.log('message: ' + msg);
        
//         // Broadcasting the message to all connected clients
//       });
    
    
//     socket.on('disconnect', () => {
//       console.log('user disconnected');
//     });
//   });




const express = require('express');
const app = express();
const path = require("path");
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


// Middleware
app.use(bodyParser.json());
// Connect to MongoDB
mongoose.connect('mongodb+srv://bidisha:0420@bidishaproject.rgyjmyb.mongodb.net/?retryWrites=true&w=majority&appName=bidishaproject', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a simple schema and model
const players = new mongoose.Schema({
  name: String,
  ghuti: String,
  ladder:Number,
  snake:Number,
  position:Number,
  dan:Number,
  approved:Number,
});

const Data = mongoose.model('players', players);

// Routes
app.post('/saveplayers', async (req, res) => {
  var newData = new Data(req.body);
  // console.log(newData);
  try {
    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/getplayers', async (req, res) => {
  try {
    const data = await Data.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});app.get('/gamepage', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'game.html'));
});

// io.on('connection', (socket) => {
//   console.log('a user connected');
//   console.log("user connected toid=" +socket.handshake.auth.token);

//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//   });
// });

var usp = io.of("/user");
usp.on("connection", async function (socket) {
  console.log("user connected ");

  socket.on("userentered", (arg) => {
    console.log(arg); // world
    
    socket.broadcast.emit('showusereneterd', {name:arg.name,ghuti:arg.ghuti});
    socket.emit('showusereneterd', {name:arg.name,ghuti:arg.ghuti});

  });
  socket.on("dicedone", async(arg) => {
    // console.log(arg.players); // world
    var v = await Data.deleteMany();
  var newData1 = new Data(arg.players[0]);
  var newData2 = new Data(arg.players[1]);
  var s = await newData1.save();
  var s = await newData2.save();
    
    // socket.broadcast.emit('showusereneterd', {name:arg.name,ghuti:arg.ghuti});
    // socket.emit('showusereneterd', {name:arg.name,ghuti:arg.ghuti});
    socket.broadcast.emit('showposition', arg);
    // socket.emit('showposition', arg);

  });



  socket.on("gameended", async(arg) => {
    console.log("game ended"); // world
    var v = await Data.deleteMany();
    
    // socket.broadcast.emit('showusereneterd', {name:arg.name,ghuti:arg.ghuti});
    // socket.emit('showusereneterd', {name:arg.name,ghuti:arg.ghuti});
    socket.broadcast.emit('gameended');
    // socket.emit('showposition', arg);

  });
  socket.on("playsound", async(arg) => {

    console.log("play sound"); // world
    console.log(arg);
    // socket.broadcast.emit('showusereneterd', {name:arg.name,ghuti:arg.ghuti});
    // socket.emit('showusereneterd', {name:arg.name,ghuti:arg.ghuti});
    socket.broadcast.emit('playsound',arg);
    socket.emit('playsound',arg);
    // socket.emit('showposition', arg);

  });



  socket.on("disconnect", async function () {
    console.log("user disconnected");
   
    });


    
    
    
  


  });
server.listen(port, () => {
  console.log('listening on *:3000');
});