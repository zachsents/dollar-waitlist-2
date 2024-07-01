# DollarWaitlist

DollarWaitlist is a platform that allows users to spin up premium waitlists to build high-commitment engagement on early-stage products. Waitlists use a standard template that looks good and is easy to configure (<10 mins).

---

## Architecture & Project Structure

DollarWaitlist uses server-side rendering in order to make waitlists SEO-friendly.

### Server

The UI is written with JSX, but is not comprised of React components. Instead, they are pages and fragments rendered to HTML by [KitaJS HTML](https://github.com/kitajs/html), a JSX renderer. These pages and fragments are served by an [Express](https://expressjs.com/) server ([see the server code here](https://github.com/zachsents/dollar-waitlist-2/blob/main/index.ts)).

### Runtime

This server is running on [Bun](https://bun.sh/) instead of Node.js. Bun is a nice alternative runtime, package manager, bundler, etc. The runime itself is mostly a drop-in replacement, but there are maybe 2 instances of Bun-specific code in this repo. Search "Bun" case-sensitively in the repo to find these instances.

### Client

For frontend interactivity, the project uses a combination of [HTMX](https://github.com/kitajs/html) and [Alpine.js](https://alpinejs.dev/). HTMX is used to swap in the aforementioned page fragments from the server on certain interacive events. Alpine.js is purely used for client-side interactions.

### Database & Authentication

This project uses [Firebase](https://firebase.google.com/) for its database and authentication service. Specifically, it uses the [Firestore](https://firebase.google.com/docs/firestore) no-SQL database.

### Cloud Deployment

This project is currently running on a [Digital Ocean Droplet](https://www.digitalocean.com/products/droplets), which is just a cheap VPS. It costs ~$6/month. This is the setup I recommend because it's quite simple. Just spin one up, point your domain at it, then follow the setup instructions below for production.

If you want to move this to something serverless, it should mostly work, but the server code might need a little adjusting to stop expecting SSL certificates on the machine.

## Setup

To get started, clone this repository:
```sh
git clone https://github.com/zachsents/dollar-waitlist-2
```
Enter the repo:
```sh
cd dollar-waitlist-2
```
Then install the dependencies:
```sh
bun install
```
See the next section for setting up environment variables.

### Environment Variables

You'll need to create a `.env` file at the project root with the following environment variables.

`PORT` (*default: 3000*): The port the server runs on. You'll want to change this to 443 in production. You can leave it out during development and the server will be on port 3000.

`FIREBASE_API_KEY`: The publishable API key from the Firebase console.

`STRIPE_API_KEY`: The API key for Stripe. Stripe is used to generate checkout sessions.

`STRIPE_PRICE_ID`: The ID of the Price object in Stripe for the Product that you make to represent a waitlist signup. e.g. `price_xxx123abc`

`SEND_PAYOUT_REQUEST_URL`: The URL of a webhook for when someone requests a payout. I was just using a [WorkflowDog](https://workflow.dog) automation that sent me an email, but I recommend writing some additional code to handle this via an email API like [Resend](https://resend.com).

`LETS_ENCRYPT_DIR`: The directory where your Let's Encrypt SSL certificates were placed. See SSL section for more info. e.g. `/etc/letsencrypt/live/dollarwaitlist.com`

### Firebase

You'll need to create a Firebase project. Once in your project dashboard, you'll need to get 2 sets of credentials.

For the client-side, you'll need to create a new web app in the Firebase console and copy the credentials snippet they provide to you. This goes in [`client_modules/firebase.ts`](https://github.com/zachsents/dollar-waitlist-2/blob/main/client-modules/firebase.ts).

For the server-side, you'll need to create service account credentials, which the server expects to be at the project root in a file called `service-account.json`. Make sure not to commit this file to GitHub.

### Stripe

This project uses stripe to generate links for checkout sessions in order to collect payments from users. A single Product and Price are used to represent a waitlist signup.

### SSL

When running on port 443, server expects the following SSL files to be present:
```
/etc/letsencrypt/live/dollarwaitlist.com/privkey.pem
/etc/letsencrypt/live/dollarwaitlist.com/fullchain.pem
/etc/letsencrypt/live/dollarwaitlist.com/chain.pem
```
You can generate these files using Certbot, [instructions here](https://certbot.eff.org/instructions?ws=other&os=ubuntufocal). You'll need access to the domain, first. It's actually a bit easier if you point the domain to whatever server you're generating the files on first.

These should also probably be moved to environment variables.

### Running for development

To run the development server, run:
```sh
bun run dev
```
This uses the [concurrently](https://www.npmjs.com/package/concurrently) NPM package to simulataneously spin up the [TailwindCSS](https://tailwindcss.com/) development process, a [custom build script](https://github.com/zachsents/dollar-waitlist-2/blob/main/build-client-scripts.ts), and the server in [watch mode](https://bun.sh/docs/runtime/hot).

Note that this does not spin up a development database or authentication server. It uses the same one as in production. Be careful during development.

### Running for production

To run the server in production, set the `PORT` environment variable to 443.

then run:
```sh
bun run start
```
This starts the server with [PM2](https://pm2.io), a process manager. They have a nice web UI you can connect your server to as well if you're into that, which shows status and metrics. Not necessary, though.