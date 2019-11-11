import codePush, { DownloadProgress } from 'react-native-code-push'
import Debug from 'debug'

const debug = Debug('codepush')

export const handleCodePushStatusChange = (status: codePush.SyncStatus) => {
  switch (status) {
    case codePush.SyncStatus.CHECKING_FOR_UPDATE:
      debug('Checking for updates.')
      break
    case codePush.SyncStatus.DOWNLOADING_PACKAGE:
      debug('Downloading package.')
      break
    case codePush.SyncStatus.INSTALLING_UPDATE:
      debug('Installing update.')
      break
    case codePush.SyncStatus.UP_TO_DATE:
      debug('Up-to-date.')
      break
    case codePush.SyncStatus.UPDATE_INSTALLED:
      debug('Update installed.')
      break
  }
}
