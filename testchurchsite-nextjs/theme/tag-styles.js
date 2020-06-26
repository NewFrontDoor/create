export default {
  root: {
    // Uses the theme values provided above
    fontFamily: 'body',
    fontWeight: 'body',
    margin: '0',
    padding: '0'
  },
  h1: {
    fontSize: 32,
    fontFamily: 'heading',
    fontWeight: 'bold',
    color: 'primary',
    mt: 4,
    mb: 2
  },
  h2: {
    fontSize: 48,
    fontFamily: 'heading',
    fontWeight: 'body',
    color: 'primary',
    textTransform: 'uppercase',
    letterSpacing: '8px'
  },
  h3: {
    textTransform: 'uppercase',
    color: 'primary',
    fontSize: 24,
    fontFamily: 'heading',
    fontWeight: 'heading',
    fontStyle: 'normal',
    mt: 4,
    mb: 2
  },
  h4: {
    textTransform: 'uppercase',
    color: 'background',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'body',
    fontWeight: 'bold',
    fontStyle: 'normal',
    mt: 4,
    mb: 2
  },
  p: {
    fontFamily: 'body',
    fontWeight: 'body',
    lineHeight: 'body'
  },
  a: {
    color: 'accent',
    fontFamily: 'body',
    fontStyle: 'normal',
    textDecoration: 'none',
    cursor: 'pointer',
    '&:visited': {
      color: 'text'
    },
    '&:hover': {
      color: 'text'
    },
    '&:active': {
      color: 'text'
    }
  },
  ul: {
    fontFamily: 'body',
    fontWeight: 'body',
    lineHeight: 'body'
  },
  table: {
    border: 'none',
    borderLeft: '1px solid #eee',
    borderRight: '1px solid #eee',
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    thead: {
      tr: {
        backgroundColor: '#eee'
      }
    }
  },
  tr: {
    ':nth-of-type(even)': {
      backgroundColor: '#eee'
    }
  },
  th: {
    padding: '15px 5px'
  },
  td: {
    padding: '15px 5px'
  },
  fieldset: {
    border: 'none'
  }
};
