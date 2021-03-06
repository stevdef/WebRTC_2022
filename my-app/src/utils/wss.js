import io from 'socket.io-client';
import { setRoomId, setParticipants } from '../store/actions';
import store from '../store/store';

const SERVER = 'http://localhost:5002';

let socket = null;

export const connectWithSocketIOServer = () => {
    socket = io(SERVER)
    
    socket.on('connect', () => {
        console.log('successfully connected with socket io server');
        console.log(socket.id) ;
    });
    
    socket.on('room-id', (data) => {
        const { roomId} = data;
        store.dispatch(setRoomId(roomId));
    });
    
    socket.on('room-update', (data) => {
        const { connectedUsers } = data;
        store.dispatch(setParticipants(connectedUsers));
    })
};

export const createNewRoom = (identity) => {
    // Emit an event to server that we would like to create a new room
    console.log('createNewRoom called');
    const data = {
        identity
    };
    
    socket.emit('create-new-room', data);
}

export const joinRoom = (identity, roomId) => {
    // Emit an event to server that we would like to join a room
    const data = {
        roomId,
        identity
    };
    
    socket.emit('join-room', data);
};