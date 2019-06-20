import codePush, { DownloadProgress } from 'react-native-code-push'
import Log from './Log'

export const handleCodePushStatusChange = (status: codePush.SyncStatus) => {
  switch (status) {
    case codePush.SyncStatus.CHECKING_FOR_UPDATE:
      Log.info('Checking for updates.', 'Codepush')
      break
    case codePush.SyncStatus.DOWNLOADING_PACKAGE:
      Log.info('Downloading package.', 'Codepush')
      break
    case codePush.SyncStatus.INSTALLING_UPDATE:
      Log.info('Installing update.', 'Codepush')
      break
    case codePush.SyncStatus.UP_TO_DATE:
      Log.info('Up-to-date.', 'Codepush')
      break
    case codePush.SyncStatus.UPDATE_INSTALLED:
      Log.info('Update installed.', 'Codepush')
      break
  }
}
