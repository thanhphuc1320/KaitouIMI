import React from 'react';
import Dialog from 'material-ui/Dialog';
import './styles/dialog-pdf-preview.css';
import CircularProgress from '@material-ui/core/CircularProgress';

const customContentStyle = {
  maxWidth: '580px',
  marginTop: '-55px'
};

/**
 * Dialog content can be scrollable.
 */
export default function DialogApoitment({ isOpenFile }) {
  return (
    <div>
      <Dialog
        open={isOpenFile}
        className="custom-style"
        contentStyle={customContentStyle}
        bodyStyle={{ backgroundColor: '#589DF7' }}
        style={{background: '#589DF7',backgroundColor: '#589DF7'}}
      > 
        <div className="background-result">
          <h3 className="title-result" style={{marginBottom: '17px', marginLeft:'-2px'}}>Your iReader request is being processed</h3>
          <p style={{marginTop:'18px'}}>
            We are processing your blood test result. Please be patient.
          </p>
         
         <div className="center mt-5 mb-4">
         <CircularProgress className="loading-result" />
         <p style={{marginTop:'35px', marginLeft:'4px'}}>Loading</p> 
         </div>
        </div>
      </Dialog>
    </div>
  );
}
