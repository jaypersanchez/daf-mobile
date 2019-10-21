import * as React from 'react'
import {
  Container,
  Screen,
  Button,
  Constants,
  Banner,
  RequestItem,
} from '@kancha/kancha-ui'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { Colors } from '../../theme'

// tslint:disable-next-line:no-var-requires
const avatar1 = require('../../assets/images/space-x-logo.jpg')

// tslint:disable-next-line:no-var-requires
const bannerImage = require('../../assets/images/space-x-banner.jpg')

const Component: React.FC<NavigationStackScreenProps> = ({ navigation }) => {
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
                onPress={() => navigation.goBack()}
              />
            </Container>
            <Container flex={1}>
              <Button
                block={Constants.ButtonBlocks.Filled}
                type={Constants.BrandOptions.Primary}
                buttonText={'Accept'}
                onPress={() => navigation.goBack()}
                shadowOpacity={0.2}
              />
            </Container>
          </Container>
        </Container>
      }
    >
      <Container>
        <Banner
          title={'Space X'}
          subTitle={'Blast off to the Moon'}
          avatar={avatar1}
          backgroundImage={bannerImage}
        />
        <Container>
          <RequestItem
            subTitle={'Name'}
            options={[
              {
                id: '01',
                iss: 'None',
                property: 'name',
                value: 'Jack',
                selected: true,
              },
            ]}
          />
          <RequestItem
            subTitle={'Date of Birth'}
            options={[
              {
                id: '02',
                iss: 'None',
                property: 'dateOfBirth',
                value: '24-01-1991',
                selected: true,
              },
            ]}
          />
          <RequestItem
            subTitle={'Location'}
            options={[
              {
                id: '03',
                iss: 'None',
                property: 'location',
                value: 'Ireland',
                selected: true,
              },
            ]}
          />
          <RequestItem
            subTitle={'Phone'}
            itemNote={'Mobile'}
            options={[
              {
                id: '04',
                iss: 'None',
                property: 'phone',
                value: '+555-876-882771',
                selected: true,
              },
            ]}
          />
        </Container>
      </Container>
    </Screen>
  )
}

export default Component
