/**
 *
 */
import React, { useEffect } from 'react'
import { ActivityIndicator } from 'react-native'
import { Container, Text, Screen, Constants } from '@kancha/kancha-ui'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { useMutation } from '@apollo/react-hooks'
import {
  CREATE_IDENTITY,
  GET_MANAGED_IDENTITIES,
  GET_VIEWER,
} from '../../lib/graphql/queries'

const Intro: React.FC<NavigationStackScreenProps> = ({ navigation }) => {
  const refetchQueries = [
    { query: GET_MANAGED_IDENTITIES },
    { query: GET_VIEWER },
  ]
  const [createDid] = useMutation(CREATE_IDENTITY, {
    onCompleted({ createIdentity }) {
      navigation.navigate('CreateFirstCredential', { did: createIdentity.did })
    },
    refetchQueries,
  })
  const importingSeed = navigation.getParam('import', false)

  useEffect(() => {
    setTimeout(() => {
      if (!importingSeed) {
        createDid({
          variables: {
            type: 'rnEthr',
          },
        })
      } else {
        // navigation.navigate('App')
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
