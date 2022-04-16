import React, { useState} from 'react';

import ico_video from '../../../../img/imi/ico-video.png';
import ico_video_stop from '../../../../img/imi/ico-video-stop.png';

const VideoIcon = (props) => {

    const [isVideo, setVideo] = useState(true);

    function onClickWrapper(e) {
        setVideo(!isVideo); 
        return props.onClick(e);
    }

    return (
        <img alt='' className={`icon ${isVideo ? "" : "active"}`} src={isVideo ? ico_video : ico_video_stop} onClick={onClickWrapper}/>
    );
}

export default VideoIcon;