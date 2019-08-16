/**
 * Serto Mobile App
 *
 */
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Container,
  Text,
  FabButton,
  Constants,
  Screen,
  Credential,
} from '@kancha/kancha-ui'
import { NavigationScreen } from '../../navigators'
import { Icons } from '../../theme'

// tslint:disable-next-line:no-var-requires
const avatar1 = require('../../assets/images/space-x-logo.jpg')

export default (props: NavigationScreen) => {
  const [credentials, addCredential] = useState([
    {
      title: 'Network Maintenance',
      issuer: 'Cern',
      logo: avatar1,
      onPress: () => props.navigation.navigate('Credential'),
    },
    {
      title: 'Credit Worthy',
      issuer: 'Deutsche Bank',
      logo: avatar1,
      onPress: () => props.navigation.navigate('Credential'),
    },
  ])
  // const appendCredential = () => {
  //   addCredential(creds =>
  //     creds.concat([
  //       {
  //         title: 'Aerospace Engineer',
  //         issuer: 'Nasa',
  //         logo: avatar1,
  //         onPress: () => props.navigation.navigate('Modal'),
  //       },
  //     ]),
  //   )
  // }
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
    <Screen
      scrollEnabled
      fabButton={
        <Container>
          <FabButton
            onPress={() =>
              props.navigation.navigate('Scanner', {
                loadRequest,
              })
            }
            icon={Icons.SCAN}
          />
        </Container>
      }
    >
      <Container padding>
        <Container paddingBottom>
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
