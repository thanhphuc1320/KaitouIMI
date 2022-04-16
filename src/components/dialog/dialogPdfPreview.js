import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import PdfPreview from './pdfPreview';
import './styles/dialog-pdf-preview.css';
import { PDF_MODE, IMAGE_MODE } from '../../constant';
import { Slide } from '@material-ui/core';
import Slider from 'react-slick';

const styles = {
  radioButton: {
    marginTop: 16,
  },
  imgPreview: {
    width: '100%',
  },
};
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  centerMode: true,
};
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * Dialog content can be scrollable.
 */
export default function DialogPdfPreview({
  isOpenFile,
  handleCloseFilePreview,
  file,
  fileModeToOpen,
  isMultiFiles,
}) {
  const isPdfMode = fileModeToOpen === PDF_MODE;
  const isImgMode = fileModeToOpen === IMAGE_MODE;
  const actions = [
    <FlatButton
      label="Close"
      primary={true}
      onClick={handleCloseFilePreview}
    />,
  ];
  return (
    <div className="pdf-revew-css-container-dialog">
      <Dialog
        fullScreen
        style={{ zIndex: 1600 }}
        title="Preview File"
        actions={actions}
        open={isOpenFile}
        onRequestClose={handleCloseFilePreview}
        autoScrollBodyContent={true}
        TransitionComponent={Transition}
      >
        <DialogContent classes={{ root: 'preivewPdf-dialog-content' }}>
          <DialogContentText>
            {isPdfMode && !isMultiFiles && <PdfPreview file={file} />}
            {isImgMode && !isMultiFiles && (
              <img style={styles.imgPreview} src={file} alt="" />
            )}
            {isMultiFiles ? (
              <div className="pdf-review-edit-css">
                <Slider {...settings}>
                  {/* {allFile.map((item, index) => (
                    <div className="wrap-inside" key={index}>
                      <div>
                        <img src={item.fileUrl} />
                      </div>
                    </div>
                  ))} */}
                  <img style={styles.imgPreview} src={file} alt="" />
                  <img style={styles.imgPreview} src={file} alt="" />
                </Slider>
              </div>
            ) : null}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
