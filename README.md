# XIO Nouveau

_License: AGPLv3_

XIO's redesigned React client and server built with [React Router](https://github.com/remix-run/react-router) v7, and [Socktopus](https://github.com/zuma206/socktopus)

### Environment Variables:

| Key                    | Function                                                                  |
| ---------------------- | ------------------------------------------------------------------------- |
| `GOOGLE_CLIENT_ID`     | Your Google application's Client ID                                       |
| `GOOGLE_CLIENT_SECRET` | A corresponding secret for your Google application                        |
| `APP_ROOT_URL`         | The root URL for the instance. Example: `http://localhost:3400/`          |
| `APP_SECRET`           | A randomly generated secret for cryptography                              |
| `SOCKTOPUS_ROOT_URL`   | The root URL of the socktopus instance. Example: `http://localhost:3401/` |
| `SOCKTOPUS_SECRET`     | A randomly generated secret for secure communication with socktopus       |
| `SOCKTOPUS_NAME`       | The name of this app registered in the socktopus instance                 |
| `APP_DB_URL`           | The path for the SQLite DB                                                |

### Package Scripts:

| Script  | Function                                             |
| ------- | ---------------------------------------------------- |
| `dev`   | Run a development server with HMR                    |
| `build` | Generate a production build of the client and server |
| `start` | Run a production build with NodeJS                   |
