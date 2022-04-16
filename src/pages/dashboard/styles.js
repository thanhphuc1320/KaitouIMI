const styles = {
  tableStatus: {
    background: 'rgb(35, 200, 170)',
    padding: '2px 6px',
    borderRadius: '3px',
    color: 'white',
  },
  RadioGroup: {
    display: 'flex',
    flexFlow: 'row',
  },
  CheckIcon: {
    color: 'rgb(35, 200, 170)',
    margin: '10px',
  },
  CancelIcon: {
    color: 'rgb(244, 67, 54)',
    margin: '10px',
  },
  buttonGradient: {
    filter: 'drop-shadow(0px 5px 11.5px rgba(0,0,0,0.17))',
    backgroundImage: 'linear-gradient(64deg, #00cec9 0%, #01628d 100%)',
  },
  wrapper: {
    height: '100vh',
    overflow: 'auto',
  },
  stickyElement: {
    position: 'sticky',
    alignSelf: 'flex-start',
    top: 0,
  },
  navPrevButton: {
    background: '#fff',
    borderRadius: '50%',
    border: '1px solid rgba(0,0,0,0.23)',
    height: '32px',
    position: 'absolute',
    top: '50%',
    left: '0',
  },
  navNextButton: {
    background: '#fff',
    borderRadius: '50%',
    border: '1px solid rgba(0,0,0,0.23)',
    height: '32px',
    position: 'absolute',
    top: '50%',
    right: '0',
  },
  bottomBoundary: {
    position: 'relative',
    bottom: 0,
  },
  annotationInfo: {
    width: '100%',
  },
};

export default styles;
