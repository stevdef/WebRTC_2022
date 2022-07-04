import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import ChatSection from './ChatSection/ChatSection';
import ParticipantsSection from './ParticipantsSection/ParticipantsSection';
import VideoSection from './VideoSection/VideoSection';
import RoomLabel from './RoomLabel';
import * as webRTCHandler from '../utils/webRTCHandler'
import Overlay from './Overlay';
import './RoomPage.css'


const RoomPage = ({ roomId, identity, isRoomHost }) => {
  
  useEffect(() => {
    webRTCHandler.getLocalPreviewInitRoomConnection(
      isRoomHost,
      identity,
      roomId
    );
  });
  
  return (
    <div className='room_container'>
        <ParticipantsSection />
        <VideoSection />
        <ChatSection />
        <RoomLabel roomId={roomId} />
        <Overlay />
    </div>
  );  
};

const mapStoreStateToProps = (state) => {
  return {
    ...state
  };
};

export default connect(mapStoreStateToProps)(RoomPage);