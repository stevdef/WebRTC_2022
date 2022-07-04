import { setShowOverlay } from '../store/actions';
import store from '../store/store';
import * as wss from './wss';

const defaultConstraints = {
    audio: true,
    video: true
}

let localStream;

export const getLocalPreviewInitRoomConnection = async (
    isRoomHost,
    identity,
    roomId = null
) => {
    navigator.mediaDevices
        .getUserMedia(defaultConstraints)
        .then(stream => {
            console.log('succesfully received local video stream')
            localStream = stream;
            showLocalVideoPreview(localStream);
            
            // Dispatch an action to hide overlay
            store.dispatch(setShowOverlay(false));
            
            isRoomHost ? wss.createNewRoom(identity) : wss.joinRoom(identity, roomId);
            
        }).catch(err => {
            console.log('error occured when trying to get an access to local stream');
            console.log(err);
        })
}

const showLocalVideoPreview = (stream) => {
    // Show local video preview
}