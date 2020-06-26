/** @jsx jsx */
import {jsx, Styled, Link as ThemeUiLink} from 'theme-ui';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

function pageLookup(link) {
  // This depends on the fact that no sub-subdirectory of pages contains an index file
  if (link.includes('/')) {
    const root = link
      .split('/')
      .pop()
      .reduce((url, element) => {
        return url.concat('/', element);
      });
    return `/${root}/[slug]`;
  }

  switch (link) {
    case '':
    case 'sermons':
    case 'search':
    case 'all-sermons':
      return `/${link}`;
    default:
      return '/[slug]';
  }
};

const regex = /^(?!www\.|(?:http|ftp)s?:\/\/|[A-Za-z]:\\|\/\/|api|\/api).*/;

const Link = ({link, children, isBlank, hasNoAnchor, ...rest}) => {
  if (isBlank) {
    rest.target = '_blank';
    rest.rel = 'noreferrer noopener';
  }

  return regex.test(link) ? (
    hasNoAnchor ? (
      <NextLink passHref href={pageLookup(link)} as={`/${link}`}>
        {children}
      </NextLink>
    ) : (
      <NextLink passHref href={pageLookup(link)} as={`/${link}`}>
        <ThemeUiLink {...rest}>
          {children}
        </ThemeUiLink>
      </NextLink>
    )
  ) : (
    <ThemeUiLink href={link} {...rest}>
      {children}
    </ThemeUiLink>
  );
};

/** Navlink **/
// Basically just highlights on route and has a 'nav' variant prop

const Navlink = ({link, text}) => {
  const router = useRouter()
  const { slug } = router.query;

  return (
  <Styled.li>
    <Link link={link} variant="nav" color={slug == link ? 'active' : ''}>
      {text}
    </Link>
  </Styled.li>
)};


Link.propTypes = {
  children: PropTypes.any,
  variant: PropTypes.string,
  link: PropTypes.string,
  isBlank: PropTypes.bool,
  hasNoAnchor: PropTypes.bool
};

Link.defaultProps = {
  link: ''
};

Navlink.propTypes = {
  link: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
};

export default Link;
export {Navlink};
