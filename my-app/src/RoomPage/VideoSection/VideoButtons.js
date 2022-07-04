import React from "react";
import CameraButton from "./CameraButton";
import MicButton from "./MicButton";
import LeaveRoomButton from './LeaveRoomButton';
import SwitchToScreenSharingButton from "./SwitchToScreenSharingButton";


const VideoButtons = (props) => {
    
    
    
    return (
      <div className="video_buttons_container">
        <MicButton />
        <CameraButton />
        <SwitchToScreenSharingButton />
        <LeaveRoomButton />
      </div>
    );
};

export default VideoButtons;