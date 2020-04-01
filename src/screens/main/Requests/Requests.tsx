import React, { useContext } from 'react'
import { Screen, Container, Button } from '@kancha/kancha-ui'
import { useNavigationParam, useNavigation } from 'react-navigation-hooks'
import SessionRequest from './SessionRequest'
import CredentialAccept from './CredentialAccept'
import AppConstants from '../../../constants/index'
import { WalletConnectContext } from '../../../providers/WalletConnect'
import { AppContext } from '../../../providers/AppContext'

interface RequestsProps {}

const Requests: React.FC<RequestsProps> = props => {
  const navigation = useNavigation()
  const [selectedIdentity] = useContext(AppContext)
  const {
    walletConnectApproveSessionRequest,
    walletConnectRejectSessionRequest,
    walletConnectApproveCallRequest,
  } = useContext(WalletConnectContext)
  const requestType = useNavigationParam('requestType')
  const peerMeta = useNavigationParam('peerMeta')
  const peerId = useNavigationParam('peerId')
  const messageId = useNavigationParam('messageId')
  const payload = useNavigationParam('payload')

  const Request = () => {
    switch (requestType) {
      case AppConstants.requests.SESSION:
        return <SessionRequest peerMeta={peerMeta} />
      case AppConstants.requests.CREDENTIAL:
        return <CredentialAccept peerMeta={peerMeta} messageId={messageId} />
      default:
        return <Container />
    }
  }

  const Actions = () => {
    switch (requestType) {
      case AppConstants.requests.SESSION:
        return (
          <>
            <Container flex={1} marginRight>
              <Button
                type={'secondary'}
                fullWidth
                buttonText={'Reject'}
                onPress={_rejectSessionRequest}
                block={'outlined'}
              />
            </Container>
            <Container flex={2}>
              <Button
                type={'primary'}
                disabled={false}
                fullWidth
                buttonText={'Connect'}
                onPress={_approveSessionRequest}
                block={'filled'}
              />
            </Container>
          </>
        )
      case AppConstants.requests.CREDENTIAL:
        return (
          <>
            <Container flex={1} marginRight>
              <Button
                type={'secondary'}
                fullWidth
                buttonText={'Reject'}
                onPress={_rejectCallRequest}
                block={'outlined'}
              />
            </Container>
            <Container flex={2}>
              <Button
                type={'primary'}
                disabled={false}
                fullWidth
                buttonText={'Accept'}
                onPress={_approveCallRequest}
                block={'filled'}
              />
            </Container>
          </>
        )
      default:
        return <Container />
    }
  }

  const _approveCallRequest = async () => {
    await walletConnectApproveCallRequest(peerId, {
      id: payload.id,
      result: 'CREDENTIAL_ACCEPTED',
    })
    navigation.goBack()
  }

  const _rejectCallRequest = async () => {
    navigation.goBack()
  }

  const _approveSessionRequest = async () => {
    await walletConnectApproveSessionRequest(peerId, {
      accounts: [selectedIdentity.did],
      // Hardcoding this for now
      chainId: 4,
    })

    navigation.goBack()
  }
  const _rejectSessionRequest = () => {
    walletConnectRejectSessionRequest(peerId)
  }

  return (
    <Screen
      scrollEnabled
      footerComponent={
        <Container flexDirection={'row'} padding paddingBottom={32}>
          <Actions />
        </Container>
      }
    >
      <Request />
    </Screen>
  )
}

export default Requests
