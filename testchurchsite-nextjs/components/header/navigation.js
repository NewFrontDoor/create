/** @jsx jsx */
import PropTypes from 'prop-types';
import {useState} from 'react';
import {Navlink} from '../link';
import Navparent from './nav-parent-item';
import {jsx} from 'theme-ui';

// The styling for the nav - feel free to amend as needed!
// The array syntax is theme-ui specific for handling
// responsive breakpoints. See https://theme-ui.com/sx-prop/#responsive-values

const navSx = isOpen => ({
  flex: '2 1 auto',
  listStyle: 'none',
  margin: '0',
  alignItems: ['left', 'center'],
  display: [`${isOpen ? 'block' : 'none'}`, 'flex'],
  position: ['absolute', 'unset'],
  top: '90px',
  left: '0px',
  padding: ['20px 50px 0 50px', 0],
  color: ['text', 'inherit'],
  width: ['100vw', 'initial'],
  height: ['100vh', 'initial'],
  flexDirection: [null, 'row'],
  justifyContent: [null, 'flex-end'],
  fontSize: ['30px', '16px'],
  zIndex: [2, null]
});

const Navigation = ({navlinks}) => {
  const [isOpen, setOpen] = useState(false);

      // The reason for the fragment tags below is for implementing mobile menu.
      // Put in a button/hamburger/text (something suitable for mobile) as a sibling to
      // the <nav> tag, which will control the <nav> visibility via a call to setOpen

  return (
    <>
      {/*put mobile nav control here */}
      <nav sx={navSx(isOpen)} onClick={() => setOpen(false)}>
        {navlinks.map(link => {

          // If no href has been appended to the menu item in Sanity
          // It gets skipped
          if (!link.childpages) {
            return null;
          }

          // Returns either a normal navlink, or a hoverable navparent
          // for a menu item with children
          return link.childpages.length <= 1 ? (
            <Navlink
              key={link.text}
              link={link.childpages[0].slug?.current ?? link.childpages[0].url}
              text={link.text}
            />
          ) : (
            <Navparent
              key={link.text}
              link={link.childpages[0].slug?.current ?? link.childpages[0].url}
              text={link.text}
              childpages={link.childpages}
            />
          );
        })}
      </nav>
    </>
  );
};

Navigation.propTypes = {
  navlinks: PropTypes.arrayOf(
    PropTypes.shape({
      childpages: PropTypes.array.isRequired,
      text: PropTypes.string.isRequired
    })
  )
};

export default Navigation;
