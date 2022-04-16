import io from 'socket.io-client';
import qs from 'query-string';
import { useSelector, useDispatch } from 'react-redux';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { getAppointment, updateAppointment } from '@apis/appointment';
import { getSignedFileUrl, uploadFile, uploadAudioFile } from '@apis/file';
import { recordAppoiment } from '../../store/actions/appointment.action';
import Swal from 'sweetalert2';

navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

const ICE_SERVERS = [
  {
    url: 'turn:35.232.7.88:3478',
    username: 'testuser',
    credential: 'pass0wrd',
  },
];

let local_stream = null;
let signaling_socket = null;
let peers = {};
let peer_media_elements = {};
let mediaLocalRecorder;
let mediaRemoteRecorder;
let mixedMediaRecorder;
let mixedMediaRecorderBlobs = [];
let mediaLocalRecordedBlobs = [];
let mediaRemoteRecordedBlobs = [];

const callingContext = createContext({});

export const useCalling = () => useContext(callingContext);

export const CallingProvider = ({ children }) => (
  <callingContext.Provider children={children} value={useProviderCalling()} />
);

const useProviderCalling = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const [appointmentData, setAppointmentData] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isFullScreen, setFullScreen] = useState(false);
  const [isFullScreenImage, setFullScreenImage] = useState(false);
  const [canHangUp, setCanHangUp] = useState(false);
  const [currentImage, setCurrentImage] = useState(false);
  const { _id: appointmentId } = qs.parse(location.search);
  const [isRecord, setIsRecord] = useState(false);
  const [isLoadingRecord, setIsLoadingRecord] = useState(false);
  const [isVoice, setIsVoice] = useState(true);
  const [isVideo, setIsVideo] = useState(true);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    getAppointmentData(appointmentId);
  }, []);

  const connectSocket = () => {
    // TODO: handle error case when missing appointmentId
    if (!appointmentId) return;

    signaling_socket = io('wss://dev-signaling.imi.ai');

    signaling_socket.on('connect', async () => {
      await setupLocalStream();
      if (remoteStream && remoteStream.current) {
        remoteStream.current.srcObject = null;
      }
      if (localStream && localStream.current) {
        localStream.current.srcObject = null;
      }

      signaling_socket.emit('join', {
        channel: appointmentId,
        userdata: { 'whatever-you-want-here': 'stuff' },
      });

      setCanHangUp(true);
    });

    signaling_socket.on('addPeer', async (config) => {
      const { peer_id, should_create_offer } = config;

      if (peer_id in peers) return;

      const peer_connection = new RTCPeerConnection(
        { iceServers: ICE_SERVERS },
        { optional: [{ DtlsSrtpKeyAgreement: true }] }
      );

      peers[peer_id] = peer_connection;

      peer_connection.onicecandidate = (event) => {
        event.candidate &&
          signaling_socket.emit('relayICECandidate', {
            peer_id,
            ice_candidate: {
              sdpMLineIndex: event.candidate.sdpMLineIndex,
              candidate: event.candidate.candidate,
            },
          });
      };

      peer_connection.onaddstream = (event) => {
        setRemoteStream(event.stream);
        peer_media_elements[peer_id] = remoteStream;
      };

      peer_connection.addStream(local_stream);

      if (should_create_offer) {
        try {
          const local_description = await peer_connection.createOffer();
          await peer_connection.setLocalDescription(local_description);
          signaling_socket.emit('relaySessionDescription', {
            peer_id,
            session_description: local_description,
          });
        } catch (error) {
          console.error('CALLING-SOCKET:', error);
        }
      }
    });

    signaling_socket.on('sessionDescription', async (config) => {
      const { peer_id, session_description } = config;
      const peer = peers[peer_id];

      try {
        await peer.setRemoteDescription(
          new RTCSessionDescription(session_description)
        );

        if (session_description.type === 'offer') {
          const local_description = await peer.createAnswer();
          await peer.setLocalDescription(local_description);

          signaling_socket.emit('relaySessionDescription', {
            peer_id,
            session_description: local_description,
          });
        }
      } catch (error) {
        console.error('CALLING-SOCKET:', error);
      }
    });

    signaling_socket.on('iceCandidate', ({ peer_id, ice_candidate }) => {
      peers[peer_id].addIceCandidate(new RTCIceCandidate(ice_candidate));
    });

    signaling_socket.on('removePeer', ({ peer_id }) => {
      peer_id in peers && peers[peer_id].close();

      delete peers[peer_id];
      delete peer_media_elements[peer_id];

      remoteStream && setRemoteStream(null);
    });
  };

  const disconnectSocket = () =>
    signaling_socket && signaling_socket.disconnect();

  const mixMediaStream = (streams) => {
    const ctx = new AudioContext();
    const dest = ctx.createMediaStreamDestination();

    streams.forEach((stream) => {
      ctx.createMediaStreamSource(stream).connect(dest);
    });

    return dest.stream;
  };

  const startRecord = (value) => {
    if (!isLoadingRecord) {
      let options = { mimeType: 'audio/webm' };
      let streams = [localStream];

      try {
        mediaLocalRecorder = new MediaRecorder(localStream, options);

        if (remoteStream) {
          streams = [...streams, remoteStream];
          mediaRemoteRecorder = new MediaRecorder(remoteStream, options);
        }

        mixedMediaRecorder = new MediaRecorder(
          mixMediaStream(streams),
          options
        );
      } catch (e) {
        console.error('Exception while creating MediaRecorder:', e);
        return;
      }
      mediaLocalRecorder.ondataavailable = (e) =>
        mediaLocalRecordedBlobs.push(e.data);
      mediaLocalRecorder.start();
      if (remoteStream) {
        mediaRemoteRecorder.ondataavailable = (e) =>
          mediaRemoteRecordedBlobs.push(e.data);
        mediaRemoteRecorder.start();
      }

      mixedMediaRecorder.ondataavailable = (evt) =>
        mixedMediaRecorderBlobs.push(evt.data);
      mixedMediaRecorder.start();
      setIsRecord(true);
    }
  };

  const stopRecord = (value) => {
    mediaLocalRecorder.stop();
    remoteStream && mediaRemoteRecorder.stop();
    mixedMediaRecorder.stop();
    mixedMediaRecorder.onstop = () => {
      const doctor = new Blob(mediaLocalRecordedBlobs, { type: 'audio/mp3' });
      const patient = new Blob(mediaRemoteRecordedBlobs, { type: 'audio/mp3' });
      const record = new Blob(mixedMediaRecorderBlobs, { type: 'audio/mp3' });
      const files = [];
      const data = {
        appointmentId: appointmentId,
        files,
        text_language_code: value,
      };

      files[0] = new File([patient], 'patient.mp3', { type: 'audio/mp3' });
      files[1] = new File([doctor], 'doctor.mp3', { type: 'audio/mp3' });
      files[2] = new File([record], 'record.mp3', { type: 'audio/mp3' });
      uploadAudioFile(data);
      mediaLocalRecordedBlobs = [];
      mediaRemoteRecordedBlobs = [];
      mixedMediaRecorderBlobs = [];
    };
    setIsRecord(false);
    setIsLoadingRecord(true);
    dispatch(recordAppoiment(true));
    setTimeout(() => {
      setIsLoadingRecord(false);
    }, 5000);
  };

  const handleVoice = () => {
    if (localStream) {
      localStream.getAudioTracks()[0].enabled = !isVoice;
      setIsVoice(!isVoice);
    }
  };

  const handleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks()[0].enabled = !isVideo;
      setIsVideo(!isVideo);
    }
  };

  const controller = {
    changeCurrentImage: (image) => setCurrentImage(image),
    toggleVideo: () => handleVideo(),
    toggleAudio: () => handleVoice(),
    toggleFullScreen: () => setFullScreen(!isFullScreen),
    toggleFullScreenImage: () => setFullScreenImage(!isFullScreenImage),
    toggleRecord: (value) =>
      isRecord ? stopRecord(value) : startRecord(value),
    hangUp: () => {
      if (!isLoadingRecord) {
        const confirm = window.confirm('Do you want to end the call?');
        if (confirm) {
          localStream &&
            localStream.getTracks().forEach((track) => track.stop());
          disconnectSocket();
          setCanHangUp(false);
          if (user.role === 'robot') {
            history.push('/');
          } else {
            history.push(`/appointment/${appointmentId}`);
          }
        }
      }
    },
  };

  const setupLocalStream = async () => {
    if (localStream) return;

    try {
      const opts = { audio: true, video: true };
      local_stream = await navigator.mediaDevices.getUserMedia(opts);
      setLocalStream(local_stream);
    } catch (error) {
      alert('Please enable your media devices!');
      throw error;
    }
  };
  const getAppointmentData = async (_id) => {
    try {
      const res = await getAppointment({ _id });
      const { image, video } = res[0];
      let tmp = res[0];
      Promise.all(
        image.map(async (i) => {
          const imageResult = await getSignedFileUrl(i.fileUrl);
          imageResult.fileUrl = i.fileUrl;
          return imageResult;
        })
      ).then((image) => {
        tmp = { ...tmp, image };
        setCurrentImage(image[0]);
        setAppointmentData(tmp);
      });

      Promise.all(
        video.map(async (i) => {
          const videoResult = await getSignedFileUrl(i.fileUrl);
          videoResult.fileUrl = i.fileUrl;
          return videoResult;
        })
      ).then((video) => {
        tmp = { ...tmp, video };
        setAppointmentData(tmp);
      });
    } catch (error) {
      console.error('CALLING:', error);
    }
  };

  const upload = async ({ file, user }) => {
    try {
      let query = {
        appointmentId: appointmentData._id,
        status: 1,
        mode: 2,
        image: appointmentData.image,
        video: appointmentData.video,
      };

      setLoading(true);

      if (file.size > 25000000) {
        setLoading(false);
        return alert('Your file is larger than 25mb!');
      }

      switch (file.type) {
        case 'image/png':
        case 'image/jpeg':
        case 'image/svg+xml':
        case 'image/bmp':
        case 'application/pdf': {
          // TODO: handle upload image
          const uploadedFile = await uploadFile({ file, patientId: user._id });
          query.image = [...query.image, uploadedFile];
          delete query.video;
          const res = await updateAppointment(query);
          let tmp = res;
          const { image, video } = res;
          Promise.all(
            image.map(async (i) => {
              const imageResult = await getSignedFileUrl(i.fileUrl);
              imageResult.fileUrl = i.fileUrl;
              return imageResult;
            })
          ).then((image) => {
            tmp = { ...tmp, image };
            setCurrentImage(image[0]);
            setAppointmentData(tmp);
          });

          Promise.all(
            video.map(async (i) => {
              const videoResult = await getSignedFileUrl(i.fileUrl);
              videoResult.fileUrl = i.fileUrl;
              return videoResult;
            })
          ).then((video) => {
            tmp = { ...tmp, video };
            setAppointmentData(tmp);
          });

          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Uploaded',
            showConfirmButton: true,
            timer: 1500,
          });
          return;
        }

        case 'video/webm':
        case 'video/mp4': {
          // TODO: handle upload video
          const uploadedFile = await uploadFile({ file, patientId: user._id });
          query.video = [...query.video, uploadedFile];
          delete query.image;
          const res = await updateAppointment(query);
          setAppointmentData({ ...appointmentData, video: res.video });
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Uploaded',
            showConfirmButton: true,
            timer: 1500,
          });
          return;
        }

        default:
          return alert('The file type is not supported!');
      }
    } catch (error) {
      console.error('CALLING:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    appointmentData,
    localStream,
    remoteStream,
    isFullScreen,
    isFullScreenImage,
    canHangUp,
    controller,
    connectSocket,
    disconnectSocket,
    currentImage,
    upload,
    isLoading,
    isLoadingRecord,
    isRecord,
    isVoice,
    isVideo,
  };
};
