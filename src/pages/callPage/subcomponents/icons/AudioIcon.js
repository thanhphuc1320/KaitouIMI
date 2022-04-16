import React, { useState} from 'react';

import ico_voice from '../../../../img/imi/ico-voice.png';
import ico_voice_mute from '../../../../img/imi/ico-voice-mute.png';

const AudioIcon = (props) => {

    const [isAudio, setAudio] = useState(true);
    
    function onClickWrapper(e) {
        setAudio(!isAudio)
        return props.onClick(e);
    }

    return (
        <img alt='' className={`icon ${isAudio ? "" : "active"}`} src={isAudio ? ico_voice : ico_voice_mute} onClick={onClickWrapper}/>
    );
}

export default AudioIcon;