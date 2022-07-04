import React, { useState } from "react";
import SwitchToScreenSharingImg from '../../resources/images/switchToScreenSharing.svg'

const SwitchToScreenSharingButton = (props) => {
    
    const [isScreenSharingActive, setIsScreenSharingActive] = useState(false);
    
    const handleScreenShareToggle = () => {
        setIsScreenSharingActive(!isScreenSharingActive);
    }
    
    return (
        <div className="video_button_container">
            <img 
                className="video_button_image"
                src={SwitchToScreenSharingImg}
                onClick={handleScreenShareToggle}
                alt="Screensharing Button"
            />
        </div>
    );
};

export default SwitchToScreenSharingButton;