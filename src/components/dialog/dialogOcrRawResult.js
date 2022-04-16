import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import './styles/dialog-pdf-preview.css';
import { Slide } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

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
export default function DialogOcrRawResult({
  isOpenFile,
  handleCloseFilePreview,
  ocrTextAnnotations
}) {
  const data = ocrTextAnnotations ? JSON.parse(ocrTextAnnotations) : []
  const actions = [
    <FlatButton
      label="Close"
      primary={true}
      onClick={handleCloseFilePreview}
    />,
  ];
 
  return (
    <div>
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
            {data.length > 0 && data.map((item, index) => (
                <Card className="mt-3" key={index}>
                  <CardContent>
                    <div><strong>description:</strong> { item.description }</div>
                    <div className="d-flex">
                      <strong className="mr-2">vertices:</strong>
                      <div>
                      {item.boundingPoly.vertices.map((vertice) => (
                        <div>x: { vertice.x }, y: { vertice.y }</div>
                      ))}
                      </div>
                    </div>
                  </CardContent>
                </Card >
              ))}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
