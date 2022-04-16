import React, { useState, useEffect } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import './styles/dialog-pdf-preview.css';
import { Slide } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import CardContent from '@material-ui/core/CardContent';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DialogPdfPreview({
  isOpenFile,
  handleCloseFilePreview,
  ocrCorrection,
  handleUpdateFilePreview,
  handleDownloadFilePreview,
  handleAddNewIndicator
}) {
  const [dataChange, setDataChange] = useState(ocrCorrection);
  const actions = [
    <FlatButton
      label="Add"
      primary={true}
      onClick={() => handleAddNewIndicator()}
    />,
    <FlatButton
      label="Update"
      primary={true}
      onClick={() => handleUpdateFilePreview(dataChange)}
    />,
    <FlatButton
      label="Download"
      secondary={true}
      onClick={handleDownloadFilePreview}
    />,
    <FlatButton
      label="Close"
      primary={true}
      onClick={handleCloseFilePreview}
    />,
  ];
  const changeData = (event, field, index, value) => {
    const newArrs = [...dataChange];
    if (field === "indicator"){
      const checkValid = newArrs.map((item) => {
        if ( event?.target.value === item.indicator){
          return false;
        }
        return true;
      })
      if (checkValid.includes(false)){
        window.alert("Indicator is exist")
      } else {
        newArrs[index][field] = event?.target?.value || value;
        newArrs[index]["key"] = event?.target?.value || value;
      }
    } else {
      newArrs[index][field] = event?.target?.value || value;
    }
    setDataChange(newArrs);
  };
  // let dataTemp;
  useEffect(() => {
    setDataChange(ocrCorrection)
  }, [ocrCorrection]);
  return (
    <div>
      <Dialog
        fullScreen
        style={{ zIndex: 1300 }}
        title="Update Labels"
        actions={actions}
        open={isOpenFile}
        onRequestClose={handleCloseFilePreview}
        autoScrollBodyContent={true}
        TransitionComponent={Transition}
      >
        <DialogContent classes={{ root: 'preivewPdf-dialog-content' }}>
          <DialogContentText id="dialog-test">
            {ocrCorrection.length > 0 &&
              ocrCorrection.map((item, index) => (
                <Card key={index} className="mt-3">
                  <CardContent>
                    <div className="list-indicator">
                      <strong className="list-indicator-strong-1">Indicator:</strong>
                      <TextField
                        name="indicator"
                        value={item.indicator && item.indicator}
                        disabled={item?.isAdd ? false : true}
                        onChange={(event, field) =>
                          changeData(event, 'indicator', index)
                        }
                      />
                      <strong style={{ marginLeft: '5rem' }} className="list-indicator-strong-2">Value:</strong>
                      <TextField
                        name="value"
                        value={item.value}
                        onChange={(event, field) =>
                          changeData(event, 'value', index)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
