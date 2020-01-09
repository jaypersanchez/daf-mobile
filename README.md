[![CircleCI](https://circleci.com/gh/uport-project/daf-mobile/tree/master.svg?style=svg&circle-token=20f8c7ddb44368e4eaa3cf5219a605c431384831)](https://circleci.com/gh/uport-project/daf-mobile/tree/master)
[![codecov](https://codecov.io/gh/uport-project/daf-mobile/branch/master/graph/badge.svg?token=ClBiPSu9Wu)](https://codecov.io/gh/uport-project/daf-mobile)

# Daf mobile

Daf mobile is a refernece implentation for [Daf](https://github.com/uport-project/daf) framework

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
react-native run-ios OR
react-native run-android
```

## Environment variables

[React-native-config](https://github.com/luggit/react-native-config) is being used for environment variables

Add variables to `.env`. You may want to replace your `.env` file during build time.

```
TGE_URI=https://custom.my-tgserver.com
TGE_WS_URI=wss://custom.my-tgserver.com
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

Sentry is set up. Add the correct configs to .env
