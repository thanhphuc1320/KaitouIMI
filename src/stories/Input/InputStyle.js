const jssStyles = () => {
  return {
    root: {
      width: 305,
      '& .MuiInputBase-root': {
        borderRadius: 32,
        height: 123,
        backgroundColor: '#FFFFFF',
      },
      '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
        border: 'unset',
      },
    },

    sizeType: {
      '& .MuiOutlinedInput-notchedOutline': {
        border: 'unset',
      },
    },

    firstName: {
      width: 158,

      borderRadius: 16,
      '& .MuiInputBase-root': {
        borderRadius: 16,
        height: 40,
        border: '1px solid #2F80ED',
        '&.Mui-disabled': {
          backgroundColor: '#DADADA',
          boxSizing: 'border-box',
          border: 'unset !important',
          color: '#898989',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'unset',
        },
      },
      '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
        border: '#2F80ED !important',
      },
    },
    required: {
      width: 180,
      '& .MuiInputBase-root': {
        height: 40,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        border: '1px solid #FF003D',
        boxSizing: 'border-box',
        color: '#EA0E0E',
      },
    },
    requiredType: {
      width: 305,
      '& .MuiInputBase-root': {
        borderRadius: 32,
        height: 123,
        boxSizing: 'border-box',
        color: '#FF003D',
        border: '1px solid #EA0E0E',
      },
    },
  };
};
export default jssStyles;
