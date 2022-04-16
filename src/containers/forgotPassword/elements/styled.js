import styled from 'styled-components';

export const LoginBox = styled.div`
  .user-box {
    margin-top: 15px;
    margin-bottom: 10px;
    position: relative;

    input {
      padding: 10px 0 10px 60px !important;
      display: inline-block;
      box-sizing: border-box;
      height: 56px;
      line-height: 14px;
    }

    input:valid {
        padding: 10px 0 10px 60px !important;
    }

    img {
      position: absolute;
      left: 15px;
      top: 17px;
      z-index: 1;
    }
  }

  .form-group {    
    width: 100% !important;
    border-radius: 10px !important;
    color: #c3c6c8 !important;
    font-size: 12px !important;
    border: none !important;
  }
  .form-control {
    background: #f2f2f2 !important;
    font-weight: 400;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }
`;
