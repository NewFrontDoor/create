/** @jsx jsx */
import PropTypes from 'prop-types';
import Link from '../link';
import {jsx} from 'theme-ui';

// The styling for the nav parent items - feel free to amend as needed!
// The array syntax is theme-ui specific for handling
// responsive breakpoints. See https://theme-ui.com/sx-prop/#responsive-values

const listItem = {
  position: 'relative',
  lineHeight: ['1.6', '1.6', 'initial'],
  transitionDuration: '0.5s',
  '&:hover > ul, ul li ul:hover': {
    visibility: 'visible',
    opacity: '1',
    display: 'block'
  },
  color: ['text', 'text', 'background'],
  margin: [null, null, '0.3125em 0 -1rem 1.25em'],
  paddingBottom: [null, null, '1rem']
};

const submenuSx = {
  listStyle: 'none',
  margin: '0',
  paddingLeft: '0',
  visibility: 'hidden',
  opacity: '0',
  minWidth: '5rem',
  position: 'absolute',
  transition: 'all 0.5s ease',
  marginTop: '1rem',
  left: '0',
  display: 'none',
  color: 'text',
  padding: '0.75em 0.5em 0.75em 0.625em',
  borderRadius: '0.3125em',
  backgroundColor: 'background',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)'
};

const Navparent = ({link, text, childpages}) => {
  return (
    <li sx={listItem}>
      <Link link={link} variant="nav">
        {text}
      </Link>
      <ul sx={submenuSx}>
        {childpages.map(child => {
          return (
            <li key={child.slug.current} sx={{paddingBottom: '0.5em'}}>
              <Link
                link={`/${child.slug.current}`}
                variant="nav"
              >
                {child.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </li>
  );
};

Navparent.propTypes = {
  childpages: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.shape({current: PropTypes.string.isRequired}),
      title: PropTypes.string.isRequired
    })
  ),
  link: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
};

export default Navparent;
