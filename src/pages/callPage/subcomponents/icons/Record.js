import React, { useState} from 'react';

import ico_download from '../../../../img/imi/ico-record.png';
import ico_download_on from '../../../../img/imi/record-icon-content.png';

const Record = (props) => {

    const [isRecord, setRecor] = useState(true);

    function onClickWrapper(e) {
        setRecor(!isRecord); 
        return props.onClick(e);
    }

    return (
        <div className={`${isRecord ? "" : "activeRecord"}`}>
            <img alt='' className={`icon ${isRecord ? "" : "iconActive"}`} src={isRecord ? ico_download : ico_download_on} onClick={onClickWrapper}/>
        </div>
    );
}

export default Record;