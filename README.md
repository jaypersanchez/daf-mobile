[![CircleCI](https://circleci.com/gh/uport-project/daf-mobile/tree/master.svg?style=svg&circle-token=20f8c7ddb44368e4eaa3cf5219a605c431384831)](https://circleci.com/gh/uport-project/daf-mobile/tree/master)
[![codecov](https://codecov.io/gh/uport-project/daf-mobile/branch/master/graph/badge.svg?token=ClBiPSu9Wu)](https://codecov.io/gh/uport-project/daf-mobile)

# Daf mobile

Daf mobile is a reference implementation for [Daf](https://github.com/uport-project/daf) framework and also the source code for `uPort Open` mobile app. `uPort Open` mobile app along with `Daf` will replace the current `uPort` app and legacy architecture.

## Setup

```bash
$ yarn
$ cd ios && pod install
```

## Running locally

```bash
yarn start
```

in another terminal

```bash
$ react-native run-ios OR
$ react-native run-android
```

## Environment variables

[React-native-config](https://github.com/luggit/react-native-config) is being used for environment variables

Add variables to `.env`. You may want to replace your `.env` file during build time.

```
TGE_URI=https://custom.my-tgserver.com
TGE_WS_URI=wss://custom.my-tgserver.com
```

In code:

```jsx
import Config from 'react-native-config'

console.log(Config.ENV) // dev
```

To use a different env file set `ENVFILE` variable:

```
$ ENVFILE=.env.production react-native run-android
```

## Sentry

Sentry is set up. Add the correct configs to .env
