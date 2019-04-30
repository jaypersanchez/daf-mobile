# serto-mobile

Serto Mobile App

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
