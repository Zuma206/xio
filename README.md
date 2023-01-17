<h1 style="display:flex;align-items:center">
	<img src="https://xio.zuma.eu.org/new.svg" style="height:1em"/>&nbsp;XIO Client
</h1>

<div style="display:flex">

![GitHub](https://img.shields.io/github/license/zuma206/xio?style=flat-square)&nbsp;![GitHub commit activity](https://img.shields.io/github/commit-activity/m/zuma206/xio?style=flat-square)&nbsp;![GitHub last commit](https://img.shields.io/github/last-commit/zuma206/xio?style=flat-square)

</div>

XIO's React client built with Vite,
<b>
The backend server can be found [here](https://github.com/Zuma206/XIO-Server),
A production instance can be found [here](https://xio.zuma.eu.org/).
</b>

#### Prerequisites

- Netlify is used for hosting in production, so some scripts/configs are designed around it
- Firebase must be used for authentication

#### Getting up and running:

##### With a local backend:

1. Follow the guide on the server's repo, setting it up and noting the port.
2. Open `src/firebase.ts` and change the options passed to `initializeApp` as to fit the firebase app associated with your backend.
3. Go into `vite.config.ts` and change the `/api` proxy to point to the root of your server's URL instead of `http://localhost:8080`.
4. Execute some scripts from the table below!

##### With the production backend:

1.  Go into `vite.config.ts` and change the `/api` proxy to point to `https://api.zuma.eu.org/` instead of `http://localhost:8080`.

2.  Execute some scripts from the table below!

#### Scripts `npm run [script]`:

| Script | Function                                                         |
| ------ | ---------------------------------------------------------------- |
| dev    | Spin up a development server to use and make changes to XIO      |
| build  | Build a static production build of the site to the "dist" folder |
| draft  | Deploy a draft build to netlify                                  |
| deploy | Deploy a production build to netlify                             |
