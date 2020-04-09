import React, { useState, useEffect, useContext } from 'react'
import {
  Container,
  Banner,
  Button,
  Indicator,
  Credential,
  Screen,
} from '@kancha/kancha-ui'
import { WalletConnectContext } from '../../../providers/WalletConnect'
import { useNavigation } from 'react-navigation-hooks'

interface RequestProps {
  peerId: string
  payloadId: number
  peerMeta: any
  message: any
}

const AcceptCredential: React.FC<RequestProps> = ({
  peerId,
  payloadId,
  peerMeta,
  message,
}) => {
  const {
    walletConnectRejectCallRequest,
    walletConnectApproveCallRequest,
  } = useContext(WalletConnectContext)
  const [vcs, updateVcs] = useState()
  const navigation = useNavigation()

  const approveCallRequest = async () => {
    message.save()
    await walletConnectApproveCallRequest(peerId, {
      id: payloadId,
      result: 'CREDENTIAL_ACCEPTED',
    })
    navigation.goBack()
  }

  const rejectCallRequest = async () => {
    await walletConnectRejectCallRequest(peerId, {
      id: payloadId,
      error: 'CREDENTIAL_REJECTED',
    })
    navigation.goBack()
  }

  useEffect(() => {
    console.log(message.credentials)
    updateVcs(message.credentials)
  }, [])

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
              onPress={rejectCallRequest}
              block={'outlined'}
            />
          </Container>
          <Container flex={2}>
            <Button
              type={'primary'}
              disabled={false}
              fullWidth
              buttonText={'Accept'}
              onPress={approveCallRequest}
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
          text={`${peerMeta && peerMeta.name} has issue you a credential`}
        />
        <Container padding flex={1} background={'primary'}>
          {vcs &&
            vcs.map((vc: any) => {
              return (
                <Credential
                  shadow={1.5}
                  background={'primary'}
                  key={vc.hash}
                  exp={vc.expirationDate}
                  issuer={vc.issuer}
                  subject={vc.subject}
                  fields={vc.claims}
                  jwt={vc.raw}
                />
              )
            })}
        </Container>
      </Container>
    </Screen>
  )
}

export default AcceptCredential
