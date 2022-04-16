import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import FlashRecord from '../flashRecord';

import { getRequestDetailApiCall } from '../../../apiCalls/request.api';
import { CircularProgress, Tooltip } from '@material-ui/core';
import { Button } from '@stories/Button/Button';

import ico_alarm_bell from '@img/imi/alarm-bell-blue.png';
import ico_search from '@img/imi/ico-search.png';
import avatarUrl from '@img/d_ava.png';
import ico_check from '@img/imi/ico-check-step.png';
import { data } from 'jquery';

export default function Opinion() {
  const param = useParams();
  const requestId = param.id;
  const [activeTab, setActiveTab] = useState(false);
  const [heightBar, setHeightBar] = useState(0);
  const [step, setStep] = useState('step1');
  const [skip1, setSkip1] = useState(false);
  const [skip2, setSkip2] = useState(false);
  const [skip3, setSkip3] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dataRequest, setDataRequest] = useState();
  const onNext = () => {
    setActiveTab(true);
  };

  const handleStep = (value) => {
    let elem = document.getElementById('stepBar');
    if (value === 1) {
      elem.style.height = value + '%';
      setHeightBar(value);
    } else {
      let height = heightBar;
      var id = setInterval(frame, 10);
      function frame() {
        if (height >= value) {
          clearInterval(id);
        } else {
          height++;
          elem.style.height = height + '%';
        }
      }
      setHeightBar(value);
    }
  };

  useEffect(() => {
    if (requestId) {
      getRequestDetailApiCall(requestId)
        .then((res) => {
          setDataRequest(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (dataRequest) setActiveTab(true);
  }, [dataRequest]);

  const onPrevSteep = (value) => {
    if (value === 'submit') {
      setSubmit(true);
    }
    if (value === 'skip1') {
      setSkip1(true);
      setStep('step2');
    }
    if (value === 'skip2') {
      setSkip2(true);
      setStep('step3');
    }
    if (value === 'skip3') {
      setSkip3(true);
    }
    if (value === 1) {
      setStep('step1');
      setSkip1(false);
      handleStep(1);
      setActiveTab(false);
    }
    if (value === 2) {
      setStep('step2');
      setSkip2(false);
      handleStep(35);
      let elem = document.getElementById('stepBar');
      elem.style.height = 35 + '%';
    }
    if (value === 3) {
      setStep('step3');
      setSkip3(false);
      handleStep(65);
      let elem = document.getElementById('stepBar');
      elem.style.height = 65 + '%';
    }
  };
  return (
    <div className="appointment-new">
      <div className="topAppointment">
        <div className="leftTop">
          <h2 className="color-appoiment-h2">
            <NavLink to="/">
              <span>Home</span>
            </NavLink>
            iDoctor
          </h2>
        </div>
        <div className="rightTop">
          <div className="icon-search">
            <img src={ico_search} alt="" />
          </div>
          <a href="#!" className="mr-2 ml-2">
            <img src={ico_alarm_bell} alt="" />
            <span className="count">3</span>
          </a>
          <a href="#!" className="avatar">
            <img src={avatarUrl} alt="" />
          </a>
        </div>
      </div>
      {isLoading ? (
        <div
          className="d-flex justify-content-center"
          style={{ height: '10rem' }}
        >
          <div className="d-flex justify-content-center mt-5">
            <CircularProgress className="loading-edit-iReader" />
          </div>
        </div>
      ) : (
        <div className="grid-progress">
          <div className="content-opinion left">
            <div className="list-img">
              {heightBar !== 35 &&
              heightBar !== 65 &&
              heightBar !== 68 &&
              heightBar !== 100 ? (
                // <div className="step-img" style={{ marginTop: '-5.3rem' }}>
                //   {/* <p>1</p> */}
                // </div>
                <Button
                  className="step-img"
                  style={{ marginTop: '-5.3rem', border: 'unset' }}
                  label="1"
                />
              ) : skip1 && !submit ? (
                <div
                  className="step-img"
                  style={{
                    marginTop: '-5.3rem',
                    backgroundColor: '#dadada',
                    cursor: 'pointer',
                  }}
                  onClick={() => onPrevSteep(1)}
                >
                  <p style={{ color: '#FFFFFF' }}>1</p>
                </div>
              ) : (
                <img
                  onClick={() => onPrevSteep(1)}
                  style={{ marginTop: '-105px', cursor: 'pointer' }}
                  src={ico_check}
                  alt=""
                />
              )}
              {heightBar !== 65 && heightBar !== 68 && heightBar !== 100 ? (
                <Button
                  className="step-img"
                  style={{
                    marginBottom: '70px',
                    cursor: 'pointer',
                    border: 'unset',
                  }}
                  label="2"
                />
              ) : skip2 && !submit ? (
                <div
                  className="step-img"
                  style={{
                    marginTop: '-70px',
                    backgroundColor: '#dadada',
                    cursor: 'pointer',
                  }}
                  onClick={() => onPrevSteep(2)}
                >
                  <p style={{ color: '#FFFFFF' }}>2</p>
                </div>
              ) : (
                <img
                  onClick={() => onPrevSteep(2)}
                  style={{ marginTop: '-70px', cursor: 'pointer' }}
                  className="img-check-step"
                  src={ico_check}
                  alt=""
                />
              )}
              {heightBar !== 68 && heightBar !== 100 ? (
                <Button
                  className="step-img"
                  style={{
                    marginBottom: '35px',
                    cursor: 'pointer',
                    border: 'unset',
                  }}
                  label="3"
                />
              ) : skip3 && !submit ? (
                <div
                  className="step-img"
                  style={{ backgroundColor: '#dadada', cursor: 'pointer' }}
                  onClick={() => onPrevSteep(3)}
                >
                  <p style={{ color: '#FFFFFF' }}>3</p>
                </div>
              ) : (
                <img
                  onClick={() => onPrevSteep(3)}
                  className="img-check-step"
                  style={{ cursor: 'pointer' }}
                  src={ico_check}
                  alt=""
                />
              )}
              {heightBar !== 100 ? (
                <Button
                  className="step-img"
                  style={{
                    border: 'unset',
                  }}
                  label="4"
                />
              ) : (
                <img className="img-check-step" src={ico_check} alt="" />
              )}
            </div>
            <div className="progress">
              <div id="stepBar" style={{ height: '0%' }}></div>
            </div>
          </div>
          <div className="right">
            {!activeTab ? (
              <div className="start-idoctor">
                <div className="content-opinion">
                  <div>
                    <div className="d-flex justify-content-center">
                      <p className="title-upload title-iDoctor-upload">
                        Welcome to iDoctor! We will walk you through a few
                        simple steps so our doctors can better help you.
                      </p>
                    </div>
                    <div className="form-group">
                      <div className="gr-btn-smartReader">
                        <Button
                          style={{
                            margin: '0px',
                            width: '13.65rem',
                            // paddingTop: '16px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          className="btn btn-blue-submit"
                          onClick={() => onNext()}
                          label="Start"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ height: '100%' }}>
                <FlashRecord
                  activeTabProps={activeTab}
                  type="Opinion"
                  handleStep={(e) => handleStep(e)}
                  step={step}
                  onPrevSteep={(value) => onPrevSteep(value)}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
