/**
 *
 */
import React, { useEffect } from 'react'
import { ActivityIndicator } from 'react-native'
import { Container, Text, Screen, Constants } from '@kancha/kancha-ui'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { useMutation, useApolloClient, useQuery } from '@apollo/react-hooks'
import {
  CREATE_IDENTITY,
  GET_MANAGED_IDENTITIES,
} from '../../lib/graphql/queries'

const Intro: React.FC<NavigationStackScreenProps> = ({ navigation }) => {
  const [createDid] = useMutation(CREATE_IDENTITY, {
    onCompleted(response) {
      navigation.navigate('App')
    },
    refetchQueries: [{ query: GET_MANAGED_IDENTITIES }],
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
