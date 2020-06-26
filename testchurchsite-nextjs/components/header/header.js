/** @jsx jsx */
import React from 'react';
import PropTypes from 'prop-types';
import {jsx} from 'theme-ui';
import Link from '../link';
import {ReactComponent as LogoSVG} from '../../public/logo-horizontal.svg';
import Navigation from './navigation';

const navSx = {
  width: '100vw',
  maxWidth: '1170px',
  padding: '0',
  minHeight: '2em',
  fontSize: '1rem',
  height: ['120px', '220px'],
  backgroundColor: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  margin: ['0 10px 4px 10px', 'auto']
};

const logoSx = {
  flex: '0 1 auto',
  maxWidth: '300px',
  maxHeight: ['60px', '100px'],
  svg: {
    maxWidth: '100%',
    display: 'inline-block',
    height: ['50px', '100px']
  }
};

const Header = ({navlinks}) => {
  return (
    <header sx={navSx}>
      <Link> {/* the lack of props makes this route to index */}
        <div sx={logoSx}>
          <LogoSVG />
        </div>
      </Link>
      <Navigation navlinks={navlinks} />
    </header>
  );
};


Header.propTypes = {
  navlinks: PropTypes.arrayOf(
    PropTypes.shape({
      childpages: PropTypes.array.isRequired,
      text: PropTypes.string.isRequired
    })
  )
};

export default Header;
