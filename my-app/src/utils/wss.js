import io from 'socket.io-client';

const SERVER = 'http://localhost:5002';

let socket = null;

export const connectWithSocketIOServer = () => {
    socket = io(SERVER)
    
    socket.on('connect', () => {
        console.log('successfully connected with socket io server');
        console.log(socket.id) ;
    });
};

export const createNewRoom = (identity) => {
    // Emit an event to server that we would like to create a new room
    const data = {
        identity
    }
    
    socket.emit('create-new-room', data);
}

export const joinRoom = (identity, roomId) => {
    // Emit an event to server that we would like to join a room
    const data = {
        roomId,
        identity
    }
    
    socket.emit('join-room', data);
}