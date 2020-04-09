import React, { useEffect } from 'react'
import { agent, Message } from '../lib/setup'
import { wcEventHub } from '../providers/WalletConnect'
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
      AppConstants.events.WALLET_CONNECT.CALL_REQUEST_INT,
      async ({ peerId, peerMeta, payload }) => {
        console.log(peerId, peerMeta, payload)
        const message = payload.params[0]
          ? await agent.handleMessage({
              raw: payload.params[0],
              metaData: [{ type: 'walletConnect' }],
            })
          : null

        if (message && payload.method === 'issue_credential') {
          await message.save()
        }

        if (message && payload.method === 'request_credentials') {
          const requestType = AppConstants.requests.DISCLOSURE
          navigate(Screens.Requests.screen, {
            requestType,
            peerId,
            peerMeta,
            payload,
            messageId: message ? message.id : message,
          })
        }
        if (message && payload.method === 'issue_credential_callback') {
          const requestType = AppConstants.requests.CREDENTIAL
          navigate(Screens.Requests.screen, {
            requestType,
            peerId,
            peerMeta,
            payload,
            message,
          })
        }
      },
    )
  }, [])

  return <></>
}

export default WalletConnect
