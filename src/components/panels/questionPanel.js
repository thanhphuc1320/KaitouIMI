import React from 'react';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from 'material-ui/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import Panel from '../panel';

const QuestionPanel = (props) => {
  const {
    defaultQuestions = [],
    isDisplayRemoveButton,
    removePanel,
    title,
    questionChange,
    value,
    onChange,
    keyValue,
    content,
    selected,
  } = props;

  const styles = {
    removeButton: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      color: '#9e9e9e',
      cursor: 'pointer',
    },
  };

  return (
    <Panel>
      {isDisplayRemoveButton && (
        <div className="added-info-remove" style={styles.removeButton}>
          <DeleteIcon onClick={removePanel} />
        </div>
      )}
      <h4>{title || 'Question'}</h4>
      <RadioGroup
        aria-label="Gender"
        name="gender1"
        onChange={questionChange}
      >
        {defaultQuestions.map((question, key) => {
          return (
            <FormControlLabel
              checked={value === key && selected[keyValue] !== -2}
              value={key}
              control={<Radio />}
              label={question}
            />
          );
        })}

        <FormControlLabel
          checked={value === -1}
          value={-1}
          control={<Radio />}
          label="Other"
        />
        {value === -1 && (
          <TextField
            // error
            onChange={onChange}
            name={`q-${keyValue}`}
            value={content || ''}
            hintText="Type the question"
            floatingLabelText="Question"
          />
        )}
      </RadioGroup>
    </Panel>
  );
};

export default QuestionPanel;
