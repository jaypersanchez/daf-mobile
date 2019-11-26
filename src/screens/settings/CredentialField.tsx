import React, { useState, useEffect } from 'react'
import {
  Screen,
  Container,
  Text,
  Constants,
  Button,
  Device,
} from '@kancha/kancha-ui'
import { ActivityIndicator } from 'react-native'
import { useNavigationParam } from 'react-navigation-hooks'
import { useQuery } from '@apollo/react-hooks'
import { GET_MESSAGE } from '../../lib/graphql/queries'
import QRCode from 'react-native-qrcode-svg'

interface MessageProcess {}

const MessageProcess: React.FC<MessageProcess> = () => {
  const hash = useNavigationParam('hash')
  const { data, loading } = useQuery(GET_MESSAGE, {
    variables: {
      hash,
    },
  })

  return (
    <Screen safeAreaBottom>
      <Container flex={1} alignItems={'center'} justifyContent={'center'}>
        {loading && <ActivityIndicator size={'large'} />}
        {!loading && data && data.message && data.message.jwt && (
          <QRCode value={data.message.jwt} size={Device.width - 100} />
        )}
      </Container>
    </Screen>
  )
}

export default MessageProcess
