import * as React from 'react'
import {
  Container,
  Screen,
  Button,
  Constants,
  Banner,
  RequestItem,
} from '@kancha/kancha-ui'
import { NavigationScreenProps } from 'react-navigation'
import { Colors } from '../theme'

// tslint:disable-next-line:no-var-requires
const avatar1 = require('../assets/images/space-x-logo.jpg')

// tslint:disable-next-line:no-var-requires
const bannerImage = require('../assets/images/space-x-banner.jpg')

const Component: React.FC<NavigationScreenProps> = ({ navigation }) => {
  return (
    <Screen
      statusBarHidden={true}
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
          <RequestItem subTitle={'Name'}>Jack</RequestItem>
          <RequestItem subTitle={'Date of Birth'}>24-01-1991</RequestItem>
          <RequestItem subTitle={'Location'}>Ireland</RequestItem>
          <RequestItem subTitle={'Phone'} itemNote={'Mobile'}>
            555-876-882771
          </RequestItem>
        </Container>
      </Container>
    </Screen>
  )
}

export default Component
