# serto-mobile

Serto Mobile App

[![CircleCI](https://circleci.com/gh/uport-project/serto-mobile/tree/master.svg?style=svg&circle-token=20f8c7ddb44368e4eaa3cf5219a605c431384831)](https://circleci.com/gh/uport-project/serto-mobile/tree/master)
[![codecov](https://codecov.io/gh/uport-project/serto-mobile/branch/master/graph/badge.svg?token=ClBiPSu9Wu)](https://codecov.io/gh/uport-project/serto-mobile)

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