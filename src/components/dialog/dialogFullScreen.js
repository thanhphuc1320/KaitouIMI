import React, { useState } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import PdfPreview from './pdfPreview';
import './styles/dialog-pdf-preview.css';
import { PDF_MODE, IMAGE_MODE } from '../../constant';
import { Slide } from '@material-ui/core';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default function FullScreenDialog({
  isOpenFile,
  handleCloseFilePreview,
  file,
  fileModeToOpen,
}) {
  const [setOpen] = useState(false);

  const actions = [
    <FlatButton
      label="Close"
      primary={true}
      onClick={handleCloseFilePreview}
    />,
  ];

  const onClose = () => {
    setOpen(false);
  };

  const [pageNumber, setPageNumber] = useState(1);

  const isPdfMode = fileModeToOpen === PDF_MODE;
  const isImgMode = fileModeToOpen === IMAGE_MODE;

  const goToPrevPage = (e) => {
    setPageNumber(pageNumber - 1);
  };

  const goToNextPage = (e) => {
    setPageNumber(pageNumber + 1);
  };

  return (
    <Dialog
      style={{ zIndex: 1600 }}
      fullScreen
      open={isOpenFile}
      onClose={onClose}
      modal={false}
      actions={actions}
      autoScrollBodyContent={true}
      TransitionComponent={Transition}
    >
      {isPdfMode && (
        <div>
          <FlatButton
            className="preview-prev-nav"
            label="Prev"
            primary={true}
            onClick={(e) => goToPrevPage(e)}
          />
          <FlatButton
            className="preview-next-nav"
            label="Next"
            primary={true}
            onClick={(e) => goToNextPage(e)}
          />
        </div>
      )}
      <DialogContent classes={{ root: 'preivewPdf-dialog-content' }}>
        <DialogContentText>
          {isPdfMode && <PdfPreview pageNumber={pageNumber} file={file} />}
          {isImgMode && <img src={file} alt='' />}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
