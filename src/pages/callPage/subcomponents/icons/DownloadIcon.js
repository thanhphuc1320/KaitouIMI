import React, { useState, Component } from 'react';

import ico_download from '../../../../img/imi/ico-download.png';
import ico_download_on from '../../../../img/imi/ico-download-on.png';

const DownloadIcon = (props) => {

    const [isRecordDownload, setRecordDownload] = useState(true);

    function onClickWrapper(e) {
        setRecordDownload(!isRecordDownload); 
        return props.onClick(e);
    }

    return (
        <img className={`icon ${isRecordDownload ? "" : "active"}`} src={isRecordDownload ? ico_download : ico_download_on} onClick={onClickWrapper}/>
    );
}

export default DownloadIcon;