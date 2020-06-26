/** @jsx jsx */
import React from 'react';
import {jsx} from 'theme-ui';
import PropTypes from 'prop-types';
import Header from './header/header';
import Footer from './footer';
import Head from 'next/head';

const Layout = ({menuData, mainData, defaultData, footerData, children}) => {
  const copyright = defaultData.copyright || `© ${new Date().toISOString().split('T')[0].split('-')[0]} ${defaultData.orgName}`
  return (
    <div>
      <Head>
        <title>{mainData.title || 'Welcome'} | {defaultData.orgName} </title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicons/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicons/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <link rel="shortcut icon" href="/favicons/favicon.ico" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta
          name="msapplication-config"
          content="/favicons/browserconfig.xml"
        />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <Header navlinks={menuData.menuitems} />
      {children}
      <Footer data={footerData} copyright={copyright} />
    </div>
  );
};

Layout.propTypes = {
  menuData: PropTypes.object.isRequired,
  mainData: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired
};

export default Layout;
