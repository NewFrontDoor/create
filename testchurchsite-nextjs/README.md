This is a New Front Door theme development project built on [Next.js](https://nextjs.org/), bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## How to use this project?

To bootstrap a new NFD style nextjs project run:

```
npx create-next-app -e https://github.com/NewFrontDoor/nfd-nextjs-starter new-theme
```

supplanting 'new-theme' with your preferred project name. Usually `[organisation name]-nextjs`.

## Next Steps
Create a file named `.env.local` in the root of the new project and copy in the following:

```
NEXT_PUBLIC_SANITY_ID=1djoy9b9
```
This will set the initial sanity id to fetch data from the newfrontdoor project. Replace this with your actual Sanity ID in Vercel env variables once you set up the Sanity project.

## Starting your newly bootstrapped project

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
