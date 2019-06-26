[![CircleCI](https://circleci.com/gh/uport-project/serto-mobile/tree/master.svg?style=svg&circle-token=20f8c7ddb44368e4eaa3cf5219a605c431384831)](https://circleci.com/gh/uport-project/serto-mobile/tree/master)
[![codecov](https://codecov.io/gh/uport-project/serto-mobile/branch/master/graph/badge.svg?token=ClBiPSu9Wu)](https://codecov.io/gh/uport-project/serto-mobile)

# Serto mobile

Serto React Native Mobile App

## Setup

```
yarn
cd ios && pod install
```

## Running locally

```
yarn start
```

in another terminal

```
react-native run-android
```

## Codepush

Releases that do not involve changes to the native code, can be pushed to mobile devices using [codepush](https://docs.microsoft.com/en-us/appcenter/distribution/codepush/)

### Initial setup

```
npm install -g appcenter-cli
appcenter login
```

Download `./codepush-privatekey.pem` from 1Password.

### Releasing hot-fix to production

```
yarn codepush-production
```

### Releasing hot-fix to staging

```
yarn codepush-staging
```

## Environment variables

We are using [react-native-config](https://github.com/luggit/react-native-config)

Add variables to `.env` or `.env.production`:

```
ENV=dev
API_URL=https://localhost:3000
```

In code:

```
import Config from 'react-native-config'

console.log(Config.ENV)  // dev
```

To use a different env file set `ENVFILE` variable:

```
$ ENVFILE=.env.production react-native run-android
```

## Sentry

If you are using `nvm` you may need to run this command to enable iOS builds. Use correct `VERSION`

```
ln -s $HOME/.nvm/versions/node/{VERSION}/bin/node /usr/local/bin/node
```

`SENTRY_DSN` needs to be in `.env` and `.env.production` files.
