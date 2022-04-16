import styled from 'styled-components';

export const FlexBox = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const FlexItem = styled.div`
  flex-basis: 48%;
  &.right {
    padding-bottom: 20px;
  }
  @media (max-width: 768px) {
    flex-basis: 100%;
    &.left {
      min-height: auto;
      margin-bottom: 20px;
      padding-right: 0;
    }
  }
`;

export const DropDown = styled.div`
  width: 100%;
  margin-bottom: 40px;
  position: relative;
`;

export const DropDownLabel = styled.div`
  background: #ffffff;
  cursor: poiter;
  display: block;
  color: #4266ff;
  font-size: 16px;
  padding: 6px 20px;
  border-radius: 25px;
  font-weight: bold;
  filter: drop-shadow(-5px 0 11.5px rgba(0, 0, 0, 0.16));
`;

export const DropDownList = styled.ul`
  background: #ffffff;
  border: 1px solid #c3c4c8;
  box-sizing: border-box;
  border-radius: 16px;
  position: absolute;
  right: 0;
  top: 25px;
  padding: 10px;
  min-width: 200px;
  z-index: 99;
`;

export const DropDownItem = styled.li`
  border-bottom: 1px solid #797979;
  cursor: pointer;
  &:last-child {
    border-bottom: none;
  }
  &a {
    display: block;
    color: #828282;
    font-size: 14px;
    padding: 10px;
  }
`;
