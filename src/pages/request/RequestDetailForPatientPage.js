import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import { Redirect } from 'react-router-dom';

// Material UI
import Button from '@material-ui/core/Button';
import AssignmentIcon from '@material-ui/icons/BookmarkBorderOutlined';
import QuestionIcon from '@material-ui/icons/QuestionAnswerOutlined';
import GeneralIcon from '@material-ui/icons/AssignmentIndOutlined';
import AddedInfoIcon from '@material-ui/icons/AssignmentOutlined';
import CommentIcon from '@material-ui/icons/CommentOutlined';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';

import ico_bell from '../../img/imi/alarm-bell-black.png';

// Api Call
import { getRequestDetailApiCall } from '../../apiCalls/request.api';
import { getPublicUrlApiCall } from '../../apiCalls/file.api';

// Actions
import {
  deleteRequest
} from '../../store/actions/request.action';

//
import Panel from '../../components/panel';
import defaultAva from '../../img/d_ava.png';

import {
  convertToDiseaseName,
  convertDate,
  convertToStatusName,
  isURL
} from '../../utils';
import {
  PATIENT_ROLE,
  IMAGE_TYPES,
  PDF_TYPE,
  IMAGE_MODE,
  PDF_MODE
} from '../../constant';
import FullScreenDialog from '../../components/dialog/dialogFullScreen';

const styles = {
  anchor: {
    cursor: 'pointer',
    color: '#f54a70',
  },
  detailStatus: {
    background: 'rgb(35, 200, 170)',
    padding: '2px 6px',
    borderRadius: '3px',
    color: 'white',
  },
  MarginRight10: {
    marginRight: '10px',
  },
  QuestionContent: {
    fontWeight: 700,
    paddingTop: '15px',
    paddingBottom: '25px',
  },
  AnswersBlock: {
    marginLeft: '30px',
  },
  AnswerWrap: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  FontWeight: {
    fontWeight: 700,
  },
  ocrButton: {
    background: 'rgb(35, 200, 170)',
    borderRadius: '3px',
    color: 'white',
    paddingRight: '0px',
    cursor: 'pointer',
  },
  cancelButton: {
    float: 'right',
    marginRight: '10px',
  },
};

const initialState = {
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
  questionIndex: -1,
  answerIndex: -1,
  isOpenAnswerBox: false,
  openedQuestions: [],
  isOpenOCR: false,
  currentOcr: null,
  isToolOpen: false,
  currentOcrImageType: 'pdf',
  isRequestDeleted: false,
};

export default function RequestDetail(props) {
  const dispatch = useDispatch();

  const [currentState, setCurrentState] = useState(initialState);
  const user = useSelector((state) => state.user) || {};
  const {avatarUrl = defaultAva} = user;
  const { requestId } = props.match.params;
  const { request, linkFileToOpen, fileTypeToOpen, isRequestDeleted } =
    currentState || {};
  const {
    status,
    addedInfo = [],
    comments = [],
    questions = [],
    consultationLink = '',
    consultationType = '',
    user: patient = {},
    impression = '',
    flashRecordTest = [],
    bloodTest = [],
    radiology = [],
    biopsy = [],
    urineTest = [],
    createdAt,
    type = 1,
  } = request;
  const isDisplayAddedInfo = addedInfo.length > 0;

  const isDisplayComments = comments.length > 0 && status === 2;
  const isDisplayQuestions = questions.length > 0 && type > 0;
  const patientAvatarUrl = patient.avatarUrl || defaultAva;

  useEffect(() => {
    if (requestId && requestId !== '') {
      getRequestDetailApiCall(requestId)
        .then((result) => {
          const { status, data } = result;
          if (status === 200) {
            setCurrentState({ ...currentState, ...{ request: data } });
          }
        })
        .catch(() => {
          // FIXME:
        });
    } else {
      // FIXME:
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCloudPublicUrl = (itemUrl) => {
    const data = {
      itemUrl,
      role: PATIENT_ROLE,
      redirect: false,
      requestId,
    };
    getPublicUrlApiCall(data)
      .then((res) => {
        if (!res.data.code) {
          const { signedUrl, fileType } = res.data;
          handleOpenPdfPreview(signedUrl, fileType);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  /**
   * ==============
   * START OPEN/CLOSE PDF
   * ==============
   */
  const handleOpenPdfPreview = (link, type) => {
    if (isURL(link) && type) {
      setCurrentState({
        ...currentState,
        ...{ linkFileToOpen: link, fileTypeToOpen: type },
      });
    }
  };

  const handleCloseFilePreview = (e) => {
    setCurrentState({
      ...currentState,
      ...{ linkFileToOpen: null, fileTypeToOpen: null },
    });
  };
  /**
   * ==============
   * END OPEN/CLOSE PDF
   * ==============
   */

  const onCancelRequest = (e, requestId) => {
    dispatch(deleteRequest(requestId));
    setCurrentState({ ...currentState, isRequestDeleted: true });
  };

  // Handle Open File
  let fileModeToOpen;
  if (IMAGE_TYPES.includes(fileTypeToOpen)) fileModeToOpen = IMAGE_MODE;
  else if (fileTypeToOpen === PDF_TYPE) fileModeToOpen = PDF_MODE;

  const isOpenFile =
    isURL(linkFileToOpen) &&
    fileModeToOpen &&
    [PDF_MODE, IMAGE_MODE].includes(fileModeToOpen);

  // Sort consultations based on createdAt
  comments.sort(
    (commentA, commentB) =>
      convertDate(commentB.createdAt) - convertDate(commentA.createdAt)
  );

  return isRequestDeleted ? (
    <Redirect to="/" />
  ) : (
    <div className="appointment-page">
      <div className="topAppointment">
        <div className="leftTop">
        <h2 className="color-appoiment-h2"><NavLink to="/"><span>Home</span></NavLink>Request Detail</h2>
        </div>
        <div className="rightTop">
          <a href="#!">
            <img alt='' src={ico_bell} />
            <span className="count">3</span>
          </a>
          <a href="#!" className="avatar">
            <img alt='' src={avatarUrl} />
          </a>
        </div>
      </div>
      <div className="container">
        <Panel righticon={false}>
          <div className="col-md-12">
            <div className="review-item">
              <div className="row">
                <div className="col-md-6">
                  <h6>
                    <GeneralIcon style={styles.MarginRight10} />
                    General Information
                  </h6>
                </div>
                <div className="col-md-6">
                  <Button
                    style={styles.cancelButton}
                    variant="outlined"
                    component="span"
                    onClick={(e) => onCancelRequest(e, requestId)}
                  >
                    Cancel
                  </Button>
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
                <li>
                  <span>Request Date &amp; Time:</span>{' '}
                  <strong>{convertDate(createdAt, 'string')}</strong>
                </li>
                <li>
                  <span>Request Type:</span>{' '}
                  <strong>{convertToDiseaseName(type)}</strong>
                </li>
                {flashRecordTest.length > 0 && (
                  <li>
                    <span>Flash Record Test:</span>
                    {flashRecordTest.map((item) => (
                      <strong>
                        <Button
                          style={styles.cancelButton}
                          variant="outlined"
                          onClick={() => getCloudPublicUrl(item.fileUrl)}
                        >
                          {item.fileName}
                        </Button>
                        {status === 2 && item.ocrJson && (
                          <Button
                            style={styles.anchor}
                            variant="outlined"
                            onClick={() => getCloudPublicUrl(item.ocrFileUrl)}
                          >
                            Result
                          </Button>
                        )}
                      </strong>
                    ))}
                  </li>
                )}
                {bloodTest.length > 0 && (
                  <li>
                    <span>Blood Test:</span>
                    <div>
                      {bloodTest.map((item) => (
                        <strong>
                          <Button
                            style={styles.cancelButton}
                            variant="outlined"
                            onClick={() => getCloudPublicUrl(item.fileUrl)}
                          >
                            {item.fileName}
                          </Button>
                          {status === 2 && item.ocrJson && (
                            <Button
                              style={styles.anchor}
                              variant="outlined"
                              onClick={() => getCloudPublicUrl(item.ocrFileUrl)}
                            >
                              Result
                            </Button>
                          )}
                        </strong>
                      ))}
                    </div>
                  </li>
                )}

                {radiology.length > 0 && (
                  <li>
                    <span>Radiology:</span>
                    {radiology.map((item) => (
                      <strong>
                        <Button
                          style={styles.cancelButton}
                          variant="outlined"
                          onClick={() => getCloudPublicUrl(item.fileUrl)}
                        >
                          {item.fileName}
                        </Button>
                        {status === 2 && item.ocrJson && (
                          <Button
                            style={styles.anchor}
                            variant="outlined"
                            onClick={() => getCloudPublicUrl(item.ocrFileUrl)}
                          >
                            Result
                          </Button>
                        )}
                      </strong>
                    ))}
                  </li>
                )}

                {biopsy.length > 0 && (
                  <li>
                    <span>Biopsy:</span>
                    {biopsy.map((item) => (
                      <strong>
                        <Button
                          style={styles.cancelButton}
                          variant="outlined"
                          onClick={() => getCloudPublicUrl(item.fileUrl)}
                        >
                          {item.fileName}
                        </Button>
                        {status === 2 && item.ocrJson && (
                          <Button
                            style={styles.cancelButton}
                            variant="outlined"
                            onClick={() => getCloudPublicUrl(item.ocrFileUrl)}
                          >
                            Result
                          </Button>
                        )}
                      </strong>
                    ))}
                  </li>
                )}

                {urineTest.length > 0 && (
                  <li>
                    <span>Urine Test:</span>
                    {urineTest.map((item) => (
                      <strong>
                        <Button
                          style={styles.cancelButton}
                          variant="outlined"
                          onClick={() => getCloudPublicUrl(item.fileUrl)}
                        >
                          {item.fileName}
                        </Button>
                        {status === 2 && item.ocrJson && (
                          <Button
                            style={styles.anchor}
                            variant="outlined"
                            onClick={() => getCloudPublicUrl(item.ocrFileUrl)}
                          >
                            Result
                          </Button>
                        )}
                      </strong>
                    ))}
                  </li>
                )}
                {(request.status === 1 ||
                  (request.status === 2 &&
                    request.reviewers &&
                    request.reviewers[0] &&
                    request.reviewers[0].email)) && (
                  <li>
                    <span>Doctor:</span>{' '}
                    <strong>
                      <a href='#!'>{request.reviewers[0].email}</a>
                    </strong>
                  </li>
                )}
                {consultationLink && consultationLink.length > 0 && (
                  <li>
                    <span>Report:</span>
                    <Button
                      style={styles.cancelButton}
                      variant="outlined"
                      component="span"
                      onClick={() =>
                        getCloudPublicUrl(consultationLink, consultationType)
                      }
                    >
                      View Report
                    </Button>
                  </li>
                )}
              </ul>
            </div>

            {impression && status === 2 && (
              <div className="review-item">
                <h6>
                  <AssignmentIcon style={styles.MarginRight10} />
                  General Impression
                </h6>
                <span>{impression}</span>
              </div>
            )}
            {isDisplayAddedInfo &&
              addedInfo.map((info) => (
                <div className="review-item">
                  <h6>
                    {' '}
                    <AddedInfoIcon style={styles.MarginRight10} />
                    Additional Information
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
                          <Button
                            style={styles.cancelButton}
                            variant="outlined"
                            component="span"
                            onClick={() =>
                              getCloudPublicUrl(info.link, info.fileType)
                            }
                          >
                            {info.fileName || 'View Link'}
                          </Button>
                        </strong>
                      </li>
                    )}
                  </ul>
                </div>
              ))}
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
                    <div style={styles.AnswersBlock}>
                      {question.answers && question.answers && status !== 0 && status !== 1 && (
                        <div>
                          <h6>
                            <CommentIcon style={styles.MarginRight10} />
                            Answer
                          </h6>
                          <Divider />
                        </div>
                      )}
                      <div>
                        <div>
                          {((question.answers || [])[0] || {}).content && (
                            <li>
                              {((question.answers || [])[0] || {}).content ||
                                'N/A'}
                            </li>
                          )}
                        </div>
                      </div>
                    </div>
                  </ul>
                </div>
              ))}
            {isDisplayComments &&
              comments.map((comment) => (
                <div className="review-item">
                  <h6 className="request-detail-comment-title">
                    Recommendation
                  </h6>
                  <Divider />
                  <ul className="list-unstyled">
                    {comment.reviewer && (
                      <li>
                        <span>Doctor:</span>{' '}
                        <strong>{comment.reviewer.email || 'N/A'}</strong>
                      </li>
                    )}
                    <li>
                      <span>Title:</span>{' '}
                      <strong>{comment.title || 'N/A'}</strong>
                    </li>
                    <li>
                      <span>Description:</span>{' '}
                      <strong>{comment.description || 'N/A'}</strong>
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
              ))}
          </div>
        </Panel>

        <FullScreenDialog
          fileModeToOpen={fileModeToOpen}
          isOpenFile={isOpenFile}
          file={linkFileToOpen}
          handleCloseFilePreview={(e) => handleCloseFilePreview(e)}
        />
      </div>
    </div>
  );
}
