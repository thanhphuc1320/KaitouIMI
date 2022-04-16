import React from 'react';
import Dialog from 'material-ui/Dialog';
import './styles/dialog-pdf-preview.css';
import ico_skip from '../../img/imi/ico-pre-skip.png'
const customContentStyle = {
  maxWidth: '700px',
  // marginTop: '-114px'
};

/**
 * Dialog content can be scrollable.
 */
export default function DialogSkip({ isOpenFile, onBackStep}) {
    const onBack = () =>{
        onBackStep()
    }
  return (
    <div className="appointment-new">
      <Dialog
        open={isOpenFile}
        className="custom-style"
        contentStyle={customContentStyle}
        bodyStyle={{ backgroundColor: '#589DF7' }}
        style={{background: '#589DF7',backgroundColor: '#589DF7'}}
      >
        <div className="background-result">
          <h3 className="title-result" style={{marginBottom: '17px', marginLeft:'-2px'}}>You need to submit at least one of the following information: blood test, video recording, or other documents</h3>
          <p style={{marginTop:'18px'}}>
          Please try to provide as much information as possible.
          </p>
         
          <div className="text-center" style={{marginTop:'108px'}}>
              <button
              className="btn-back-skip"
              onClick={() => onBack()}
            >
             <img src={ico_skip} alt='' /> Back
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
