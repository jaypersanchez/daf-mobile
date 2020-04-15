import React, { useContext, useEffect } from 'react'
import { Container } from '@kancha/kancha-ui'
import SessionRequest from './SessionRequest'
import CredentialAccept from './CredentialAccept'
import SelectiveDisclosure from './SelectiveDisclosure'

import AppConstants from '../../../constants/index'
import { useNavigationParam } from 'react-navigation-hooks'
import { AppContext } from '../../../providers/AppContext'

interface RequestsProps {}

const Requests: React.FC<RequestsProps> = props => {
  const [selectedIdentity] = useContext(AppContext)
  const requestType = useNavigationParam('requestType')
  const peerMeta = useNavigationParam('peerMeta')
  const peerId = useNavigationParam('peerId')
  const messageId = useNavigationParam('messageId')
  const message = useNavigationParam('message')
  const payload = useNavigationParam('payload')
  const isWalletConnect = useNavigationParam('isWalletConnect')

  const RequestScreen = () => {
    switch (requestType) {
      case AppConstants.requests.SESSION:
        return (
          <SessionRequest
            peerMeta={peerMeta}
            peerId={peerId}
            selectedIdentity={selectedIdentity}
          />
        )
      case AppConstants.requests.CREDENTIAL:
        return (
          <CredentialAccept
            peerMeta={peerMeta}
            peerId={peerId}
            message={message}
            payloadId={payload && payload.id}
          />
        )
      case AppConstants.requests.DISCLOSURE:
        return (
          <SelectiveDisclosure
            peerMeta={peerMeta}
            messageId={messageId}
            peerId={peerId}
            payloadId={payload && payload.id}
            isWalletConnect={isWalletConnect}
            selectedIdentity={selectedIdentity}
          />
        )
      default:
        return <Container />
    }
  }

  return <RequestScreen />
}

export default Requests
