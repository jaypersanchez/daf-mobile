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
import { SEND_JWT_MUTATION, SIGN_SDR_MUTATION } from '../../lib/graphql/queries'

export default () => {
  const request = useNavigationParam('request')

  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [jwt, setJwt] = useState()
  const [actionSendJwt] = useMutation(SEND_JWT_MUTATION, {
    onCompleted: () => {
      setSending(false)
      setSent(true)
    },
  })

  const [signSdrJwt] = useMutation(SIGN_SDR_MUTATION, {
    onCompleted: response => {
      if (response && response.signSdrJwt) {
        setJwt(response.signSdrJwt)
        setLoading(false)

        if (request.subject) {
          setSending(true)

          actionSendJwt({
            variables: {
              from: request.issuer,
              to: request.subject,
              jwt: response.signSdrJwt,
            },
          })
        }
      }
    },
  })

  useEffect(() => {
    signSdrJwt({
      variables: {
        data: {
          issuer: request.issuer,
          tag: request.tag,
          subject: request.subject || null,
          claims: request.claims,
        },
      },
    })
  }, [])

  return (
    <Screen scrollEnabled={true} safeArea={true} background={'primary'}>
      <Container padding>
        <Container>
          <Text type={Constants.TextTypes.H3} bold>
            Send Request
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
                ? `Message sent to ${request.subject}`
                : 'Present QR for scanning'}
            </Text>
          </Container>
        </Container>
      </Container>
    </Screen>
  )
}
