import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useHistory  } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-multi-carousel/lib/styles.css';
import '../../../static/css/appointment.css';
import ico_robot_control from '../../../img/imi/ico-robot-control.png';
import mask_arrow from '../../../img/imi/mask-arrow.png';
import ico_call from '../../../img/imi/ico-call.png';

import {
  // setHomePage,
  getRemoteLink,
  deleteRemoteLink,
} from '../../../store/actions/robot.action';

import { HOST_FE } from '../../../constant'

export default function RobotControlPage(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const linkVideo = useSelector((state) => state.robot.remoteLink.iframe);
  const tokenVideo = useSelector((state) => state.robot.remoteLink.token);
  const [callHomePage, setCallHomePage] = useState(true);
  const [checkAllowCamera, setCheckAllowCamera] = useState(false);

  const USE_AUDIO = true;
  const USE_VIDEO = true;

  useEffect(() => {
    if (checkAllowCamera) {
      console.log("Ssss");
      setTimeout(() => {
        document
          .getElementsByTagName('iframe')[0]
          .contentWindow.postMessage({ type: 'AUTHORIZE_DOMAIN' }, '*');
      }, 6000);
    }
  }, [checkAllowCamera]);

  useEffect(() => {
    getDevices();
    callRobot();
  }, []);

  const getDevices = () => {
    const detectPermissionDialog = function (allowed) {
      setCheckAllowCamera(allowed);
      if (!allowed) {
        Swal.fire({
          title: 'Notification!',
          text: 'You do not have device access!',
        });
      }
    };

    const successCallback = function (error) {
      detectPermissionDialog(true);
    };

    const errorCallback = function (error) {
      if (
        error.name == 'NotAllowedError' ||
        error.name == 'PermissionDismissedError'
      ) {
        detectPermissionDialog(false);
      }
    };

    navigator.mediaDevices
      .getUserMedia({ audio: USE_AUDIO, video: USE_VIDEO })
      .then(successCallback, errorCallback);
  };

  const callRobot = async() => {
    const params = new URLSearchParams(window.location.search);
    const quertParams = {
      params: {
        homePage: '',
        botId: params.get('botId')
      },
      botId: params.get('botId')
    }
    // await dispatch(setHomePage(quertParams))
    setCallHomePage(true)
    await dispatch(getRemoteLink(quertParams))
  }

  const callNavigation = async(goBack) => {
    const params = new URLSearchParams(window.location.search);
    const quertParams = {
      params: {
        homePage: HOST_FE,
        botId: params.get('botId')
      },
      botId: params.get('botId'),
      tokenVideo: tokenVideo
    }
    // await dispatch(setHomePage(quertParams))
    await dispatch(deleteRemoteLink(quertParams))
    setCallHomePage(false)
    document.getElementById('iframe-video').remove()
    if (goBack === 'goBack') {
      history.push(`/appointment/${props.match.params.id}`)
    } else {
      history.push(`/appointment/doctor/call?_id=${props.match.params.id}`)
    }
  }

  return (
    <div className="m-4 robot-control">
      <div className="pl-4 d-flex justify-content-between align-items-center call">
        <div className="d-flex">
          <img className="cursor-pointer" height="20px" src={mask_arrow} onClick={() => callNavigation('goBack')}/>
          <span className="align-self-center ml-4 ">Robot control</span>
        </div>
        <div className="img-call mt-4 cursor-pointer" onClick={() => callNavigation()}>
          <img src={ico_call} />
        </div>
      </div>
      <div id="iframe-video">
        {checkAllowCamera && callHomePage && (
          <iframe
            id="iframeOhmniLabs"
            src={linkVideo}
            height="600"
            width="100%"
            allow="camera;microphone"
          ></iframe>
        )}
      </div>
    </div>
  );
}
