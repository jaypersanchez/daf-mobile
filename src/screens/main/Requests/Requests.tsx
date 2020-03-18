import React, { useContext } from 'react'
import { Screen, Container, Button } from '@kancha/kancha-ui'
import { useNavigationParam, useNavigation } from 'react-navigation-hooks'
import SessionRequest from './SessionRequest'
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
  } = useContext(WalletConnectContext)
  const requestType = useNavigationParam('requestType')
  const peerMeta = useNavigationParam('peerMeta')
  const peerId = useNavigationParam('peerId')

  const Request = () => {
    switch (requestType) {
      case AppConstants.requests.SESSION:
        return <SessionRequest peerMeta={peerMeta} />
      default:
        return <Container />
    }
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
        </Container>
      }
    >
      <Request />
    </Screen>
  )
}

export default Requests
