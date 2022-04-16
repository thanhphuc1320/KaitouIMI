import React from 'react';
import TextField from 'material-ui/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import PdfIcon from '@material-ui/icons/PictureAsPdfOutlined';
import CloudUploadIcon from '@material-ui/icons/CloudUploadOutlined';
import CheckCircleIcon from '@material-ui/icons/CheckCircleOutlined';
import Panel from '../panel';

const AdditionalInformationPanel = props => {
  const styles = {
    removeButton: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      color: '#9e9e9e',
      cursor: 'pointer',
    },
    FileInput: {
      display: 'none',
    },
    MarginRight10: {
      marginRight: '10px',
    },
    PreviewButton: {
      marginLeft: '10px',
    },
    CheckIcon: {
      position: 'relative',
      top: '5px',
      color: 'rgb(35, 200, 170)',
    },
  };

  const inputValue = props.inputValue || {};
  const isLinkUploaded = inputValue.link && inputValue.link.length > 0;
  const uploadButtonTitle = isLinkUploaded ? 'RE-Upload' : 'Upload';
  const isDisplayRemoveButton = props.isDisplayRemoveButton;
  const isDisplayUpload = props.isDisplayUpload === true ? true : false;
  const uploadedInfo = isLinkUploaded ? (
    <p>
      <CheckCircleIcon style={styles.CheckIcon} /> Uploaded
    </p>
  ) : (
    'Upload document'
  );
  return (
    <Panel
      style={{ boxShadow: 'none !important' }}
      className="added-info"
      key={props.keyValue}
      title={props.title || 'Additional Information'}
    >
      <div>
        {isDisplayRemoveButton && (
          <div className="added-info-remove" style={styles.removeButton}>
            <DeleteIcon onClick={props.removePanel} />
          </div>
        )}
        <TextField
          error
          onChange={e => props.onChange(e)}
          name={`t-${props.keyValue}`}
          value={inputValue.title || ''}
          hintText="Type the title"
          floatingLabelText="Title"
        />

        <br />
        <TextField
          error
          onChange={e => props.onChange(e)}
          name={`d-${props.keyValue}`}
          value={inputValue.description || ''}
          hintText="Type the description"
          floatingLabelText="Description"
          multiLine={true}
          rows={1}
          fullWidth={true}
        />
        <br />
        <br />

        <input
          accept="image/jpeg,image/gif,image/png,application/pdf"
          id={`outlined-button-file-added-info-${props.keyValue}`}
          multiple
          type="file"
          onChange={props.onUploadChange}
          name={`u-${props.keyValue}`}
          style={styles.FileInput}
        />

        <br />
        {isDisplayUpload && (
          <div>
            <p>{uploadedInfo} </p>
            <label
              htmlFor={`outlined-button-file-added-info-${props.keyValue}`}
            >
              <Button variant="outlined" component="span">
                <CloudUploadIcon style={styles.MarginRight10} />{' '}
                {uploadButtonTitle}
              </Button>
            </label>
          </div>
        )}

        {isLinkUploaded && (
          <Button
            variant="outlined"
            component="span"
            style={styles.PreviewButton}
            onClick={props.onPreview}
          >
            <PdfIcon style={styles.MarginRight10} /> Preview
          </Button>
        )}
      </div>
    </Panel>
  );
};

export default AdditionalInformationPanel;
