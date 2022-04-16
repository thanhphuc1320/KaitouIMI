import React, {useEffect, useRef} from 'react';

import io from 'socket.io-client';
import { useHistory } from 'react-router-dom';

import ico_camera from '../../img/imi/ico-camera.png';
import ico_endcall from '../../img/imi/ico-endcall.png';
import ico_left from '../../img/imi/ico-left.png';
import ico_right from '../../img/imi/ico-right.png';

import AudioIcon from './subcomponents/icons/AudioIcon';
import VideoIcon from './subcomponents/icons/VideoIcon';
import Record from './subcomponents/icons/Record';
import { DOCTOR_ROLE } from '../../constant';

import {
  uploadAppointmentAudioFileApiCall,
} from '../../apiCalls/file.api';

const CallFrame = (props) => {
  const history = useHistory();

  const { doctor, patient, id, image, openAnnotationTool, role } = props || {};
  const firstName = role === DOCTOR_ROLE ? doctor.firstName : patient.firstName;
  const lastName = role === DOCTOR_ROLE ? doctor.lastName : patient.lastName;

  /** CONFIG **/
  const USE_AUDIO = {
    sampleSize: 16,
    channelCount: 1,
    sampleRate: 44100
  };
  const USE_VIDEO = true;
  const CHANNEL = id;

  /** You should probably use a different stun server doing commercial stuff **/
  /** Also see: https://gist.github.com/zziuni/3741933 **/
  const ICE_SERVERS = [
    {
      url: 'turn:35.232.7.88:3478',
      username: 'testuser',
      credential: 'pass0wrd',
    },
  ];

  var signaling_socket = null; /* our socket.io connection to our webserver */
  var local_media_stream = null; /* our own microphone / webcam */
  var local_media_stream_audio_only = null; /* our own microphone  */
  var remote_media_stream_audio_only = null; /* remote microphone  */
  var peers = {}; /* keep track of our peer connections, indexed by peer_id (aka socket.io id) */
  var peer_media_elements = {}; /* keep track of our <video>/<audio> tags, indexed by peer_id */
  var mediaLocalRecorder; /* keep local recording */
  var mediaRemoteRecorder; /* keep remote recording */
  var mediaLocalRecordedBlobs = []; /* keep local recording blobs */
  var mediaRemoteRecordedBlobs = []; /* keep remote recording blobs */
  var mixedMediaRecorder;
  var mixedMediaRecorderBlobs = [];

  // Set up to exchange only video.
  const offerOptions = {
    offerToReceiveVideo: 1,
  };

  // Define initial start time of the call (defined as connection between peers).
  let startTime = null;

  // Video element where stream will be placed.
  const localVideo = useRef();
  const remoteVideo = useRef();
  const recordVideo = useRef();

  let isAudio = useRef(true);
  let isVideo = useRef(true);
  let isRecord = useRef(false);

  function toggleAudio() {
    signaling_socket.emit('audio', { channel: CHANNEL, action: !isAudio });
    isAudio = !isAudio;
  }

  // Handles error by logging a message to the console.
  function handleLocalMediaStreamError(error) {
    trace(`navigator.getUserMedia error: ${error.toString()}.`);
  }

  // Logs a message with the id and size of a video element.
  function logVideoLoaded(event) {
    const video = event.target;
    trace(
      `${video.id} videoWidth: ${video.videoWidth}px, ` +
        `videoHeight: ${video.videoHeight}px.`
    );
  }

  // Logs a message with the id and size of a video element.
  // This event is fired when video begins streaming.
  // function logResizedVideo(event) {
  //   logVideoLoaded(event);
  //   if (startTime) {
  //     const elapsedTime = window.performance.now() - startTime;
  //     startTime = null;
  //     trace(`Setup time: ${elapsedTime.toFixed(3)}ms.`);
  //   }
  // }

  // Handles record button action
  function recordAction() {
    if (isRecord) {
      let options = { mimeType: 'audio/webm' };
      let streams = [local_media_stream_audio_only];

      try {
        mediaLocalRecorder = new MediaRecorder(
          local_media_stream_audio_only,
          options
        );
        if (remote_media_stream_audio_only) {
          streams = [...streams, remote_media_stream_audio_only]
          mediaRemoteRecorder = new MediaRecorder(
            remote_media_stream_audio_only,
            options
          );
        }

        mixedMediaRecorder = new MediaRecorder(
          mixMediaStream(streams),
          options,
        );
      } catch (e) {
        console.error('Exception while creating MediaRecorder:', e);
        return;
      }
      mediaLocalRecorder.ondataavailable = e => mediaLocalRecordedBlobs.push(e.data);
      mediaLocalRecorder.start();
      if (remote_media_stream_audio_only) {
        mediaRemoteRecorder.ondataavailable = e => mediaRemoteRecordedBlobs.push(e.data);
        mediaRemoteRecorder.start();
      }

      mixedMediaRecorder.ondataavailable = evt => mixedMediaRecorderBlobs.push(evt.data);
      mixedMediaRecorder.start();
    } else {
      mediaLocalRecorder.stop();
      // mediaLocalRecorder.onstop = (event) => {
      //   const patient = new Blob(mediaLocalRecordedBlobs, { type: 'audio/mp3' });
      //   const patientUrl = window.URL.createObjectURL(patient);
      //   const patienta = document.createElement('a');
      //   patienta.style.display = 'none';
      //   patienta.href = patientUrl;
      //   patienta.download = 'patient.mp3';
      //   document.body.appendChild(patienta);
      //   patienta.click();
      //   setTimeout(() => {
      //     document.body.removeChild(patienta);
      //     window.URL.revokeObjectURL(patientUrl);
      //     mediaLocalRecordedBlobs = [];
      //   }, 100);
      // };
      if (remote_media_stream_audio_only) {
        mediaRemoteRecorder.stop();
        mediaRemoteRecorder.onstop = (event) => {
          // const doctor = new Blob(mediaRemoteRecordedBlobs, { type: 'audio/mp3' });
          // const doctorUrl = window.URL.createObjectURL(doctor);
          // const doctora = document.createElement('a');

          // doctora.style.display = 'none';
          // doctora.href = doctorUrl;
          // doctora.download = 'doctor.mp3';
          // document.body.appendChild(doctora);
          // doctora.click();
          // setTimeout(() => {
          //   document.body.removeChild(doctora);
          //   window.URL.revokeObjectURL(doctorUrl);
          //   mediaRemoteRecordedBlobs = [];
          // }, 100);
        };
      }

      mixedMediaRecorder.stop();
      mixedMediaRecorder.onstop = (event) => {
        const patient = new Blob(mediaLocalRecordedBlobs, { type: 'audio/mp3' });
        const doctor = new Blob(mediaRemoteRecordedBlobs, { type: 'audio/mp3' });
        const record = new Blob(mixedMediaRecorderBlobs, { type: 'audio/mp3' });
        const files = [];
        files[0] = new File([patient], 'patient.mp3',  { type: 'audio/mp3' });
        files[1] = new File([doctor], 'doctor.mp3', { type: 'audio/mp3' });
        files[2] = new File([record], 'record.mp3', { type: 'audio/mp3' });
        const data = {
          appointmentId: id,
          files,
        };
        uploadAppointmentAudioFileApiCall(data);
        mediaLocalRecordedBlobs = [];
        mediaRemoteRecordedBlobs = [];
        mixedMediaRecorderBlobs = [];
      }
    }
    isRecord = !isRecord;
  }

  // Handles call button action: creates peer connection.
  function toggleVideo() {
    signaling_socket.emit('video', { channel: CHANNEL, action: !isVideo });
    isVideo = !isVideo;
  }

  // Handles hangup action: ends up call, closes connections and resets peers.
  function hangupAction() {
    trace('End call.');
    startTime = window.performance.now();
    const confirmed = window.confirm('Do you want to end the call ddd?');
    if (confirmed) {
      console.log('Endcall - Disconnected from signaling server');
      kill_WebRTC_media_stream();
      signaling_socket.disconnect();
      history.push(`/appointment/${props.id}`);
    }
  }

  // Logs an action (text) and the time when it happened on the console.
  function trace(text) {
    text = text.trim();
    const now = (window.performance.now() / 1000).toFixed(3);

    console.log(now, text);
  }

  /***********************/
  /** Local media stuff **/
  /***********************/
  function setup_local_media(callback, errorback) {
    if (local_media_stream != null) {
      /* ie, if we've already been initialized */
      if (callback) callback();
      return;
    }
    /* Ask user for permission to use the computers microphone and/or camera,
     * attach it to an <audio> or <video> tag if they give us access. */
    console.log('Requesting access to local audio / video inputs');

    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

    // Initializes local media stream.
    navigator.mediaDevices
      .getUserMedia({ audio: USE_AUDIO, video: USE_VIDEO })
      .then((mediaStream) => {
        localVideo.current.srcObject = mediaStream;
        local_media_stream = mediaStream;
        local_media_stream_audio_only = local_media_stream.clone();
        local_media_stream_audio_only.getVideoTracks()[0].enabled = false;

        if (callback) callback();
      })
      .catch(handleLocalMediaStreamError);
  }

  // return mixed of local audio stream and remote audio stream
  const mixMediaStream = (streams) => {
    const ctx = new AudioContext();
    const dest = ctx.createMediaStreamDestination();

    streams.forEach(stream => {
      ctx.createMediaStreamSource(stream).connect(dest)
    });

    return dest.stream;
  }

  // completely kill the WebRTC media stream
  const kill_WebRTC_media_stream = () => {
    local_media_stream.getTracks().forEach(track => track.stop());
    local_media_stream_audio_only.getTracks().forEach(track => track.stop());
  }

  useEffect(() => {
    // Initializes signaling server
    signaling_socket = io('wss://dev-signaling.imi.ai');

    signaling_socket.on('connect', function () {
      console.log('Connected to signaling server');
      setup_local_media(function () {
        /* once the user has given us access to their
         * microphone/camcorder, join the channel and start peering up */
        join_channel(CHANNEL, { 'whatever-you-want-here': 'stuff' });
      });
    });

    signaling_socket.on('disconnect', function () {
      console.log('Disconnected from signaling server');
      /* Tear down all of our peer connections and remove all the
       * media divs when we disconnect */
      for (let peer_id in peers) {
        peers[peer_id].close();
      }
      peers = {};
      peer_media_elements = {};

      // NEED FIX: temporarily: destroy remoteVideo
      if (remoteVideo && remoteVideo.current) {
        remoteVideo.current.srcObject = null;
      }
      if (localVideo && localVideo.current) {
        localVideo.current.srcObject = null;
      }
      local_media_stream = null;
    });

    function join_channel(channel, userdata) {
      signaling_socket.emit('join', { channel, userdata });
    }

    /**
     * When we join a group, our signaling server will send out 'addPeer' events to each pair
     * of users in the group (creating a fully-connected graph of users, ie if there are 6 people
     * in the channel you will connect directly to the other 5, so there will be a total of 15
     * connections in the network).
     */
    signaling_socket.on('addPeer', function (config) {
      console.log('Signaling server said to add peer:', config);
      var peer_id = config.peer_id;
      if (peer_id in peers) {
        /* This could happen if the user joins multiple channels where the other peer is also in. */
        console.log('Already connected to peer ', peer_id);
        return;
      }
      var peer_connection = new RTCPeerConnection(
        { iceServers: ICE_SERVERS },
        { optional: [{ DtlsSrtpKeyAgreement: true }] }
        /* this will no longer be needed by chrome
         * eventually (supposedly), but is necessary
         * for now to get firefox to talk to chrome */
      );
      peers[peer_id] = peer_connection;

      peer_connection.onicecandidate = function (event) {
        if (event.candidate) {
          signaling_socket.emit('relayICECandidate', {
            peer_id: peer_id,
            ice_candidate: {
              sdpMLineIndex: event.candidate.sdpMLineIndex,
              candidate: event.candidate.candidate,
            },
          });
        }
      };

      peer_connection.onaddstream = function (event) {
        peer_media_elements[peer_id] = remoteVideo;

        remoteVideo.current.srcObject = event.stream;

        remote_media_stream_audio_only = event.stream.clone();
        remote_media_stream_audio_only.getVideoTracks()[0].enabled = false;

        trace('Remote peer connection received remote stream.');
      };

      /* Add our local stream */
      peer_connection.addStream(local_media_stream);

      /* Only one side of the peer connection should create the
       * offer, the signaling server picks one to be the offerer.
       * The other user will get a 'sessionDescription' event and will
       * create an offer, then send back an answer 'sessionDescription' to us
       */
      if (config.should_create_offer) {
        console.log('Creating RTC offer to ', peer_id);
        peer_connection.createOffer(
          function (local_description) {
            console.log('Local offer description is: ', local_description);
            peer_connection.setLocalDescription(
              local_description,
              function () {
                signaling_socket.emit('relaySessionDescription', {
                  peer_id: peer_id,
                  session_description: local_description,
                });
                console.log('Offer setLocalDescription succeeded');
              },
              function () {
                alert('Offer setLocalDescription failed!');
              }
            );
          },
          function (error) {
            console.log('Error sending offer: ', error);
          }
        );
      }
    });

    signaling_socket.on('audio', function (config) {
      var peer_id = config.peer_id;
      var audio_action = config.action;
      var peer_me = peer_media_elements[peer_id];
      // Notice off video action to all peers.
      if (peer_me && peer_me.current) {
        peer_me.current.srcObject.getAudioTracks()[0].enabled = !audio_action;
      } else {
        local_media_stream.getAudioTracks()[0].enabled = !audio_action;
      }
    });

    signaling_socket.on('video', function (config) {
      var peer_id = config.peer_id;
      var video_action = config.action;
      var peer_me = peer_media_elements[peer_id];
      // Notice off video action to all peers.
      if (peer_me && peer_me.current) {
        peer_me.current.srcObject.getVideoTracks()[0].enabled = !video_action;
      } else {
        local_media_stream.getVideoTracks()[0].enabled = !video_action;
      }
    });

    /**
     * Peers exchange session descriptions which contains information
     * about their audio / video settings and that sort of stuff. First
     * the 'offerer' sends a description to the 'answerer' (with type
     * "offer"), then the answerer sends one back (with type "answer").
     */
    signaling_socket.on('sessionDescription', function (config) {
      var peer_id = config.peer_id;
      var peer = peers[peer_id];
      var remote_description = config.session_description;
      var desc = new RTCSessionDescription(remote_description);
      // var stuff = peer.setRemoteDescription(
      //   desc,
      //   function () {
      //     console.log('setRemoteDescription succeeded');
      //     if (remote_description.type == 'offer') {
      //       console.log('Creating answer');
      //       peer.createAnswer(
      //         function (local_description) {
      //           console.log('Answer description is: ', local_description);
      //           peer.setLocalDescription(
      //             local_description,
      //             function () {
      //               signaling_socket.emit('relaySessionDescription', {
      //                 peer_id: peer_id,
      //                 session_description: local_description,
      //               });
      //               console.log('Answer setLocalDescription succeeded');
      //             },
      //             function () {
      //               alert('Answer setLocalDescription failed!');
      //             }
      //           );
      //         },
      //         function (error) {
      //           console.log('Error creating answer: ', error);
      //           console.log(peer);
      //         }
      //       );
      //     }
      //   },
      //   function (error) {
      //     console.log('setRemoteDescription error: ', error);
      //   }
      // );
    });

    /**
     * The offerer will send a number of ICE Candidate blobs to the answerer so they
     * can begin trying to find the best path to one another on the net.
     */
    signaling_socket.on('iceCandidate', function (config) {
      var peer = peers[config.peer_id];
      var ice_candidate = config.ice_candidate;
      peer.addIceCandidate(new RTCIceCandidate(ice_candidate));
    });

    /**
     * When a user leaves a channel (or is disconnected from the
     * signaling server) everyone will recieve a 'removePeer' message
     * telling them to trash the media channels they have open for those
     * that peer. If it was this client that left a channel, they'll also
     * receive the removePeers. If this client was disconnected, they
     * wont receive removePeers, but rather the
     * signaling_socket.on('disconnect') code will kick in and tear down
     * all the peer sessions.
     */
    signaling_socket.on('removePeer', function (config) {
      console.log('Signaling server said to remove peer:', config);
      var peer_id = config.peer_id;
      if (peer_id in peers) {
        peers[peer_id].close();
      }
      delete peers[peer_id];
      delete peer_media_elements[peer_id];

      // NEED FIX: temporarily: destroy remoteVideo
      if (remoteVideo && remoteVideo.current) {
        remoteVideo.current.srcObject = null;
      }
    });

    return () => {
      console.log('Disconnected from signaling server');
      signaling_socket.disconnect();
    };
  });

  return (
    <div>
      <div className="doctor-video">
        <video
          className="remoteVideo"
          ref={remoteVideo}
          autoPlay
          playsInline
        ></video>
      </div>
      <div className="icon-list">
        <div className="icon-list-col">
          <Record onClick={recordAction} />
          <a href="#!">
            <img className="icon" src={ico_camera} />
          </a>
        </div>
        <div className="icon-list-row">
          <AudioIcon onClick={toggleAudio} className="icon_audio" />
          <VideoIcon onClick={toggleVideo} className="icon_audio" />
          <a onClick={hangupAction}>
            <img alt='' className="icon" src={ico_endcall} />
          </a>
        </div>
      </div>

      <div className="box-profile">
        <div className="info">
          <p className="avatar">
            <video
              className="localVideo"
              ref={localVideo}
              autoPlay
              muted
              playsInline
            ></video>
          </p>
          <h2 className="text">
            {firstName || 'N/A'} {lastName || 'N/A'}
          </h2>
          <h5> {role === 'doctor' ? 'Doctor' : 'Patient'} </h5>
        </div>
        <div className="image-file">
          <h5> Images shared</h5>
          <div className="xray-image-view">
            <a href="#!" className="xray-left">
              <img className="icon" src={ico_left} />
            </a>
            <div className="xray-images">
              {image &&
                image.map((item, index) => (
                  <img
                    onClick={() => openAnnotationTool(item.ocrJson[0], index)}
                    className="xray-img"
                    src={item.signedUrl}
                  />
                ))}
            </div>

            <a className="xray-right" href="#!">
              <img className="icon" src={ico_right} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallFrame;
