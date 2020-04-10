/**
 * Serto Mobile App
 *
 */
import React, { useState, useEffect } from 'react'
import { Container, Screen, Text, Constants, Device } from '@kancha/kancha-ui'
import { useNavigationParam } from 'react-navigation-hooks'
import { useMutation } from 'react-apollo'
import QRCode from 'react-native-qrcode-svg'
import { ActivityIndicator } from 'react-native'
import {
  SEND_JWT_MUTATION,
  SIGN_VC_MUTATION,
  NEW_MESSAGE,
} from '../../lib/graphql/queries'

const claimToObject = (arr: any[]) => {
  return arr.reduce(
    (obj, item) => Object.assign(obj, { [item.type]: item.value }),
    {},
  )
}

export default () => {
  const claim = useNavigationParam('claim')
  const claimFields = claimToObject(claim.fields)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [jwt, setJwt] = useState()
  const [actionSendJwt] = useMutation(SEND_JWT_MUTATION, {
    onCompleted: response => {
      setSending(false)
      setSent(true)
    },
  })

  const [handleMessage] = useMutation(NEW_MESSAGE, {
    onCompleted: async response => {
      if (response && response.handleMessage && response.handleMessage.raw) {
        setJwt(response.handleMessage.raw)
        setLoading(false)
        setSending(true)
        actionSendJwt({
          variables: {
            from: claim.issuer,
            to: claim.subject,
            jwt: response.handleMessage.raw,
          },
        })
      }
    },
  })

  const [signCredentialJwt] = useMutation(SIGN_VC_MUTATION, {
    onCompleted: async response => {
      if (
        response &&
        response.signCredentialJwt &&
        response.signCredentialJwt.raw
      ) {
        handleMessage({
          variables: {
            raw: response.signCredentialJwt.raw,
            meta: [{ type: 'selfSigned' }],
          },
        })
      }
    },
  })

  useEffect(() => {
    signCredentialJwt({
      variables: {
        data: {
          issuer: claim.issuer,
          context: ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential'],
          credentialSubject: {
            id: claim.subject,
            ...claimFields,
          },
        },
      },
    })
  }, [])

  return (
    <Screen scrollEnabled={true} safeArea={true} background={'primary'}>
      <Container padding>
        <Container>
          <Text type={Constants.TextTypes.H3} bold>
            Share Claim
          </Text>
        </Container>
        <Container>
          {loading && (
            <Container>
              <Text>One moment...</Text>
              <ActivityIndicator size={'large'} />
            </Container>
          )}
          {!loading && jwt && (
            <Container alignItems={'center'} paddingTop={50}>
              <QRCode size={Device.width - 100} value={jwt} />
            </Container>
          )}

          <Container alignItems={'center'} paddingTop>
            <Text>
              {sending
                ? 'Sending message...'
                : sent
                ? `Message sent to ${claim.subject}`
                : ''}
            </Text>
          </Container>
        </Container>
      </Container>
    </Screen>
  )
}
