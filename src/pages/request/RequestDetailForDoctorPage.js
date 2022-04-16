import React, { useState, useEffect } from 'react';
import { useSelector} from 'react-redux';
import { toast } from 'react-toastify';

// Material UI
import Divider from 'material-ui/Divider';
import Button from '@material-ui/core/Button';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import CommentIcon from '@material-ui/icons/CommentOutlined';
import ApproveIcon from '@material-ui/icons/AssignmentTurnedIn';
import UpdateIcon from '@material-ui/icons/UpdateOutlined';
import AcceptIcon from '@material-ui/icons/DoneAllOutlined';
import ReOpenIcon from '@material-ui/icons/LockOpenOutlined';
import QuestionIcon from '@material-ui/icons/QuestionAnswerOutlined';
import GeneralIcon from '@material-ui/icons/AssignmentIndOutlined';
import AddedInfoIcon from '@material-ui/icons/AssignmentOutlined';
import AssessmentIcon from '@material-ui/icons/AssessmentOutlined';
import AssignmentIcon from '@material-ui/icons/BookmarkBorderOutlined';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdfOutlined';
import AddOutlined from '@material-ui/icons/AddOutlined';

import{
  Document,
  Page,
  Text,
  View,
  pdf,
  Font,
  Image,
  Link,
} from '@react-pdf/renderer';

import '../../static/css/request-detail-for-doctor.css';
import defaultAva from '../../img/d_ava.png';
import Panel from '../../components/panel';
import AddCommentPanel from '../../components/panels/addCommentPanel';
import DialogPdfPreview from '../../components/dialog/dialogPdfPreview';

import FileAnnotationView from './subComponents/FileAnnotationView';

// Canvas
import Canvas from '../../components/canvas';
import DicomViewer from '../../components/canvas/dcmView';
import { TYPES } from '../../components/canvas/variables';

import {
  convertToDiseaseName,
  convertDate,
  convertToStatusName,
  isURL,
  getTokenFromLocalStorage,
} from '../../utils';

import {
  DOCTOR_ROLE,
  PATIENT_ROLE,
  IMAGE_TYPES,
  PDF_TYPE,
  IMAGE_MODE,
  PDF_MODE,
  HOST,
  FILE_URI,
  TOKEN_KEY,
} from '../../constant.js';

// API Call
import {
  getRequestDetailApiCall,
  updateRequestApiCall,
} from '../../apiCalls/request.api';
import {
  oldUploadFileApiCall,
  getPublicUrlApiCall,
} from '../../apiCalls/file.api';

import styles from './styles';
import ReactPlayer from 'react-player';

const dic = {
  1: 'Diet',
  2: 'Exercise',
  3: 'Additional testing',
  4: 'Other habits',
};

Font.register({
  family: 'Roboto-Bold',
  src: `https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto_condensed/robotocondensed-bold-webfont.ttf`,
});

Font.register({
  family: 'Roboto-Regular',
  src: `https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto_condensed/robotocondensed-regular-webfont.ttf`,
});

export default function RequestDetailForDoctor(props) {
  const canvasRef = React.createRef();
  const dcmLoaderRef = React.createRef();
  const [currentState, setCurrentState] = useState({
    request: {},
    comment: {
      commentType: null,
      title: null,
      description: null,
      link: null,
      fileType: null,
    },
    isOpenCommentBox: false,
    linkFileToOpen: null,
    fileTypeToOpen: null,
    currentOcr: null,
    isToolOpen: false,
    currentOcrImageType: 'pdf',
    fileReview: 0,
  });
  const requestId = props.match.params.requestId;

  const {
    request = {},
    fileTypeToOpen,
    linkFileToOpen,
    isToolOpen,
    isOpenCommentBox,
    currentOcrImageType,
    currentOcr,
  } = currentState;

  const {
    bloodTest,
    radiology,
    biopsy,
    urineTest,
    anotherDocuments,
    status,
    impression = '',
    consultationLink = '',
    addedInfo = [],
    comments = [],
    video = [],
    questions = [],
    type,
    createdAt,
  } = request;

  const isDisplayAddedInfo = addedInfo.length > 0;
  const isDisplayComments = comments.length > 0;
  const isDisplayQuestions = questions.length > 0 && type > 0;
  const user = useSelector((state) => state.user) || {};
  const {
    role = PATIENT_ROLE,
    firstName = 'N/A',
    lastName = 'N/A',
    avatarUrl = '',
    credential = '',
  } = user;
  const patient = request.user || {};
  const {
    avatarUrl: patientAvatarUrl = defaultAva,
    firstName: patientFirstName,
    email: patientEmail,
  } = patient;

  let fileModeToOpen;
  if (IMAGE_TYPES.includes(fileTypeToOpen)) fileModeToOpen = IMAGE_MODE;
  else if (fileTypeToOpen === PDF_TYPE) fileModeToOpen = PDF_MODE;
  else fileModeToOpen = 'video';

  const isOpenFile =
    isURL(linkFileToOpen) &&
    fileModeToOpen &&
    [PDF_MODE, IMAGE_MODE].includes(fileModeToOpen);

  // Get current question to answer.
  const commentValue = currentState.comment;

  // Sort consultations based on createdAt
  comments.sort(
    (commentA, commentB) =>
      convertDate(commentB.createdAt) - convertDate(commentA.createdAt)
  );

  const actions = [
    <FlatButton
      label="Close"
      primary={true}
      onClick={(e) => closeCommentBox(e)}
    />,
    <FlatButton
      label="Submit"
      primary={true}
      onClick={(e) => submitComment(e, commentValue)}
    />,
  ];

  useEffect(() => {
    if (requestId && requestId !== '') {
      getRequestDetailApiCall(requestId)
        .then((result) => {
          const { data, questions = [] } = result;
          if (!result.data.code) {
            setCurrentState({
              ...currentState,
              ...{ request: data, questions },
            });
          }
        })
        .catch(() => {
          // FIXME: FAILED_TO_GET_REQUEST
        });
    } else {
      // FIXME
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * =============================
   * BEGIN TOAST NOTIFICATION
   * =============================
   */

  let toastId = null;

  const notify = () =>
    (toastId = toast('Uploading File...', {
      className: 'toast-container',
    }));

  const notifyAddingComment = () =>
    (toastId = toast('Adding Comment...', {
      className: 'toast-container',
    }));

  const notifyChangingStatus = () =>
    (toastId = toast('Updating Status...', {
      className: 'toast-container',
    }));

  const notifyGeneratingPdf = () =>
    (toastId = toast('Merging all PDF Files...', {
      className: 'toast-container',
      autoClose: 10000,
    }));

  const notifyUpdatingRequest = () =>
    (toastId = toast('Updating Request...', {
      className: 'toast-container',
      // autoClose: 3000,
    }));

  const notifyExportingRequest = () =>
    (toastId = toast('Exporting Request...', {
      className: 'toast-container',
      autoClose: 10000,
    }));

  const notifyExportedRequest = () => {
    toast.update(toastId, {
      render: 'Exported Request',
      type: toast.TYPE.INFO,
      className: 'update-toast-container',
      progressClassName: 'update-progress-bar',
      autoClose: 1000,
    });
  };

  const notifyUpdatingAnnotation = () =>
    (toastId = toast(
      'Update Annotation, it might take from 5 up to 15 seconds.',
      {
        className: 'toast-container',
        autoClose: 20000,
      }
    ));

  /**
   * =============================
   * END TOAST NOTIFICATION
   * =============================
   */

  /**
   * =============================
   * BEGIN SUBMIT HANDLER
   * =============================
   */

  const onComplete = (e) => {
    const { request } = currentState || {};
    const { comments = [], impression = '' } = request || [];

    // Doctor need to give comments before completing
    if (comments.length > 0 && impression.length > 0) {
      changeRequestStatus(e, 2, 1);
    } else {
      toast.error('General impression and Comments required', {
        className: 'error-toast-container',
        autoClose: 10000,
      });
    }
  };

  /**
   * Save all Request Detail in one
   */
  const saveAll = (e) => {
    notifyUpdatingRequest();

    const { comment, request: curRequest } = currentState;
    const questions = curRequest.questions;
    const request = {
      requestId,
      data: {
        impression: curRequest.impression,
        consultationLink: curRequest.consultationLink,
        consultationType: curRequest.consultationType,
        questions,
        comment,
        ...{ mode: 4 },
      },
    };

    updateRequestApiCall(request).then((result) => {
      const { data = {} } = result;
      if (!result.data.code) {
        setTimeout(() => {
          toast.update(toastId, {
            render: 'Request Saved',
            type: toast.TYPE.INFO,
            className: 'update-toast-container',
            progressClassName: 'update-progress-bar',
            autoClose: 1000,
          });
          setCurrentState({
            ...currentState,
            ...{ request: data },
          });
        }, 1000);
      }
    });
  };

  const changeRequestStatus = (e, status, mode) => {
    // Change from 0 to 1
    if (mode !== 1)
      return toast.error('Update status failed', {
        className: 'error-toast-container',
        autoClose: 10000,
      });

    const request = { requestId, data: { status, mode } };
    notifyChangingStatus();
    return updateRequestApiCall(request)
      .then((result) => {
        const { status, data = {} } = result;
        if (status === 200) {
          setCurrentState({ ...currentState, ...{ request: data } });

          toast.update(toastId, {
            render: 'Status Updated',
            type: toast.TYPE.INFO,
            className: 'update-toast-container',
            progressClassName: 'update-progress-bar',
            autoClose: 1000,
          });

          window.location = "/"
        }
      })
      .catch(() => {
        toast.error('Update status failed', {
          className: 'error-toast-container',
          autoClose: 10000,
        });
      });
  };

  /**
   * =============================
   * BEGIN ANNOTATION FUNCTIONS
   * =============================
   */
  const updateAnnotation = (id, data) => {
    const {
      currentOcrIndex,
      currentOcrType,
      request,
    } = currentState;

    notifyUpdatingAnnotation();

    const canvas = canvasRef.current;
    canvas.resetLayer(async () => {
      const imageData = canvas.toImageData();
      const imageBlob = await (await fetch(imageData)).blob();
      const dataToUpload = {
        file: imageBlob,
        patientId: currentState.request.user._id,
        fileName: `${currentOcrType}-${currentOcrIndex}-annotation.png`,
        requestId,
      };
      oldUploadFileApiCall(dataToUpload)
        .then((res) => {
          if (!res.data.code) {
            let updatedOcr = request[currentOcrType];
            let dataTemp = updatedOcr[currentOcrIndex].ocrJson[0]
            dataTemp.note = data.note

            updatedOcr[currentOcrIndex].ocrJson[0] = {
              ...dataTemp,
              imageUrl: res.data.fileUrl,
            };

            const requestToUpdate = {
              requestId,
              data: { [currentOcrType]: updatedOcr, mode: 4 },
            };

            updateRequestApiCall(requestToUpdate)
              .then((result) => {
                if (!result.data.code) {
                  toast.update(toastId, {
                    render: 'Request updated',
                    type: toast.TYPE.INFO,
                    className: 'update-toast-container',
                    progressClassName: 'update-progress-bar',
                    autoClose: 1000,
                  });
                  setCurrentState({
                    ...currentState,
                    ...{
                      request: result.data,
                      isToolOpen: false,
                      currentOcr: updatedOcr[currentOcrIndex].ocrJson[0],
                    },
                  });
                }
              })
              .catch((e) => console.log(`fail to update request ocr`, e));
          }
        })
        .catch((e) => console.log(`failed to upload new OCR to cloud`, e));
    });
  };

  const getPublicTestLink = (test, index) => {
    return new Promise(async (resolve, reject) => {
      const resultToReturn = {};
      const itemUrl = test.ocrJson[0].imageUrl;
      if (!test.ocrJson[0].imageUrl) return reject();

      const result = await getPublicUrl(itemUrl);

      resultToReturn.url = result;
      resultToReturn.type = !test.ocrJson[0].imageUrl ? 'pdf' : 'image';

      resolve(resultToReturn);
    });
  };

  const commentOrder = ['Diet', 'Exercise', 'Additional testing'];
  const pdfProfile = (
    <Page wrap>
      <View style={styles.header}>
        <View style={styles.comInfo}>
          <Text style={styles.text}>IMI AI Inc.</Text>
          <Link to="" style={styles.text} src="https://imi.ai/">
            https://imi.ai/
          </Link>
          <Link to="" style={styles.text} src="mailto:contact@imi.ai">
            contact@imi.ai{' '}
          </Link>
        </View>
        <View style={styles.logo}>
          <Image src="https://storage.googleapis.com/imi-ocr/IMI_Logo_(RGB).png" />
        </View>
      </View>
      <View style={[styles.divider, { backgroundColor: '#5172ff' }]} />
      <View style={[styles.divider, { backgroundColor: 'white' }]} />
      <View style={[styles.divider, { backgroundColor: '#42c6ac' }]} />
      <View style={styles.body}>
        <Text style={styles.title}>Doctor’s Profile</Text>
        <View style={styles.doctorAva}>
          <Image src={avatarUrl || defaultAva} />
        </View>
        <Text style={styles.text}>
          {firstName || 'N/A'} {lastName || 'N/A'}, {credential || ''}
        </Text>
        <Text style={styles.bio}>{user.bio || 'N/A'}</Text>
        <View style={[styles.dividerBody, { backgroundColor: 'white' }]} />
        <View style={styles.dividerBodyMain} />
        <View style={[styles.dividerBody, { backgroundColor: 'white' }]} />
        <Text style={styles.text}>
          Dear {patientFirstName || patientEmail},
        </Text>
        <Text style={styles.text}>
          Thank you for seeking health advice from us. Below please find our
          general impression of your overall health and our answers to your
          specific questions. We have also made some comments that you can
          implement to improve your health.{' '}
        </Text>
        <Text style={styles.title}>General Impression</Text>
        <Text style={styles.text}>{impression || 'N/A'}</Text>
        {isDisplayQuestions && (
          <Text style={styles.title}>Answers to patient’s questions</Text>
        )}
        {isDisplayQuestions &&
          questions.map((question, index) => (
            <View key={index}>
              <Text style={styles.text}>
                {index + 1}. {question.content || 'N/A'}
              </Text>
              <Text style={styles.text}>
                {((question.answers || [])[0] || {}).content || 'N/A'}
              </Text>
            </View>
          ))}
        <Text style={styles.title}>Comments</Text>
        {comments &&
          comments.length > 0 &&
          comments
            .sort(
              (a, b) =>
                commentOrder.indexOf(a.title) - commentOrder.indexOf(b.title)
            )
            .map((comment, index) => (
              <View  key={index}>
                <Text style={styles.recTitle}>- {comment.title}</Text>
                <Text style={styles.recText}>{comment.description}</Text>
              </View>
            ))}
        <Text style={styles.title}>Disclaimer</Text>
        <Text style={styles.text}>
          - Comments made based on available records without examining the
          patient.
        </Text>
      </View>
    </Page>
  );

  const pdfMergeFile = async () => {
    const {
      request: { bloodTest, radiology, biopsy, urineTest },
    } = currentState || {};
    // console.log('pdfMergeFile', { bloodTest, radiology, biopsy, urineTest });
    try {
      const bloodTestLinks = await Promise.all(
        bloodTest.map(getPublicTestLink)
      );
      const radiologyLinks = await Promise.all(
        radiology.map(getPublicTestLink)
      );
      const biopsyLinks = await Promise.all(biopsy.map(getPublicTestLink));
      const urineTestLinks = await Promise.all(
        urineTest.map(getPublicTestLink)
      );
      // console.log({ bloodTestLinks });
      // console.log({ radiologyLinks });
      // console.log({ biopsyLinks });
      // console.log({ urineTestLinks });

      return (
        <Document>
          {pdfProfile}
          {bloodTest &&
            bloodTestLinks.map(
              (o, index) =>
                o.type === 'image' && (
                  <Page key={index}>
                    <View>
                      <Image src={o.url} />
                    </View>
                  </Page>
                )
            )}

          {radiology &&
            radiologyLinks.map(
              (o, index) =>
                o.type === 'image' && (
                  <Page key={index}>
                    <View>
                      <Image src={o.url} />
                    </View>
                  </Page>
                )
            )}
          {biopsy &&
            biopsyLinks.map(
              (o) =>
                o.type === 'image' && (
                  <Page>
                    <View>
                      <Image src={o.url} />
                    </View>
                  </Page>
                )
            )}
          {urineTest &&
            urineTestLinks.map(
              (o, index) =>
                o.type === 'image' && (
                  <Page index>
                    <View>
                      <Image src={o.url} />
                    </View>
                  </Page>
                )
            )}
        </Document>
      );
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  const generatePdf = async (e) => {
    const { comment, request} = currentState || {};
    const { comments = [], impression, user, questions } = request;

    // 1. Merge PDF and all tests
    const pdfDoc = await pdfMergeFile();

    if (!pdfDoc)
      return toast.error('You need to review all the files.', {
        className: 'error-toast-container',
        autoClose: 5000,
      });

    if (comments.length > 0 && impression && pdfDoc) {
      notifyGeneratingPdf();

      pdf(pdfDoc)
        .toBlob()
        .then((consultation) => {
          console.log('generatePdf -> consultation', consultation);
          // Already complete generating PDF

          toast.update(toastId, {
            render: 'Finish Merging',
            type: toast.TYPE.INFO,
            className: 'update-toast-container',
            progressClassName: 'update-progress-bar',
            autoClose: 500,
          });

          toastId = toast('Genegrating PDF, please wait...', {
            className: 'toast-container',
            autoClose: 25000,
          });

          const data = {
            patientId: user._id,
            fileName: 'report.pdf',
            file: consultation,
            requestId,
          };

          const consultationType = consultation.type;

          // 2. Upload File PDF
          oldUploadFileApiCall(data)
            .then((res) => {
              console.log('upload file PDF to cloud');
              if (!res.data.code) {
                if (toastId)
                  toast.update(toastId, {
                    render: 'PDF Genrated',
                    type: toast.TYPE.INFO,
                    className: 'update-toast-container',
                    progressClassName: 'update-progress-bar',
                    autoClose: 1000,
                  });
                else
                  toastId = toast('PDF Genrated', {
                    className: 'toast-container',
                    type: toast.TYPE.INFO,
                    progressClassName: 'update-progress-bar',
                    autoClose: 1000,
                  });
                const { fileUrl: consultationLink } = res.data || [];

                const newRequest = {
                  ...request,
                  ...{ consultationLink, consultationType },
                };
                const newState = {
                  ...currentState,
                  ...{ request: newRequest },
                };
                setCurrentState(newState);

                const requestToUpdate = {
                  requestId,
                  data: {
                    consultationLink,
                    consultationType,
                    impression,
                    questions,
                    comment,
                    mode: 4,
                  },
                };

                notifyUpdatingRequest();

                updateRequestApiCall(requestToUpdate)
                  .then((result) => {
                    if (!result.data.code) {
                      console.log('update Request successfully');
                      setTimeout(() => {
                        toast.update(toastId, {
                          render: 'Request updated',
                          type: toast.TYPE.INFO,
                          className: 'update-toast-container',
                          progressClassName: 'update-progress-bar',
                          autoClose: 1000,
                        });
                      }, 1500);
                    }
                  })
                  .catch((e) => console.log(`failed to update request`, e));
              }
            })
            .catch((e) => console.log('upload fault', e));
        })
        .catch((e) => console.log(e));
    } else {
      toast.error('General impression and Comments required', {
        className: 'error-toast-container',
        autoClose: 10000,
      });
    }
  };

  const onResetCanvas = () => {
    const { currentOcr, currentOcrType, currentOcrIndex } = currentState;
    getRequestDetailApiCall(requestId)
      .then(async (res) => {
        if (!res.data.code) {
          const resetCurrentOcr =
            res.data?.[currentOcrType][currentOcrIndex].ocrJson[0];
          resetCurrentOcr.publicOcrLink = currentOcr.publicOcrLink;
          setCurrentState({
            ...currentState,
            ...{ request: res.data, currentOcr: resetCurrentOcr },
          });
        }
      })
      .catch(() => {
        // !Fixme
      });
  };

  const isDicom = (url = '') => {
    const imageFormat = ['.jpg', '.png', '.gif', '.pdf'];
    return imageFormat.indexOf(url.substring(url.length - 4)) === -1;
  };

  const openAnnotationTool = async (ocr, currentOcrType, currentOcrIndex) => {
    let currentOcrImageType;
    if (ocr.ocrJson && ocr.ocrJson.length > 0) {
      const currentOcr = ocr.ocrJson[0];
      const cloudPrivateUrl = ocr?.fileUrl;

      if (isDicom(cloudPrivateUrl)) currentOcrImageType = TYPES.XRAY;
      else currentOcrImageType = TYPES.PDF;
      currentOcr.publicOcrLink = await getPublicUrl(cloudPrivateUrl);

      setCurrentState({
        ...currentState,
        currentOcrImageType,
        currentOcrIndex,
        currentOcrType,
        currentOcr,
        isToolOpen: true,
      });
    }
  };

  const getPublicUrl = async (itemUrl) => {
    const data = {
      itemUrl,
      redirect: false,
      requestId,
    };
    let result = '';

    await getPublicUrlApiCall(data)
      .then((res) => {
        if (!res.data.code) result = res.data.signedUrl;
      })
      .catch((e) => console.log(e));

    return result;
  };

  const closeAnnotationTool = () => {
    setCurrentState({ ...currentState, isToolOpen: false });
  };

  /**
   * =============================
   * END ANNOTATION FUNCTIONS
   * =============================
   */

  /**
   * =============================
   * BEGIN IMPRESSION HANDLER
   * =============================
   */

  const handleImpressionChange = (e) => {
    const { name } = e.target;
    const { request } = currentState || {};
    if (name === 'impression') {
      const newRequest = { ...request, ...{ impression: e.target.value } };
      setCurrentState(
        { ...currentState, ...{ request: newRequest } },
        () => {}
      );
    }
  };

  /**
   * =============================
   * BEGIN ANSWER QUESTIONS HANDLER
   * =============================
   */

  const handleAnswerChange = (e, questionIndex, answerIndex) => {
    const { value } = e.target;
    const { request } = currentState || {};

    const { questions } = request || [];
    const question = questions[questionIndex];

    const newAnswers = [
      {
        content: value || ' ',
        questionIndex,
        answerIndex,
      },
    ];

    const newQuestion = { ...question, ...{ answers: newAnswers } };

    const newState = {
      ...currentState,
      ...{
        request: {
          ...request,
          ...{
            questions: [
              ...questions.slice(0, questionIndex),
              newQuestion,
              ...questions.slice(questionIndex + 1),
            ],
          },
        },
      },
    };

    setCurrentState(newState);
  };

  /**
   * =============================
   * END ANSWER QUESTIONS HANDLER
   * =============================
   */

  /**
   * =============================
   * BEGIN COMMENT HANDLER
   * =============================
   */

  const handleCommentChange = (e) => {
    const { name, value } = e.target;
    const type = name[0];
    const {comment} = currentState || {};
    let newState;

    // Consultation
    let newComment = {};
    switch (type) {
      case 't':
        newComment = {
          ...comment,
          ...{ title: value },
          ...{ commentType: parseInt(value) },
        };
        break;
      case 'd':
        newComment = { ...comment, ...{ description: value } };
        break;
      default:
        break;
    }

    newState = { ...currentState, ...{ comment: newComment } };

    setCurrentState(newState, () => {});
  };

  const uploadCommentFile = (e, type) => {
    // FIX_ME: validate to allow only one file
    const { files } = e.target || [];
    notify();
    if (files.length === 1) {
      // this.props.uploadFile(selectorFiles[0]);
      const file = files[0];
      const fileType = file['type'];
      oldUploadFileApiCall(file).then((res) => {
        const { status, data } = res;
        const { fileUrl } = data || null;
        if (status === 200 && fileUrl.length > 0) {
          toast.update(toastId, {
            render: 'Uploaded',
            type: toast.TYPE.INFO,
            className: 'update-toast-container',
            progressClassName: 'update-progress-bar',
            autoClose: 1000,
          });

          const { comment } = currentState || {};
          let newComment;

          // Update link of Comment
          if (type === 'u-comment') {
            newComment = { ...comment, ...{ link: fileUrl, fileType } };
            const newState = { ...currentState, ...{ comment: newComment } };
            setCurrentState(newState);
          } else {
            return;
          }
        }
      });
    }
  };

  const submitComment = (e, commentValue) => {
    // const comment = currentState.comment;
    const { title, description } = commentValue;

    if (title && description) {
      commentValue['title'] = dic[title];

      const request = {
        requestId,
        data: {
          ...commentValue,
          ...{ mode: 2 },
        },
      };

      notifyAddingComment();

      updateRequestApiCall(request)
        .then((result) => {
          const { status, data = {} } = result;
          if (status === 200) {
            const { comments } = data;
            const newRequest = {
              ...currentState.request,
              ...{ comments },
            };
            const newState = {
              ...currentState,
              ...{ request: newRequest, isOpenCommentBox: false },
            };

            setCurrentState(newState);

            toast.update(toastId, {
              render: 'Consulation Added',
              type: toast.TYPE.INFO,
              className: 'update-toast-container',
              progressClassName: 'update-progress-bar',
              autoClose: 1000,
            });
          } else {
            // Notify Error
            toast.error('Add Consulation failed', {
              className: 'error-toast-container',
              autoClose: 10000,
            });
          }
        })
        .catch(() => {
          // FIXME
          toast.error('Add Consulation failed', {
            className: 'error-toast-container',
            autoClose: 10000,
          });
        });
    } else {
    }
  };

  const closeCommentBox = (e) => {
    setCurrentState({ ...currentState, ...{ isOpenCommentBox: false } });
  };

  const openCommentBox = (e) => {
    setCurrentState({
      ...currentState,
      ...{
        isOpenCommentBox: true,
        comment: {
          title: '1',
          commentType: 1,
          description: null,
          link: null,
          fileType: null,
        },
      },
    });
  };

  const onPreviewComment = (e) => {
    const {
      comment: { link = null, fileType = null },
    } = currentState || {};
    if (isURL(link) && fileType) openPdfPreview(link, fileType);
  };

  /**
   * =============================
   * END COMMENT HANDLER
   * =============================
   */

  const openPdfPreview = (link, type) => {
    if (isURL(link) && type)
      setCurrentState({
        ...currentState,
        ...{ linkFileToOpen: link, fileTypeToOpen: type },
      });
  };

  const closeFilePreview = (e) => {
    setCurrentState({
      ...currentState,
      ...{ linkFileToOpen: null, fileTypeToOpen: null },
    });
  };

  const openCloudPublicUrl = (itemUrl, redirect) => {
    const data = {
      itemUrl,
      redirect,
      requestId,
    };

    getPublicUrlApiCall(data)
      .then((res) => {
        if (!res.data.code) {
          const { signedUrl, fileType } = res.data;
          if (!redirect) openPdfPreview(signedUrl, fileType);
        }
      })
      .catch((e) => console.log(e));
  };
  return (
    <div className="request-page">
      <div className="container">
        <h1> Request Detail</h1>
        <Panel righticon={false}>
          <div className="col-md-12">
            <div className="review-item">
              <div className="row">
                <div className="col-md-4">
                  <h6>
                    <GeneralIcon style={styles.MarginRight10} />
                    General Information
                  </h6>
                </div>
                <div className="col-md-8">
                  <div style={styles.Actions}>
                    {role === DOCTOR_ROLE && status === 0 && (
                      <div>
                        <Button
                          style={styles.MarginRight10}
                          onClick={(e) =>
                            changeRequestStatus(e, request._id, 1, 1)
                          }
                          variant="outlined"
                          component="span"
                        >
                          <AcceptIcon />
                          Accept
                        </Button>
                      </div>
                    )}
                    {role === DOCTOR_ROLE && status === 1 && (
                      <div>
                        <Button
                          style={styles.updateButton}
                          onClick={(e) => saveAll(e)}
                          variant="outlined"
                          component="span"
                        >
                          <UpdateIcon style={styles.MarginRight10} />
                          Save
                        </Button>
                        <Button
                          style={styles.MarginRight10}
                          onClick={(e) => generatePdf(e)}
                          variant="outlined"
                          component="span"
                        >
                          <PictureAsPdfIcon style={styles.MarginRight10} />
                          Generate Report
                        </Button>
                        {consultationLink && consultationLink.length > 0 && (
                          <Button
                            style={styles.MarginRight10}
                            onClick={(e) => onComplete(e, request._id)}
                            variant="outlined"
                            component="span"
                          >
                            <ApproveIcon style={styles.MarginRight10} />
                            Send Report
                          </Button>
                        )}
                      </div>
                    )}
                    {role === DOCTOR_ROLE && status === 2 && (
                      <div>
                        <Button
                          style={styles.MarginRight10}
                          onClick={(e) =>
                            changeRequestStatus(e, request._id, 1, 1)
                          }
                          variant="outlined"
                          component="span"
                        >
                          <ReOpenIcon style={styles.MarginRight10} />
                          RE-OPEN
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Divider />
              <ul className="list-unstyled">
                <li>
                  <span>Status:</span>{' '}
                  <strong style={styles.detailStatus}>
                    {convertToStatusName(status)}
                  </strong>
                </li>
                {consultationLink && consultationLink.length > 0 && (
                  <li>
                    <span>Report:</span>
                    <Button
                      style={styles.cancelButton}
                      variant="outlined"
                      component="span"
                      onClick={() =>
                        openCloudPublicUrl(consultationLink, false)
                      }
                    >
                      View Report
                    </Button>
                  </li>
                )}
                <li>
                  <span>Request Date &amp; Time:</span>{' '}
                  <strong>{convertDate(createdAt, 'string')}</strong>
                </li>
                <li>
                  <span>Request Type:</span>{' '}
                  <strong>{convertToDiseaseName(type || 1)}</strong>
                </li>
                <FileAnnotationView
                  title="Blood Test"
                  fileType="bloodTest"
                  status={status}
                  fileList={bloodTest}
                  requestId={requestId}
                  openAnnotationTool={openAnnotationTool}
                />             
                {/* <FileAnnotationView
                  title="Radiology Test"
                  fileType="radiology"
                  status={status}
                  fileList={radiology}
                  requestId={requestId}
                  openAnnotationTool={openAnnotationTool}
                />

                <FileAnnotationView
                  title="Biopsy Test"
                  fileType="biopsy"
                  status={status}
                  fileList={biopsy}
                  requestId={requestId}
                  openAnnotationTool={openAnnotationTool}
                />
                <FileAnnotationView
                  title="UrineTest Test"
                  fileType="urineTest"
                  status={status}
                  fileList={urineTest}
                  requestId={requestId}
                  openAnnotationTool={openAnnotationTool}
                /> */}
                
                  <li style={{alignItems: "unset"}} className="custom-button-detailRequestDoctor">
                    <span>Video:</span>
                    {video && video.length > 0 && video[0] !== null ? ( 
                      <Button
                        style={styles.cancelButton}
                        variant="outlined"
                        component="span"
                        onClick={() =>
                          openCloudPublicUrl(video[0].fileUrl, false)
                        }
                      >
                        View Video
                      </Button>
                    ) : <div>N/A</div>}
                  </li>
                
                {anotherDocuments && anotherDocuments.length >0 && (
                   <li style={{alignItems: "unset"}}>
                   <span>Other Documents:</span>{' '}
                    <div className="custom-button-detailRequestDoctor" style={{display:'grid', gridGap:'10px'}}>
                    {anotherDocuments.map((item, index) =>{
                      return  (<Button
                          key={index}
                          style={styles.cancelButton}
                          variant="outlined"
                          component="span"
                          onClick={() => openCloudPublicUrl(item.fileUrl, false)}
                          >
                          <p className='name-file' style={{marginBottom: "0px"}} >{item.fileName}</p>
                      </Button>)
                    })}
                    </div>
                 </li>
                )}
              </ul>
            </div>

            {isDisplayAddedInfo &&
              addedInfo.map((info, index) => (
                <div className="review-item" key={index}>
                  <h6>
                    {' '}
                    <AddedInfoIcon style={styles.MarginRight10} /> Additional
                    Information
                  </h6>
                  <Divider />
                  <ul className="list-unstyled">
                    <li>
                      <span>Title:</span> <strong>{info.title || 'N/A'}</strong>
                    </li>
                    <li>
                      <span>Description:</span>{' '}
                      <strong>{info.description || 'N/A'}</strong>
                    </li>
                    {info.link && (
                      <li>
                        <span>Link:</span>{' '}
                        <strong>
                          <a
                            target="_blank"
                            href={`${HOST}${FILE_URI}?cloudUrl=${
                              info.link
                            }&redirect=true&token=${getTokenFromLocalStorage(
                              TOKEN_KEY
                            )}&requestId=${requestId}`}
                          >
                            {info.fileName || 'View Link'}
                          </a>
                        </strong>
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            {linkFileToOpen && fileModeToOpen === 'video' && (
              <div>
                <FlatButton
                  label="Close"
                  primary={true}
                  onClick={(e) => closeFilePreview(e)}
                />
                <ReactPlayer
                  url={linkFileToOpen}
                  width="100%"
                  height="100%"
                  playing="true"
                  controls="true"
                />
              </div>
            )}
            <div className="review-item">
              <h6>
                <AssignmentIcon style={styles.MarginRight10} />
                General Impression
              </h6>

              {status === 1 && (
                <TextField
                  floatingLabelText="General impression"
                  hintText="Type the general impression"
                  fullWidth={true}
                  multiLine={true}
                  rows={4}
                  onChange={(e) => handleImpressionChange(e)}
                  value={impression}
                  name="impression"
                  disabled={request.status !==1}
                />
              )}
            </div>

            <br />

            {isDisplayQuestions &&
              questions.map((question, questionIndex) => (
                <div className="review-item" key={questionIndex}>
                  <h6>
                    <QuestionIcon style={styles.MarginRight10} />
                    Question
                  </h6>
                  <Divider />
                  <ul className="list-unstyled">
                    <li>
                      <strong style={styles.QuestionContent}>
                        <Avatar
                          className="upload-avatar"
                          src={patientAvatarUrl}
                          style={{
                            width: '30px',
                            height: '30px',
                            marginRight: '10px',
                          }}
                        />
                        {question.content || 'N/A'}
                      </strong>
                    </li>
                    {status === 1 && (
                      <div style={styles.AnswersBlock}>
                        <div>
                          <h6>
                            <CommentIcon style={styles.MarginRight10} />
                            Answer
                          </h6>
                          <Divider />
                          <TextField
                            floatingLabelText="Type Your Answer here!"
                            hintText="Type Your Answer here"
                            fullWidth={true}
                            multiLine={true}
                            rows={4}
                            onChange={(e) =>
                              handleAnswerChange(e, questionIndex, 0)
                            }
                            value={
                              ((question.answers || [])[0] || {}).content || ''
                            }
                            name="answer"
                            disabled={request.status !== 1}
                          />
                        </div>
                      </div>
                    )}
                    <br />
                  </ul>
                </div>
              ))}
            {isDisplayComments && (
              <div className="doctor-reviews">
                <h6 className="request-detail-comment-title">
                  <AssessmentIcon style={styles.MarginRight10} /> Recommendation
                </h6>
                <div className="review-items">
                  {comments.map((comment, key) => (
                    <div>
                      <div className="review-item doctor-review-item" key={key}>
                        <ul
                          className="list-unstyled"
                          style={{ marginBottom: 0 }}
                        >
                          <li>
                            <strong className="review-title">
                              {comment.title || 'N/A'}
                            </strong>
                          </li>
                          <li>
                            <pre style={styles.pre}>
                              <strong>{comment.description || 'N/A'}</strong>
                            </pre>
                          </li>

                          {comment.link && (
                            <li>
                              <span>Link:</span>{' '}
                              <strong>
                                <a href={comment.link}>View link</a>
                              </strong>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* <div> */}
          {status === 1 && (
            <div>
              <Button
                style={styles.MarginRight10}
                onClick={(e) =>
                  openCommentBox(e, <Document>{pdfProfile}</Document>)
                }
                variant="outlined"
                component="span"
              >
                <AddOutlined style={styles.MarginRight10} />
                Add Recommendation
              </Button>

              <Button
                style={styles.MarginRight10}
                onClick={(e) => saveAll(e)}
                variant="outlined"
                component="span"
              >
                <UpdateIcon style={styles.MarginRight10} />
                Save
              </Button>
            </div>
          )}
        </Panel>
        {role === DOCTOR_ROLE && request.status === 1 && isOpenCommentBox && (
          <Dialog
            fullScreen={true}
            fullWidth={true}
            maxWidth="xl"
            title="Actions"
            actions={actions}
            open={true}
            onRequestClose={(e) => closeCommentBox(e)}
          >
            <AddCommentPanel
              isDisplayUpload={false}
              inputValue={commentValue}
              isDisplayRemoveButton={false}
              title={'Add Recommendation'}
              onChange={(e) => handleCommentChange(e)}
              keyValue={'comment'}
              onUploadChange={(e) => uploadCommentFile(e, 'u-comment')}
              onPreview={(e) => onPreviewComment(e)}
            />
          </Dialog>
        )}
        <DialogPdfPreview
          fileModeToOpen={fileModeToOpen}
          isOpenFile={isOpenFile}
          file={linkFileToOpen}
          handleCloseFilePreview={(e) => closeFilePreview(e)}
        />

        {currentOcrImageType === TYPES.XRAY && (
          <DicomViewer ref={dcmLoaderRef} url={currentOcr?.publicOcrLink} />
        )}
        {isToolOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              zIndex: 1700,
              width: window.innerWidth,
              height: window.innerHeight,
              backgroundColor: '#fff',
              overflow: 'hidden',
            }}
          >
            <Canvas
              ref={canvasRef}
              closeModal={() => closeAnnotationTool()}
              onSave={(data, callback) => updateAnnotation(request._id, data)}
              onReset={() => onResetCanvas(request._id)}
              data={currentOcr}
              type={currentOcrImageType}
              notifyExportingRequest={notifyExportingRequest}
              notifyExportedRequest={notifyExportedRequest}
              url={
                currentOcrImageType === TYPES.XRAY
                  ? dcmLoaderRef.current?.getImageData()
                  : currentOcr?.publicOcrLink
              }
              width={dcmLoaderRef.current?.getSize().width}
              height={dcmLoaderRef.current?.getSize().height}
              role={DOCTOR_ROLE}
            />
          </div>
        )}
      </div>
    </div>
  );
}
