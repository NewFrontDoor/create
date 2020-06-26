export default {
  menu: {
    color: 'body',
    fontFamily: 'heading',
    px: 0,
    py: 0,
    textTransform: 'lowercase',
    textDecoration: 'none',
    fontSize: 30,
    cursor: 'pointer'
  },
  homeH1: {
    fontSize: ['32px', '42px'],
    fontWeight: '900',
    color: 'white',
    lineHeight: 1.15,
    "::after": {
      content: '""',
      display: 'block',
      width: '130px',
      margin: '20px auto 0 auto',
      borderBottom: '2px dotted white'
    }
  },
  homeH2: {
    fontSize: ['32px', '30px'],
    fontWeight: '900',
    color: 'accent',
    lineHeight: 1.15,
    marginBottom: ['12px', '50px'],
    "::after": {
      content: '""',
      display: 'block',
      width: '130px',
      margin: '20px auto 0 auto',
      borderBottom: '2px dotted',
      borderColor: 'accent'
    }
  },
  homeBlurb: {
    fontSize: ['22px', '30px'],
    marginBottom: '35px',
    lineHeight: 1.3,
    textAlign: 'center'
  },
  pageBlurb: {
    fontSize: ['22px', '30px'],
    marginBottom: '35px',
    lineHeight: 1.3,
    textAlign: 'center',
    margin: ['0 1em 35px 1em', '0']
  },
  default: {
    fontFamily: 'body',
    fontWeight: 'body',
    lineHeight: 'body',
    color: 'text'
  },
  warning: {
    fontFamily: 'body',
    fontWeight: 'body',
    lineHeight: 'body',
    color: 'red'
  }
};
