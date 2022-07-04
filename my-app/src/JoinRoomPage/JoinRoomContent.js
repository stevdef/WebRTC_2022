import React, {useState } from "react";
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setConnectOnlyWithAudio, setIdentity, setRoomId } from "../store/actions";
import ErrorMessage from "./ErrorMessage";
import JoinRoomButtons from "./JoinRoomButtons";
import JoinRoomInputs from "./JoinRoomInputs";
import OnlyWithAudioCheckbox from './OnlyWithAudioCheckbox';
import { getRoomExists } from "../utils/api";

const JoinRoomContent = (props) => {
    
    const { isRoomHost, setConnectOnlyWithAudio, connectOnlyWithAudio, setIdentityAction, setRoomIdAction } = props;
    const [roomIdValue, setRoomIdValue ] = useState('');
    const [nameValue, setNameValue] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    
    let navigate = useNavigate();
    
    const handleJoinRoom = async () => {
        
        setIdentityAction(nameValue);
        
        if (isRoomHost) {
            
            createRoom();
            
        } else {
            
            await joinRoom();
        }
    }
    
    const joinRoom = async () => {
        const responseMessage = await getRoomExists(roomIdValue);
        
        const { roomExists, full } = responseMessage;
        
        if (roomExists) {
            
            if (full) {
                setErrorMessage('Meeting is full. Please try again later')    
                
            } else {
                
                // Save in our redux store meeting id that was provided
                setRoomIdAction(roomIdValue);
                
                // Join a room
                navigate('/room', { replace: false });
                                
            }
        } else {
            
            setErrorMessage('Meeting not found. Check your meeting ID')
        }
    };
    
    const createRoom = () => {
        navigate('/room', { replace: false });
    };
    
    return (
        <>
            <JoinRoomInputs 
                roomIdValue={roomIdValue}
                setRoomIdValue={setRoomIdValue}
                nameValue={nameValue}
                setNameValue={setNameValue}
                isRoomHost={isRoomHost}
            />
            <OnlyWithAudioCheckbox 
                setConnectOnlyWithAudio={setConnectOnlyWithAudio}
                connectOnlyWithAudio={connectOnlyWithAudio}
            />
            <ErrorMessage errorMessage={errorMessage}/>
            <JoinRoomButtons 
                handleJoinRoom={handleJoinRoom}
                isRoomHost={isRoomHost}
            />
        </>
    );
};

const mapStoreStateToProps = (state) => {
    return {
        ...state
    }
}

const mapActionsToProps = (dispatch) => {
    return {
        setConnectOnlyWithAudio: (onlyWithAudio) => dispatch(setConnectOnlyWithAudio(onlyWithAudio)),
        setIdentityAction: (identity) => dispatch(setIdentity(identity)),
        setRoomIdAction: (roomId) => dispatch(setRoomId(roomId)),
    }
}

export default connect(mapStoreStateToProps, mapActionsToProps)(JoinRoomContent);