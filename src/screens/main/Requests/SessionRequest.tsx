import React, { useContext } from 'react'
import {
  Container,
  Banner,
  ListItem,
  Indicator,
  Screen,
  Button,
} from '@kancha/kancha-ui'
import { WalletConnectContext } from '../../../providers/WalletConnect'
import { useNavigation } from 'react-navigation-hooks'

interface RequestProps {
  peerId: string
  peerMeta: any
  selectedIdentity: any
}

const SessionRequest: React.FC<RequestProps> = ({
  peerId,
  peerMeta,
  selectedIdentity,
}) => {
  const navigation = useNavigation()
  const {
    walletConnectApproveSessionRequest,
    walletConnectRejectSessionRequest,
  } = useContext(WalletConnectContext)

  const _approveSessionRequest = async () => {
    await walletConnectApproveSessionRequest(peerId, {
      accounts: [selectedIdentity],
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
      <Container>
        <Banner
          title={peerMeta.name}
          subTitle={peerMeta.url}
          issuer={{
            did: '',
            shortId: '',
            profileImage: peerMeta && peerMeta.icons[0],
          }}
        />
        <Indicator
          text={`${peerMeta && peerMeta.name} is requesting you share`}
        />
        <ListItem last subTitle={'Your public did'}>
          {selectedIdentity}
        </ListItem>
      </Container>
    </Screen>
  )
}

export default SessionRequest
