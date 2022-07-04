const express = require('express');
const http = require('http');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const twilio = require('twilio');

const PORT = process.env.PORT || 5002;

const app = express();
const server = http.createServer(app);
app.use(cors());

let connectedUsers = [];
let rooms = [];

// Create route to check if room exists
app.get('/api/room-exists/:roomId', (req, res) => {
    const { roomId } = req.params;
    const room = rooms.find(room => room.id === roomId);
    
    if (room) {
        
        if (room.connectedUsers.length > 3) {
            
            return res.send({ roomExists: true, full: true });   
        } else {
           
            return res.send({ roomExists: true, full: false });
        }
        
    } else {
        
        return res.send({ roomExists: false });
    }
});

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log(`user connected ${socket.id}`)
    socket.on('create-new-room', (data) => {
       createNewRoomHandler(data, socket)
    });
});

// socket.io handlers

createNewRoomHandler = (data, socket) => {
    console.log('Host is creating new room');
    console.log(data);
    const { identity } = data;
    const roomId = uuidv4();
    // Create new user
    const newUser = {
        identity,
        id: uuidv4(),
        socketId: socket.id,
        roomId
    };
    // push user to connectedUsers
    connectedUsers = [...connectedUsers, newUser];
    // Create new room
    const newRoom = {
        id: roomId,
        connectedUsers: [newUser]
    };
    // join socket.io room
    socket.join(roomId);
    
    rooms = [...rooms, newRoom];
    
    // Emit roomId to client that created the room
    socket.emit('room-id', { roomId });
    
    // emit an event about new users to all users connected in this room
    
    
    
};


server.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});