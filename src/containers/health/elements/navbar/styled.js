import styled from 'styled-components';

export const MenuContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url(${require('../../../img/modal-bg.png')}) no-repeat 0 0;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  overflow: scroll;
  z-index: 9999999;
`;

export const MenuContent = styled.div`
  .menu__header {
    padding: 25px;
    color: white;
    border-bottom: none;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: start;
    align-items: flex-start;
    -ms-flex-pack: justify;
    justify-content: space-between;
    padding: 1rem 1rem;
    .logo {
      width: 60px;
    }
    .close {
      padding: 1rem 1rem;
      margin: -1rem -1rem -1rem auto;
    }
  }

  .menu__btn-logout {
    align-self: center;
    color: #fff;
    font-size: 16px;
    display: inline-block;
    vertical-align: text-top;
    margin-left: 5px;
    font-weight: 400;
    margin-left: 30px;
  }

  .menu__footer {
    padding: 25px;
    color: white;
    justify-content: flex-start;
    border-top: none;
    p {
      font-size: 10px;
      letter-spacing: 0.06em;
      font-weight: 400;
    }
  }
`;

export const MobileMenu = styled.ul`
  margin-top: 100px;
  padding-left: 0;
  text-align: left;
`;

export const MobileMenuItem = styled.li`
  padding: 6px 0 !important;
  margin-bottom: 20px;
  color: #fff;
  a {
    font-size: 16px;
    font-weight: 600;
    margin-left: 30px;
  }
`;
