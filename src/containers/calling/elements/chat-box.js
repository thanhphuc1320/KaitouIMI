import React from 'react';
import styled from 'styled-components';
import ico_attach from '../../../img/imi/ico-attach.png';
import ico_fullscreen from '../../../img/imi/ico-fullscreen.png';
import {
  IcoSeen
} from './styled';

const ChatBox = () => {
  return (
    <div className="chat-box">
      <div className="header">
        <div className="header-left">
          <h5> Notes for patient </h5>
        </div>
        <div className="header-right">
          <a>
            <img src={ico_fullscreen} />
          </a>
        </div>
      </div>
      <ChatContainer>
        <div className="chat-bubble-container">
          <div className="chat-bubble">
            <h6> Remember to exercise everyday. </h6>
          </div>

          <div className="chat-bubble">
            <h6> Remember to exercise everyday. </h6>
          </div>
          <h6 className="seen"> Seen. </h6>
        </div>

        <form className="reply">
          <div>
            <input className="reply-input" placeholder="Type your message..." />
            <a href="#" className="attach">
              <img src={ico_attach} />
            </a>
          </div>
        </form>

        <div className="icon-seen">
          <IcoSeen/>
        </div>
      </ChatContainer>
    </div>
  );
};

const ChatContainer = styled.div`
  background-color: rgba(195, 198, 200, 1);
  width: 100%;
  height: 500px;
  display: flex;
  position: relative;
  flex-direction: column;
  padding: 20px;
`;

export default ChatBox;
