import React,{ useState, useEffect } from 'react';
import { useHistory  } from 'react-router-dom';

import nextImg from '../../../img/btn-next.png';
import editImg from '../../../img/edit.png';
import closeAccount from "../../../img/close-account.png"
import icoCongrats from '../../../img/ico-congrats.png'

const QuizContainer = () => {
  const API_URL = 'https://dev-api.imi.ai/v2/';
  const history = useHistory();
  const [isShowQuiz, setIsShowQuiz] = useState(false);
  const [isModalBloodTest, setIsModalBloodTest] = useState(false);
  const [isCongrats, setIsCongrats] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(false);
  // const [isGetQuiz, setIsGetQuiz] = useState(false);
  let isGetQuiz = false
  const formData = {
    name: '',
    email: '',
  };

  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [countIsCorrect, setCountIsCorrect] = useState(0);
  const [numOfCorrectAnswer, setNumOfCorrectAnswer] = useState(0);
  const [dataForm, setDataForm] = useState(formData);
  const [listQuiz, setListQuiz] = useState([]);
  const [quizData, setQuizData] = useState({});

  const handleOnChange = (event, fieldName) => {
    setDataForm({ ...dataForm, [fieldName]: event.target.value });
  };

  const showQuiz = () => {
    setIsShowQuiz(!isShowQuiz)
  }

  const takeQuiz = (event) => {

  }

  const nextStep = (evt) => {
    evt.preventDefault();
    isGetQuiz = true
    changeQuiz();
    setIsShowQuiz(!isShowQuiz)
    setIsModalBloodTest(!isModalBloodTest)
  }

  const getListQuiz = async () => {
    const data = await fetch(`${API_URL}quiz`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    }).then((res) => {
        return res.json()
      })
    .then((data) => {
      return data
    })
    .finally(() => {
    });
    setListQuiz(data)
  }

  const changeQuiz = async () => {
    if (isGetQuiz) {
      await getListQuiz()
    }
  }

  useEffect(() => {
    setQuizData(listQuiz[currentQuiz])
  }, [currentQuiz, listQuiz, selectedAnswer]);

  const chooseAnswer = (idx) => {
    if(quizData && quizData.correctQuestion === idx ){
      setCountIsCorrect(countIsCorrect +1)
    }
    if (selectedAnswer) return;
    setSelectedAnswer(true);
    let dataTemp = listQuiz
    dataTemp[currentQuiz].answer = idx
    setNumOfCorrectAnswer(numOfCorrectAnswer + 1)
    setListQuiz(dataTemp)
    document.getElementById("form-quiz-modal").scrollTop = document.getElementById("form-quiz-modal").scrollHeight;
  }

  const confirmCongrats = () => {
    setSelectedAnswer(false);
    setCurrentQuiz(currentQuiz + 1)
    document.getElementById('myBar').style.width = `${((currentQuiz + 1) / listQuiz.length) * 100}%`;
    if (listQuiz.length === currentQuiz + 1) {
      return setTimeout(() => {
        setIsCongrats(true)
        setIsModalBloodTest(false)
        submitQuiz()
      }, 1300);
    }
    return changeQuiz();
  }

  const submitQuiz = async() => {
    const request = {
      name: dataForm.name,
      email: dataForm.email,
      quizzes: listQuiz
    }
    await fetch(`${API_URL}guest-quiz`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(request),
    }).then((res) => {
        return res.json()
      })
    .then((data) => {
      return data
    })
  }

  const redirectToRegister = () => {
    history.push(`/sign-up?firstName=${dataForm.name}&email=${dataForm.email}`)
  }

  const congratsPercent = () => {
    return ((countIsCorrect / listQuiz.length) * 100).toFixed()
  }

  const congrats = () => {
    return (
      <div className="modal-quiz modal row" id="myModalCongrats">
        <div className="modal-dektop col-md-10 mx-auto col-12 p0">
            <p className="closeCongrats circle-close" onClick={() => setIsCongrats(false)}> <img src={closeAccount}/></p>
            <div className="modal-content modal-congrats">
                <img src={icoCongrats}/>
                <h3 id="congrats-user-name"></h3>
                <p><span id="congrats-percent">{congratsPercent()}%</span> of your health knowledge is spot-on! </p>
                <p>---</p>
                <p>Create your free IMI account now and let our doctors <br /> help you with any of your health
                  concerns.</p>
                <button type="button" className="btn-sign-up" onClick={() => redirectToRegister()}>Register An
                  Account</button>
            </div>
        </div>
    </div>
    )
  }

  const modalBloodTest = () => {
    return (
      <div className="modal-quiz modal blood-test row" id="myModalBloodTest">
        <div className="modal-dektop col-md-10 mx-auto p0">
            <p className="closeStep2 circle-close" onClick={() => setIsModalBloodTest(false)}> <img src={closeAccount}/></p>
            <div className="modal-content">
                <div className="container-fluid">
                    <div className="row" id="item-quiz">
                        <div className="col-12 col-md-5 col-lg-5 p0">
                            <div className="right-content-BloodTest" id="right-content-BloodTest">
                                <div id="quiz-image"></div>
                                <span id="quiz-image-title">{quizData?.titleImage || ''}</span>
                            </div>
                            <div className="arrow-right-desktop" id="arrow-right-desktop"></div>
                        </div>
                        <div className="col-12 mx-auto col-lg-7 col-md-7">
                            <div id="form-quiz-modal">
                                <div className="form-progress-bar">
                                    <span>Question</span>
                                    <div id="myProgress">
                                        <div id="myBar"></div>
                                    </div>
                                </div>
                                <div className="question-modal">
                                    <p id="quiz-content">{quizData?.titleQuestion || ''}</p>
                                    <ul id="quiz-answers">
                                      {
                                        quizData?.questions.map((q, idx) => {
                                          return <li key={idx} className={`answer-default selectionId ${selectedAnswer && quizData.answer === idx && quizData.answer === quizData.correctQuestion ? 'answerTrue': ''} ${selectedAnswer && quizData.answer === idx && quizData.answer !== quizData.correctQuestion? 'answerFalse': ''}`} quiz-data="${idx}" onClick={() => chooseAnswer(idx)}>
                                           <a href="#confirmCongrats">
                                           <div className="circle-stt"><span>{String.fromCharCode(65 + idx)}</span></div>
                                            <div className="right-answer clearfix">
                                              <span>{q}</span>
                                            </div>
                                           </a>
                                          </li>
                                        }) || ''
                                      }
                                    </ul>
                                </div>
                                {
                                  selectedAnswer && (<div className="choose-answer" id="quiz-content-bottom">
                                    <div className="note-answer" id="quiz-des">
                                      {
                                        quizData.answer === quizData.correctQuestion ? (
                                          <h4>{String.fromCharCode(65 + quizData.correctQuestion)} is the correct answer.</h4>
                                        ) : (
                                          <h4>Your answer {String.fromCharCode(65 + parseInt(quizData.answer))} is incorrrect. {String.fromCharCode(65 + quizData.correctQuestion)} is the correct answer.</h4>
                                        )
                                      }
                                      <p>{quizData.description}</p>
                                    </div>
                                    <div className="bottom-btn" onClick={() => confirmCongrats()}>
                                      <button className="btn-submit" id="confirmCongrats">Next</button>
                                    </div>
                                  </div>)
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
  }

  const modalQuiz = () => {
    return (
      <div className="modal-quiz modal row" id="myModalHealthQuiz">
        <div className="modal-dektop col-md-10 mx-auto p0">
          <p className="closeImiHealth circle-close" onClick={() => showQuiz()}> <img src={closeAccount}/></p>
          <div className="modal-content">
            <div className="row">
              <div className="col-12 col-md-7 col-lg-7 p0">
                <div className="login-box form-modal row">
                  <div className="col-12 mx-auto col-lg-8 col-md-8">
                    <form id="quiz-form" onSubmit={(evt) => nextStep(evt)}>
                      <div className="top-form">
                        <h3>Hi, Let me know who you are!</h3>
                      </div>
                      <div className="form-group">
                        <label>What’s your first name?</label>
                        <input id="quizName" type="text" name="name" placeholder="Type your first name" required onChange={(event) => handleOnChange(event, 'name')}/>
                      </div>
                      <div className="form-group">
                        <label>What’s your email address?</label>
                        <input id="quizEmail" type="email" name="email" placeholder="Type your email" required onChange={(event) => handleOnChange(event, 'email')}/>
                      </div>
                      <button className="btn-submit mT0" id="nextStep2">
                        Next
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-5 col-lg-5 p0">
                <div className="right-content">
                  <h4>Welcome to IMI.AI's <br /> Health Quiz</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
    )
  }

  return (
    <div>
      {
        isShowQuiz && modalQuiz()
      }
      {
        isModalBloodTest && modalBloodTest()
      }
      {
        isCongrats && congrats()
      }
      <div className="position-re main-dektop">
        <div className="container position-re">
          <div className="main-content">
            <div className="left">
              <p className="title-main-dektop">Second Opinion</p>
              <p className="title-main-dektop">Matters</p>
              <p className="caption-main-dektop">
                Second opinion is a critical part to educate yourself about your
                diagnosis &amp; treatment options, so that you can receive the
                most appropriate medical treatment.
              </p>
            </div>
            <div className="right">
              <div className="right-item">
                <span>37M people</span>
                <div className="text-right">
                  <p>
                    survived disease like cancer because they understood their
                    medical record and diagnosis.
                  </p>
                </div>
              </div>
              <div className="right-item">
                <span>440,000 people</span>
                <div className="text-right">
                  <p>
                    die every year due to medical errors. You need to take
                    charge of your health.
                  </p>
                </div>
              </div>
              <div className="right-item">
                <div className="item">
                  <span>88% patients</span>
                </div>
                <div className="text-right">
                  <p>
                    who sought second opinions received more accurate diagnoses
                    and improved their treatments.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="container position-ap">
            <div className="position-re">
              <div className="btn-quizz">
                <div className="left" />
                <div className="right">
                  <p  onClick={() => showQuiz()}>
                    <a className="myImiHealth">IMI Health Quiz</a>
                  </p>
                  <span>
                    IMI health quiz is designed by Stanford’s top physicians.
                    Take the quiz
                  </span>
                  <span>
                    now to understand your health better through blood test
                    information.
                  </span>
                  <span>Powered by IMI </span>
                </div>
              </div>
              <div className="myImiHealth btn-edit" id="showQuiz" onClick={() => showQuiz()}>
                <img src={editImg} alt="" className="img-edit" />
                <p className="myImiHealth">
                  Take <br />
                  Health Quiz
                </p>
                <img
                  src={nextImg}
                  className="myImiHealth cursor btn-next-take"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="list-why-imi container">
          <h3>Why IMI</h3>
          <div className="main-item-whyImi row">
            <div className="col-md-4 col-lg-4 col-12">
              <div className="item-why-imi item-why-heightOne">
                <div className="top-why-imi">
                  <h4>Top Experts</h4>
                </div>
                <div className="content-why-imi">
                  <p>
                    Created by top medical &amp; technological experts from
                    leading institutions such as Stanford and Google.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-lg-4 col-12">
              <div className="item-why-imi item-why-heightTwo">
                <div className="top-why-imi">
                  <h4>Global Network</h4>
                </div>
                <div className="content-why-imi">
                  <p>
                    Connect you to a reliable, world-class physician for second
                    opinion, wherever you are in the world.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-lg-4 col-12">
              <div className="item-why-imi item-why-heightThree">
                <div className="top-why-imi">
                  <h4>Ease of Use</h4>
                </div>
                <div className="content-why-imi">
                  <p>
                    Designed to simplify the communication, and remove the
                    language barrier between doctors and patients: intuitive
                    interface, top-class translation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/************************ MOBILE ***********************/}
      <div className="position-re">
        <div className="container">
          <div className="main-mobile">
            <p style={{ marginBottom: '20px' }} onClick={() => showQuiz()}>
              <a id="myImiHealthMobile">IMI Health Quiz</a>
            </p>
            <span>
              IMI health quiz is designed by Stanford’s <br /> top physicians.
              Take the quiz now to understand
            </span>
            <span>your health better through blood test information.</span>
            <span style={{ marginTop: '30px' }}>Powered by IMI </span>
            <div className="row">
              <div className="col-md-12 col-12 col-lg-12">
                <div className="box-take">
                  {/* <img src='./img/box-take.png'> */}
                  <div className="box-left" />
                  <div className="box-right" onClick={() => showQuiz()}>
                    <img src={editImg} alt="" className="img-edit" />
                    <p className="myImiHealth">Take Quiz</p>
                    <img
                      src={nextImg}
                      className="myImiHealth cursor btn-next-take"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="main-content c-mobile">
            <h3>
              Second Opinion
              <br />
              Matters
            </h3>
            <p>
              Second opinion is a critical part to educate yourself about your
              diagnosis &amp; treatment options, so that you can receive the
              most appropriate medical treatment.
            </p>
            <div className="c-content-item">
              <div className="c-title">
                <p>37M people</p>
              </div>
              <div className="c-middle">
                <p>
                  survived disease like cancer because they understood their
                  medical record and diagnosis.
                </p>
              </div>
            </div>
            <div className="c-content-item">
              <div className="c-title">
                <p>440,000 people</p>
              </div>
              <div className="c-middle">
                <p>
                  die every year due to medical errors. You need to take charge
                  of your health.
                </p>
              </div>
            </div>
            <div className="c-content-item">
              <div className="c-title">
                <p>88% patients</p>
              </div>
              <div className="c-middle">
                <p>
                  who sought second opinions received more accurate diagnoses
                  and improved their treatments.
                </p>
              </div>
            </div>
            <div className="list-why-imi container">
              <h3>Why IMI</h3>
              <div className="main-item-whyImi row">
                <div className="col-md-4 col-lg-4 col-12">
                  <div className="item-why-imi item-why-heightOne">
                    <div className="top-why-imi">
                      <h4>Top Experts</h4>
                    </div>
                    <div className="content-why-imi">
                      <p>
                        Created by top medical &amp; technological experts from
                        leading institutions such as Stanford and Google.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-lg-4 col-12">
                  <div className="item-why-imi item-why-heightTwo">
                    <div className="top-why-imi">
                      <h4>Global Network</h4>
                    </div>
                    <div className="content-why-imi">
                      <p>
                        Connect you to a reliable, world-class physician for
                        second opinion, wherever you are in the world.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-lg-4 col-12">
                  <div className="item-why-imi item-why-heightThree">
                    <div className="top-why-imi">
                      <h4>Ease of Use</h4>
                    </div>
                    <div className="content-why-imi">
                      <p>
                        Designed to simplify the communication, and remove the
                        language barrier between doctors and patients: intuitive
                        interface, top-class translation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default QuizContainer;
