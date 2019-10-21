/**
 * Serto Mobile App
 *
 */
import * as React from 'react'
import {
  Container,
  Text,
  FabButton,
  Constants,
  Screen,
  ClaimDebug,
} from '@kancha/kancha-ui'
import { NavigationStackScreenProps } from 'react-navigation-stack'

const claim = {
  iss: 'did:ethr:0xb9c5714089478a327f09197987f16f9e5d936e8a',
  sub: 'did:ethr:0xf3beac30c498d9e26865f34fcaa57dbb935b0d74',
  type: 'Sample Claim',
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

export default (props: NavigationStackScreenProps) => {
  return (
    <Screen scrollEnabled>
      <Container paddingBottom>
        <ClaimDebug {...claim} cardView />
      </Container>
    </Screen>
  )
}
