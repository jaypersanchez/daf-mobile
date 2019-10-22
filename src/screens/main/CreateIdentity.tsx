/**
 *
 */
import React, { useEffect } from 'react'
import { ActivityIndicator } from 'react-native'
import { Container, Text, Screen, Constants } from '@kancha/kancha-ui'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { useMutation, useApolloClient } from '@apollo/react-hooks'
import { createDidMutation as CREATE_DID } from '../../lib/Signer'

const Intro: React.FC<NavigationStackScreenProps> = ({ navigation }) => {
  const client = useApolloClient()
  const [createDid] = useMutation(CREATE_DID, {
    onCompleted(response) {
      client.writeData({ data: { selectedDid: response.createDid.did } })
      navigation.navigate('App')
    },
    refetchQueries: ['getDids'],
  })
  const importingSeed = navigation.getParam('import', false)

  useEffect(() => {
    setTimeout(() => {
      if (!importingSeed) {
        createDid()
      } else {
        navigation.navigate('App')
      }
    }, 1100)
  }, [])

  return (
    <Screen>
      <Container padding marginTop={100}>
        <ActivityIndicator />
      </Container>
      <Container marginTop={30} alignItems={'center'}>
        <Text type={Constants.TextTypes.H3} bold>
          {importingSeed ? 'Importing seed...' : 'Creating your identity...'}
        </Text>
        <Container marginTop={10}>
          <Text type={Constants.TextTypes.Body} textAlign={'center'}>
            Hang on for just a moment
          </Text>
        </Container>
      </Container>
    </Screen>
  )
}

export default Intro
