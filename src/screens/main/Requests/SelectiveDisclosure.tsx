import React, { useState, useEffect, useContext } from 'react'
import {
  Container,
  Banner,
  Indicator,
  Credential,
  Toaster,
  RequestItem,
  Screen,
  Button,
} from '@kancha/kancha-ui'
import {
  SIGN_VP,
  SEND_JWT_MUTATION,
  GET_MESSAGE_SDR,
} from '../../../lib/graphql/queries'
import { useMutation, useQuery } from 'react-apollo'
import { useNavigation } from 'react-navigation-hooks'
import { WalletConnectContext } from '../../../providers/WalletConnect'

interface RequestProps {
  peerId: string
  payloadId: number
  peerMeta: any
  messageId: string
  isWalletConnect: boolean
  selectedIdentity: any
}
interface ValidationState {
  [index: string]: {
    required: boolean
    jwt: string | null
  }
}

const SelectiveDisclosure: React.FC<RequestProps> = ({
  peerId,
  peerMeta,
  messageId,
  isWalletConnect,
  selectedIdentity,
  payloadId,
}) => {
  const [sending, updateSending] = useState<boolean>(false)
  const [selected, updateSelected] = useState<ValidationState>({})
  const [formValid, setValid] = useState(true)
  const [message, setMessage] = useState()
  const navigation = useNavigation()
  const { data: requestMessage } = useQuery(GET_MESSAGE_SDR, {
    variables: { id: messageId, selectedDid: selectedIdentity },
  })
  const {
    walletConnectApproveCallRequest,
    walletConnectRejectCallRequest,
  } = useContext(WalletConnectContext)

  const checkValidity = () => {
    let valid = true
    Object.keys(selected).map(key => {
      if (selected[key].required && !selected[key].jwt) {
        valid = false
      }
    })

    setValid(valid)
  }

  const [actionSendJwt] = useMutation(SEND_JWT_MUTATION, {
    onCompleted: response => {
      if (response.actionSendJwt) {
        updateSending(false)
        Toaster.confirm(
          'Response sent',
          `Your response was sent to ${requestMessage.sender.shortId}`,
        )
        navigation.goBack()
      }
    },
    onError: error => {
      console.log(error)
    },
  })
  const [actionSignVp] = useMutation(SIGN_VP, {
    onCompleted: response => {
      if (response.actionSignVp) {
        updateSending(true)
        approveCallRequest(response.actionSignVp)

        navigation.goBack()

        // actionSendJwt({
        //   variables: {
        //     to: message.sender.did,
        //     from: selectedIdentity,
        //     jwt: response.actionSignVp,
        //   },
        // })
      }
    },
    onError: error => {
      console.log(error)
    },
  })

  const accept = () => {
    if (formValid) {
      const selectedVp = Object.keys(selected)
        .map(key => selected[key].jwt)
        .filter(item => item)

      const payload = {
        variables: {
          did: selectedIdentity,
          data: {
            aud: message && message.sender.did,
            tag: message && message.threadId,
            vp: {
              context: ['https://www.w3.org/2018/credentials/v1'],
              type: ['VerifiablePresentation'],
              verifiableCredential: selectedVp,
            },
          },
        },
      }

      actionSignVp(payload)
    }
  }

  const onSelectItem = (
    id: string | null,
    jwt: string | null,
    claimType: string,
  ) => {
    const updatedSelection = {
      ...selected,
      [claimType]: { ...selected[claimType], jwt },
    }

    updateSelected(updatedSelection)
  }

  const approveCallRequest = async (jwt: string) => {
    await walletConnectApproveCallRequest(peerId, {
      id: payloadId,
      result: jwt,
    })
    navigation.goBack()
  }

  const rejectCallRequest = async () => {
    await walletConnectRejectCallRequest(peerId, {
      id: payloadId,
      error: 'CREDENTIAL_SHARING_REJECTED',
    })
    navigation.goBack()
  }

  useEffect(() => {
    checkValidity()
  }, [selected])

  useEffect(() => {
    if (requestMessage) {
      const { message } = requestMessage
      let defaultSelected: ValidationState = {}
      message.sdr.map((sdr: any) => {
        if (sdr && sdr.essential) {
          if (sdr.vc.length) {
            defaultSelected[sdr.claimType] = {
              required: true,
              jwt: sdr.vc[0].jwt,
            }
          } else {
            defaultSelected[sdr.claimType] = {
              required: true,
              jwt: null,
            }
            setValid(false)
          }
        }
      })
      setMessage(message)
      updateSelected(defaultSelected)
    }
  }, [requestMessage])

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
              buttonText={'Share'}
              onPress={accept}
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
          text={`${peerMeta && peerMeta.name} has requested credentials`}
        />
        <Container>
          {message &&
            message.sdr &&
            message.sdr.map((sdrRequestField: any, index: number) => {
              return (
                <RequestItem
                  closeAfterSelect={false}
                  key={sdrRequestField.claimType + index}
                  claimType={sdrRequestField.claimType}
                  reason={sdrRequestField.reason}
                  issuers={sdrRequestField.iss}
                  credentials={sdrRequestField.vc}
                  required={sdrRequestField.essential}
                  onSelectItem={onSelectItem}
                />
              )
            })}
        </Container>
      </Container>
    </Screen>
  )
}

export default SelectiveDisclosure
