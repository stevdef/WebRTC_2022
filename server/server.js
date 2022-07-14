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
    const room = rooms.find((room) => room.id === roomId);
    
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

io.on("connection", (socket) => {
    console.log(`user connected ${socket.id}`);
  
    socket.on("create-new-room", (data) => {
      createNewRoomHandler(data, socket);
    });
  
    socket.on("join-room", (data) => {
      joinRoomHandler(data, socket);
    });
    
    socket.on("disconnect", () => {
        disconnectHandler(socket);
    });
});

// socket.io handlers

const createNewRoomHandler = (data, socket) => {
    console.log("host is creating new room");
    console.log(data);
    const { identity } = data;
  
    const roomId = uuidv4();
  
    // create new user
    const newUser = {
      identity,
      id: uuidv4(),
      socketId: socket.id,
      roomId,
    };
  
    // push that user to connectedUsers
    connectedUsers = [...connectedUsers, newUser];
  
    //create new room
    const newRoom = {
      id: roomId,
      connectedUsers: [newUser],
    };
    // join socket.io room
    socket.join(roomId);
  
    rooms = [...rooms, newRoom];
  
    // emit to that client which created that room roomId
    socket.emit("room-id", { roomId });
  
    // emit an event to all users connected
    // to that room about new users which are right in this room
    socket.emit("room-update", { connectedUsers: newRoom.connectedUsers });
};

const joinRoomHandler = (data, socket) => {
    const { identity, roomId } = data;
    const newUser = {
        identity,
        id: uuidv4(),
        socketId: socket.id,
        roomId
    }
    // Join room
    const room = rooms.find((room) => room.id === roomId);
    room.connectedUsers = [...room.connectedUsers, newUser];
    
     // join socket.io room
     socket.join(roomId);
     
     // Add new user to connected users array
     connectedUsers = [...connectedUsers, newUser];
     
     io.to(roomId).emit('room-update', { connectedUsers: room.connectedUsers });
};

const disconnectHandler = (socket) => {
    // Find if user has been registered - if yes remove him from room and connected user array
    const user = connectedUsers.find((user) => user.socketId === socket.id);
    
    if (user) {
        const room = rooms.find((room) => room.id === user.roomId);
        
        room.connectedUsers = room.connectedUsers.filter(
            (user) => user.socketId !== socket.id
        );
        
        // Leave socket io room
        socket.leave(user.roomId);
        
        // Close the room if amount of users which will stay will be 0
        if (room.connectedUsers.length > 0) {
            // Emit to all users which are still in the room that user disconnected
            io.to(room.id).emit("user-disconnected", { socketId: socket.id });
            
            io.to(room.id).emit("room-update", {
                connectedUsers: room.connectedUsers,
            });
        } else {
            rooms = rooms.filter((r) => r.id !== room.id);
        }
    }
};


server.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});