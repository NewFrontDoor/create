/** @jsx jsx */
import React from 'react';
import BlockContent from '@sanity/block-content-to-react';
import {Styled, Text, jsx, Link as TULink} from 'theme-ui';
import Link from './link';
import urlFor from '../lib/sanity';
import PropTypes from 'prop-types';

const CustomStyleSerializer = ({children}) => {
  return <Styled.p>{children}</Styled.p>;
};

CustomStyleSerializer.propTypes = {
  children: PropTypes.string.isRequired
};

const AnchorSerializer = ({children, mark}) => {
  return <span id={mark.id}>{children}</span>;
};

AnchorSerializer.propTypes = {
  children: PropTypes.array.isRequired,
  mark: PropTypes.object.isRequired
};

const ImageSerializer = ({node}) => {
  const align =
    node.wrapping === 'float'
      ? {float: node.alignment, padding: '20px'}
      : {display: 'block', margin: node.alignment === 'center' ? 'auto' : 0};

  return (
    <img
      sx={{...align, width: `${node.width || '100%'}%`}}
      src={urlFor(node).url()}
    />
  );
};

ImageSerializer.propTypes = {
  node: PropTypes.node.isRequired
};

const InternalLinkSerializer = ({mark, children}) => (
  <Link link={mark.slug}>
    <Styled.a>{children}</Styled.a>
  </Link>
);

const ExternalLinkSerializer = ({mark, children}) => (
  <Link link={mark.href}>{children}</Link>
);

const InlineButtonSerializer = ({children, mark}) => {
  const {action, link, style} = mark;
  if (style === 'ghost') {
    return (
      <Link variant="ghost" sx={{marginLeft: '10px'}} link={link}>
        {children}
      </Link>
    );
  }

  if (style === 'warning') {
    return (
      <Link variant="warning" sx={{marginLeft: '10px'}} link={link}>
        {action}
      </Link>
    );
  }

  return (
    <Link link={link} sx={{marginLeft: '10px'}} link={link}>
      {action}
    </Link>
  );
};

const ButtonSerializer = ({node}) => {
  const {action, link, style} = node;
  if (style === 'ghost') {
    return <Link variant="ghost">{action}</Link>;
  }

  if (style === 'warning') {
    return <Link variant="warning">{action}</Link>;
  }

  return <Link link={link}>{action}</Link>;
};

InternalLinkSerializer.propTypes = {
  children: PropTypes.array.isRequired,
  mark: PropTypes.shape({
    slug: PropTypes.string
  }).isRequired
};

ExternalLinkSerializer.propTypes = {
  children: PropTypes.array.isRequired,
  mark: PropTypes.shape({
    href: PropTypes.string
  }).isRequired
};

const BlockRenderer = props => {
  const style = props.node.style || 'normal';

  const elements = {
    h1: <Styled.h1>{props.children}</Styled.h1>,
    h2: <Styled.h2>{props.children}</Styled.h2>,
    h3: <Styled.h3>{props.children}</Styled.h3>,
    h4: <Styled.h4>{props.children}</Styled.h4>,
    h5: <Styled.h5>{props.children}</Styled.h5>,
    h6: <Styled.h6>{props.children}</Styled.h6>
  };

  if (/^h\d/.test(style)) return elements[style];

  if (style === 'normal') return <Styled.p>{props.children}</Styled.p>;

  if (style === 'blockquote')
    return <Text variant="pageBlurb">{props.children}</Text>;

  if (style === 'warning')
    return <Text variant="warning">{props.children}</Text>;

  // Fall back to default handling
  return BlockContent.defaultSerializers.types.block(props);
};

BlockRenderer.propTypes = {
  children: PropTypes.any,
  node: PropTypes.object.isRequired
};

const BlockText = ({blocks}) => {
  return (
    <BlockContent
      blocks={blocks}
      serializers={{
        types: {
          block: BlockRenderer,
          p: CustomStyleSerializer,
          image: ImageSerializer,
          button: ButtonSerializer,
          inlineButton: ButtonSerializer,
        },
        marks: {
          anchor: AnchorSerializer,
          internalLink: InternalLinkSerializer,
          link: ExternalLinkSerializer,
          inlineButton: InlineButtonSerializer
        }
      }}
    />
  );
};

BlockText.propTypes = {
  blocks: PropTypes.array.isRequired
};

export default BlockText;
