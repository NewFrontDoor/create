import {createContext} from 'react';
import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const client = sanityClient({
  // Find your project ID and dataset in `sanity.json` in your studio project
  projectId: process.env.NEXT_PUBLIC_SANITY_ID,
  dataset: 'production',
  //useCdn: true
  // UseCdn == true gives fast, cheap responses using a globally distributed cache.
  // Set this to false if your application require the freshest possible
  // data always (potentially slightly slower and a bit more expensive).
});

export default client;

/*************/
/** Context **/
/*************/

export const SanityContext = createContext(client);

/**************************/
/** Sanity image builder **/
/**************************/

const builder = imageUrlBuilder(client);

export function urlFor(source) {
  return builder.image(source);
}

/******************************************/
/** Fetch function which includes client **/
/******************************************/

export function fetchQuery(query, params) {
  return client.fetch(query, params);
}

/************************************************************/
/** Function to flatten portable text blocks to plain text **/
/************************************************************/

const defaults = {nonTextBehavior: 'remove'};

export function blocksToText(blocks, opts = {}) {
  const options = Object.assign({}, defaults, opts);
  return blocks
    .map(block => {
      if (block._type !== 'block' || !block.children) {
        return options.nonTextBehavior === 'remove'
          ? ''
          : `[${block._type} block]`;
      }

      return block.children.map(child => child.text).join('');
    })
    .join('\n\n');
}