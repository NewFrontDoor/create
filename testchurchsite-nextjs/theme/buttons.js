export default {
  home: {
    fontFamily: 'body',
    borderRadius: '3px',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'background',
    fontSize: 16,
    padding: '20px 40px',
    minWidth: '250px',
    cursor: 'pointer',
    color: 'background',
    backgroundColor: 'none',
    '&:hover': {
      bg: 'background',
      color: 'text'
    }
  },
  map: {
    fontFamily: 'body',
    textTransform: 'uppercase',
    fontSize: '0.8em',
    padding: '10px 0',
    border: '1px solid',
    borderColor: 'text',
    borderRadius: '18px',
    color: 'text',
    backgroundColor: 'none',
    ':hover': {
      backgroundColor: 'text',
      color: 'background',
      cursor: 'pointer'
    }
  }
};
