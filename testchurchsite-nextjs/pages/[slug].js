/** @jsx jsx */
import {jsx, Styled} from 'theme-ui';
import Layout from '../components/master-layout';
import {menuQuery, pageQuery, defaultQuery, footerQuery} from '../lib/queries';
import SanityBlock from '../components/block-text-serializer';
import {fetchQuery} from '../lib/sanity';
import PropTypes from 'prop-types';

const Page = (props) => {
  const {menuData, mainData, defaultData, footerData} = props;

  return (
    <Layout {...props}>
      <article
        sx={{
          maxWidth: '700px',
          margin: 'auto',
          padding: '15px'
        }}
      >
        <Styled.h2 sx={{textAlign: 'left'}}>{mainData.title}</Styled.h2>
        <SanityBlock blocks={mainData.body} />
      </article>
    </Layout>
  )
};


// Amend below prop-types to be PropTypes.shape({...})
Page.propTypes = {
  mainData: PropTypes.object.isRequired,
  menuData: PropTypes.object.isRequired,
  defaultData: PropTypes.object.isRequired,
  footerData: PropTypes.object.isRequired
};

Page.getInitialProps = async ({query}) => {
  const results = await fetchQuery(
    `{
        "mainData": ${pageQuery(query.slug)},
        "menuData": ${menuQuery},
        "defaultData": ${defaultQuery},
        "footerData": ${footerQuery}
    }`
  );
  return results;
};

export default Page;