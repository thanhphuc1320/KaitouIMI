const jssStyles = () => {
  return {
    default: {
      width: 953,
      height: 80,
      borderRadius: 16,
      backgroundColor: '#FFFFFF',
      '&.MuiInput-underline:before, .MuiInput-underline:hover:not(.Mui-disabled):before': {
        borderBottom: 'unset !important'
      },
      '&:hover': {
        border: '1px solid #2F80ED',
        boxSizing: 'border-box',
        color: '#2F80ED'
      },
      '&.Mui-disabled': {
        backgroundColor: '#DADADA'
      },
      '&.MuiInput-underline:after': {
        borderBottom: 'unset !important'
      },
      '& .MuiSelect-select.MuiSelect-select': {
        paddingLeft: 24
      }
    }
  }
}
export default jssStyles
