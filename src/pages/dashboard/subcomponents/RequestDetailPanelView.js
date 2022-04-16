import React from 'react';
import styles from '../styles';

import { convertToStatusName } from '../../../utils';

const RequestDetailPanelView = ({
  request: {
    _id,
    status,
    createdAt,
    type,
    addedInfo = [],
    questions = [],
    comments = [],
  },
}) => (
  <div>
    <div className="box-info-customer">
      <ul className="list-unstyled">
        <li>
          <span>Status:</span>{' '}
          <strong style={styles.detailStatus}>
            {convertToStatusName(status)}
          </strong>
        </li>
        <li>
          <span>Request Date &amp; Time:</span> <strong>{createdAt}</strong>
        </li>
        <li>
          <span>Request Type:</span> <strong>{type}</strong>
        </li>
        <li>
          <span>Additional Information</span>
          <strong>
            {addedInfo.map((info) => (
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
                      <a href={info.link}>View link</a>
                    </strong>
                  </li>
                )}
              </ul>
            ))}
          </strong>
        </li>

        <li>
          <span>Comments</span>
        </li>
        {comments.map((comment) => (
          <ul>
            <li>
              <span className="review-title">{comment.title || 'N/A'}</span>
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
        ))}
      </ul>
    </div>
    <div className="box-info-customer ">
      <ul className="list-unstyled">
        <li className="tit">
          <span>Questions</span>
        </li>
      </ul>
      <div className="box-custtomer-question">
        {questions.map((question) => (
          <ul>
            <li>
              <b>Q: {question.content || 'N/A'}</b>
            </li>
            {status > 0 && (
              <li>
                A: {question.answers[0] ? question.answers[0].content : 'N/A'}
              </li>
            )}
          </ul>
        ))}
      </div>
    </div>
  </div>
);

export default RequestDetailPanelView;
