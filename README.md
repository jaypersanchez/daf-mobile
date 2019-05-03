# Serto mobile

Serto React Native Mobile App

## Setup

```
yarn
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
