import React,  { useState } from "react";
import CameraButtonImg from '../../resources/images/camera.svg';
import CameraButtonOffImg from '../../resources/images/cameraOff.svg';

const CameraButton = (props) => {
    
    const [isCameraMuted, setIsCameraMuted] = useState(false);
    
    const handleCameraButtonPressed = () => {
        setIsCameraMuted(!isCameraMuted);
    }
    
    return (
        <div className="video_button_container">
        <img 
            className="video_button_image"
            src={isCameraMuted ? CameraButtonOffImg : CameraButtonImg}
            onClick={handleCameraButtonPressed}
            alt="Camera Button"
        />
      </div>
    );
};

export default CameraButton;