import React, { useState } from "react";
import MicButtonImg from '../../resources/images/mic.svg';
import MicButtonOffImg from '../../resources/images/micOff.svg';

const MicButton = (props) => {
    
    const [isMicMuted, setIsMicMuted] = useState(false);
    
    const handleMicButtonPressed = () => {
        setIsMicMuted(!isMicMuted);
    }
    
    return (
      <div className="video_button_container">
        <img 
            className="video_button_image"
            src={isMicMuted ? MicButtonOffImg : MicButtonImg}
            onClick={handleMicButtonPressed}
            alt="Mic Button"
        />
      </div>
    );
};

export default MicButton;