/** @jsx jsx */
import {jsx} from 'theme-ui';
import Layout from '../components/master-layout';
import {menuQuery, mainQuery, defaultQuery, footerQuery} from '../lib/queries';
import {fetchQuery} from '../lib/sanity';
import PropTypes from 'prop-types';

const Home = props => {
  return (
    <Layout {...props}>
      <article
        sx={{
          maxWidth: '700px',
          margin: 'auto',
          padding: '15px'
        }}
      >
        Welcome to NFD starter theme
      </article>
    </Layout>
  )
};


// Amend below prop-types to be PropTypes.shape({...})
Home.propTypes = {
  mainData: PropTypes.object.isRequired,
  menuData: PropTypes.object.isRequired,
  defaultData: PropTypes.object.isRequired,
  footerData: PropTypes.object.isRequired
};

Home.getInitialProps = async () => {
  const results = await fetchQuery(
    `{
      'menuData': ${menuQuery},
      'mainData': ${mainQuery},
      "defaultData": ${defaultQuery},
      'footerData': ${footerQuery}
    }`
  );
  return results;
};

export default Home;