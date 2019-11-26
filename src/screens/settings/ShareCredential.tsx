/**
 * Serto Mobile App
 *
 */

import React, { useState, useEffect } from 'react'
import { Container, Screen, Text, Constants, Device } from '@kancha/kancha-ui'
import { useNavigationParam } from 'react-navigation-hooks'
import gql from 'graphql-tag'
import { useMutation, useQuery } from 'react-apollo'
import QRCode from 'react-native-qrcode-svg'
import { ActivityIndicator } from 'react-native'
import { dataStore } from 'Serto/src/lib/setup'

const SIGN_VC_MUTATION = gql`
  mutation sign($did: String!, $data: VerifiableCredentialInput!) {
    actionSignVc(did: $did, data: $data)
  }
`

const SEND_CLAIM = gql`
  mutation send($from: String!, $to: String!, $jwt: String!) {
    actionSendJwt(from: $from, to: $to, jwt: $jwt)
  }
`

var claimToObject = (arr: any[]) => {
  console.log(arr)

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
  const [actionSendJwt] = useMutation(SEND_CLAIM, {
    onCompleted: response => {
      if (response && response.actionSendJwt) {
        setSending(false)
        setSent(true)
      }
    },
  })
  const [actionSignVc] = useMutation(SIGN_VC_MUTATION, {
    onCompleted: response => {
      if (response && response.actionSignVc) {
        setJwt(response.actionSignVc)
        setLoading(false)
        setSending(true)
        actionSendJwt({
          variables: {
            from: claim.issuer,
            to: claim.subject,
            jwt: response.actionSignVc,
          },
        })
      }
    },
  })

  useEffect(() => {
    actionSignVc({
      variables: {
        did: claim.issuer,
        data: {
          sub: claim.subject,
          vc: {
            context: ['https://www.w3.org/2018/credentials/v1'],
            type: ['VerifiableCredential'],
            credentialSubject: {
              ...claimFields,
            },
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
