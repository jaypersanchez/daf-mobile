import React, { useState, useEffect } from 'react'
import {
  Container,
  Screen,
  Button,
  Constants,
  Banner,
  RequestItem,
  Toaster,
  Typings,
  Indicator,
  Text,
} from '@kancha/kancha-ui'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { Colors } from '../../theme'

import { saveMessage } from '../../lib/Messages'

// tslint:disable-next-line:no-var-requires
const avatar1 = require('../../assets/images/space-x-logo.jpg')

// tslint:disable-next-line:no-var-requires
const bannerImage = require('../../assets/images/space-x-banner.jpg')

/**
 * Hardcoded data
 */
const nameOptions: Typings.RequestItemSelectable[] = [
  {
    id: '0001',
    iss: 'Deutsche Bank',
    property: 'name',
    value: 'Jane',
    selected: true,
  },
  {
    id: '0002',
    iss: 'Onfido',
    property: 'name',
    value: 'Jenny',
    selected: false,
  },
  {
    id: '0003',
    iss: 'Serto ID',
    property: 'name',
    value: 'Jill',
    selected: false,
  },
]

const lastNameOptions: Typings.RequestItemSelectable[] = [
  {
    id: '0001',
    iss: 'Deutsche Bank',
    property: 'lastName',
    value: 'Morrison',
    selected: true,
  },
  {
    id: '0002',
    iss: 'Onfido',
    property: 'lastName',
    value: 'Kennedy',
    selected: false,
  },
  {
    id: '0003',
    iss: 'Onfido',
    property: 'lastName',
    value: 'Morrison',
    selected: false,
  },
]

const locationOptions: Typings.RequestItemSelectable[] = [
  {
    id: '0001',
    iss: 'Deutsche Bank',
    property: 'location',
    value: 'Ireland',
    selected: true,
  },
  {
    id: '0002',
    iss: 'Onfido',
    property: 'location',
    value: 'Dublin, Ireland',
    selected: false,
  },
  {
    id: '0003',
    iss: 'Onfido',
    property: 'location',
    value: 'Dublin',
    selected: false,
  },
]

const emailOptions: Typings.RequestItemSelectable[] = [
  {
    id: '0001',
    iss: 'Deutsche Bank',
    property: 'location',
    value: 'jack@mymail.com',
    selected: true,
  },
  {
    id: '0002',
    iss: 'Onfido',
    property: 'name',
    value: 'jacky@mymail.com',
    selected: false,
  },
  {
    id: '0003',
    iss: 'Serto Verified',
    property: 'name',
    value: 'jackie_1234@mymail.com',
    selected: false,
  },
]

const phoneOptions: Typings.RequestItemSelectable[] = [
  {
    id: '0001',
    iss: 'Serto Verified',
    property: 'phone',
    value: '+555-321-8763',
    selected: true,
  },
]

const Component: React.FC<NavigationStackScreenProps> = props => {
  const accept = () => {
    props.navigation.goBack()
  }

  const requestData = props.navigation.getParam('requestData')

  const [saving, setSaving] = useState(true)
  const [messageHash, setMessageHash] = useState('')

  useEffect(() => {
    saveMessage(requestData.data).then(message => {
      setMessageHash(message.hash)
      setSaving(false)
    })
  }, [])

  return (
    <Screen
      safeAreaBottom={true}
      safeAreaBottomBackground={Colors.WHITE}
      scrollEnabled={true}
      footerDivider={true}
      footerComponent={
        <Container
          paddingHorizontal={true}
          paddingBottom={true}
          backgroundColor={Colors.WHITE}
        >
          <Container flexDirection={'row'}>
            <Container flex={1}>
              <Button
                block={Constants.ButtonBlocks.Clear}
                type={Constants.BrandOptions.Warning}
                buttonText={'Decline'}
                onPress={() => props.navigation.goBack()}
              />
            </Container>
            <Container flex={1}>
              <Button
                block={Constants.ButtonBlocks.Filled}
                type={Constants.BrandOptions.Primary}
                buttonText={'Accept'}
                onPress={accept}
                shadowOpacity={0.2}
              />
            </Container>
          </Container>
        </Container>
      }
    >
      {saving && (
        <Container>
          <Text>Loading...</Text>
        </Container>
      )}

      {!saving && (
        <Container>
          <Banner
            title={'Space X'}
            subTitle={'Blast off to the Moon'}
            avatar={avatar1}
            backgroundImage={bannerImage}
          />
          <Indicator text={'Share your data with Space X'} />
          <Container>
            <RequestItem
              subTitle={'Firstname'}
              options={nameOptions}
              required={true}
            />
            <RequestItem
              subTitle={'Lastname'}
              options={lastNameOptions}
              required={true}
            />
            <RequestItem
              subTitle={'Location'}
              options={locationOptions}
              required={true}
            />
            <RequestItem
              subTitle={'Email'}
              options={emailOptions}
              required={false}
            />
            <RequestItem
              subTitle={'Phone'}
              options={phoneOptions}
              required={false}
            />
          </Container>
        </Container>
      )}
    </Screen>
  )
}

export default Component
