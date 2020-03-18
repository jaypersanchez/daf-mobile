import React, { useEffect } from 'react'
import { core, Message } from '../lib/setup'
import { wcEventHub, WalletConnectProvider } from '../providers/WalletConnect'
import { Screens } from '../navigators/screens'
import AppConstants from '../constants/index'

interface WalletConnectProps {
  navigate: (routeName: any, params: any) => void
}

/**
 * Top level component to house all the event handlers coming from wallet connect provider
 **/
const WalletConnect: React.FC<WalletConnectProps> = ({ navigate }) => {
  useEffect(() => {
    wcEventHub.addListener(
      AppConstants.events.WALLET_CONNECT.SESSION_REQUEST_INT,
      async ({ peerId, peerMeta, payload }: any) => {
        const requestType = AppConstants.requests.SESSION

        navigate(Screens.Requests.screen, {
          requestType,
          peerId,
          peerMeta,
          payload,
        })
      },
    )

    wcEventHub.addListener(
      'wc_call_request',
      async ({ peerId, peerMeta, payload }) => {
        const saveMessage = async () => {
          if (payload.params[0]) {
            return await core.validateMessage(
              new Message({
                raw: payload.params[0],
                meta: {
                  type: 'qrCode',
                },
              }),
            )
          }
          return false
        }
        const message = await saveMessage()

        // NavigationService.navigate('Request', {
        //   peerId,
        //   peerMeta,
        //   payload,
        //   messageId: message ? message.id : message,
        // })
      },
    )
  }, [])

  return <></>
}

export default WalletConnect
