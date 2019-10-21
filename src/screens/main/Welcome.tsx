/**
 * Serto Mobile App
 *
 */
import React from 'react'
import {
  Container,
  Text,
  FabButton,
  Constants,
  Screen,
  Credential,
} from '@kancha/kancha-ui'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { Icons } from '../../theme'

const sertoVerifiableCredential = {
  iss: 'Serto Identity Platform',
  sub: 'did:ethr:0xf3beac30c498d9e26865f34fcaa57dbb935b0d74',
  type: 'Serto ID',
  iat: 1562769371,
  exp: 1579478400,
  claim: {
    'Serto ID': {
      name: 'Sarah Adamson',
      dateOfBirth: '22-01-75',
      country: 'USA',
      children: [
        {
          name: 'Bob',
          age: 4,
        },
        {
          name: 'Alice',
          age: 9,
        },
      ],
    },
  },
  vc: [],
}

const bankVerifiableCredential = {
  iss: 'Deutsche Bank',
  sub: 'did:ethr:0xf3beac30c498d9e26865f34fcaa57dbb935b0d74',
  type: 'Credit Worthy',
  iat: 1562769371,
  exp: 1579478400,
  claim: {
    'Credit Worthy': {
      name: 'Alice Chainy',
      dateOfBirth: '22-01-75',
      country: 'China',
      approvedLimit: 30000000,
    },
  },
  vc: [],
}

// tslint:disable-next-line:no-var-requires
const avatar1 = require('../../assets/images/space-x-logo.jpg')

const Welcome: React.FC<NavigationStackScreenProps> = props => {
  const credentials = [
    {
      title: sertoVerifiableCredential.type,
      issuer: sertoVerifiableCredential.iss,
      logo: avatar1,
      onPress: () =>
        props.navigation.navigate('Credential', {
          vc: sertoVerifiableCredential,
        }),
    },
    {
      title: bankVerifiableCredential.type,
      issuer: bankVerifiableCredential.iss,
      logo: avatar1,
      onPress: () =>
        props.navigation.navigate('Credential', {
          vc: bankVerifiableCredential,
        }),
    },
  ]
  const loadRequest = (requestData: any) => {
    setTimeout(() => {
      if (requestData.type === 'DISCLOSURE') {
        props.navigation.push('Request', {
          requestData,
        })
      }
    }, 500)
  }

  return (
    <Screen scrollEnabled>
      <Container padding>
        <Container marginBottom>
          <Text type={Constants.TextTypes.H2} bold>
            Credentials
          </Text>
        </Container>
        <Container>
          {credentials.map((credential, index) => {
            return <Credential key={index} {...credential} />
          })}
        </Container>
      </Container>
    </Screen>
  )
}

export default Welcome
